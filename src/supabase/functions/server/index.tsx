import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cbed0fc6/health", (c) => {
  return c.json({ status: "ok" });
});

// AI Chat endpoint using Google Gemini
app.post("/make-server-cbed0fc6/chat", async (c) => {
  try {
    const { message } = await c.req.json();
    
    if (!message || typeof message !== 'string') {
      return c.json({ error: "Message is required" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return c.json({ 
        error: "API key not configured. Please set GEMINI_API_KEY in environment variables." 
      }, 500);
    }

    // 1. Dynamic Model Discovery
    // We attempt to list the models available to this API key to avoid 404s.
    let modelsToTry: Array<{ url: string; name: string }> = [];
    
    try {
      console.log("Attempting to discover available Gemini models...");
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listResp = await fetch(listUrl);
      
      if (listResp.ok) {
        const data = await listResp.json();
        const models = data.models || [];
        
        // Filter for models that support generateContent
        const generateModels = models.filter((m: any) => 
          m.supportedGenerationMethods && 
          m.supportedGenerationMethods.includes("generateContent")
        );

        if (generateModels.length > 0) {
          // Sort to prefer flash -> pro -> others
          // The names returned by API usually look like "models/gemini-1.5-flash"
          const preferredOrder = [
            "models/gemini-1.5-flash",
            "models/gemini-1.5-flash-latest",
            "models/gemini-1.5-pro",
            "models/gemini-1.0-pro",
            "models/gemini-pro"
          ];

          generateModels.sort((a: any, b: any) => {
            const indexA = preferredOrder.indexOf(a.name);
            const indexB = preferredOrder.indexOf(b.name);
            // If both are in preference list, lower index wins
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only a is in list, a wins
            if (indexA !== -1) return -1;
            // If only b is in list, b wins
            if (indexB !== -1) return 1;
            // Otherwise maintain order
            return 0;
          });

          // Add dynamically found models to our try list
          generateModels.forEach((m: any) => {
            modelsToTry.push({
              // The name from API already includes 'models/' prefix (e.g. 'models/gemini-1.5-flash')
              url: `https://generativelanguage.googleapis.com/v1beta/${m.name}:generateContent?key=${apiKey}`,
              name: m.name
            });
          });
          
          console.log(`Discovered ${modelsToTry.length} models. Top candidate: ${modelsToTry[0].name}`);
        }
      } else {
        console.warn(`ListModels failed with status ${listResp.status}. using hardcoded fallbacks.`);
      }
    } catch (e) {
      console.warn("Error listing models, using hardcoded fallbacks:", e);
    }

    // 2. Add Hardcoded Fallbacks (if dynamic list is empty or fails)
    if (modelsToTry.length === 0) {
      const fallbacks = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro", 
        "gemini-pro"
      ];
      
      fallbacks.forEach(name => {
        modelsToTry.push({
          url: `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${apiKey}`,
          name: name
        });
      });
    }

    // 3. Execution Loop
    let geminiResponse;
    let success = false;
    let lastError = "";
    let usedModel = "";

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are an AI study assistant for a Smart Lecture Notes application. You help students with their lectures, assignments, and study materials. Answer the following question helpfully and concisely:\n\n${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    for (const modelConfig of modelsToTry) {
      try {
        console.log(`Trying model: ${modelConfig.name}...`);
        const response = await fetch(modelConfig.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          geminiResponse = response;
          success = true;
          usedModel = modelConfig.name;
          console.log(`Success with model: ${usedModel}`);
          break;
        } else {
          const errorText = await response.text();
          lastError = `${response.status} - ${errorText}`;
          console.warn(`Model ${modelConfig.name} failed: ${lastError}`);
          
          // If 403 (Permission Denied) or 400 (Bad Request), trying other models might not help if it's a global key issue,
          // but we continue anyway just in case another model has different permissions/requirements.
        }
      } catch (err) {
        console.error(`Network error with model ${modelConfig.name}:`, err);
        lastError = String(err);
      }
    }

    if (!success || !geminiResponse) {
      console.error(`All Gemini models failed. Last error: ${lastError}`);
      return c.json({ 
        error: "Failed to connect to AI service.",
        details: "Unable to find a working Gemini model. Please check your API key permissions.",
        last_api_error: lastError
      }, 500);
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the response text
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";

    // Mock sources
    const sources = message.toLowerCase().includes('lecture') || message.toLowerCase().includes('explain') ? [
      {
        lectureId: 'lec-001',
        lectureTitle: 'Advanced Graph Algorithms',
        timestamp: '00:15:30',
        excerpt: 'Discussion of Dijkstra\'s algorithm and its applications...'
      }
    ] : [];

    return c.json({
      response: aiResponse,
      sources: sources,
      model: usedModel 
    });

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return c.json({ 
      error: "An error occurred while processing your request",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);
