import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, FileText, Bot, ArrowRight, Clock, Plus, MessageSquare, Trash2, X, ChevronRight } from 'lucide-react';
import type { ChatMessage, Screen, Lecture, Assignment, Exam, User as UserType } from '../../types';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { formatDateShort, getTimeUntil } from '../../utils/helpers';
import ReactMarkdown from 'react-markdown';

interface AIChatProps {
  onNavigate: (screen: Screen) => void;
  lectures: Lecture[];
  assignments: Assignment[];
  exams: Exam[];
  user: UserType;
}

interface ChatSession {
  id: string;
  title: string;
  date: string; // ISO string
  messages: ChatMessage[];
  model: string | null;
}

export const AIChat: React.FC<AIChatProps> = ({ onNavigate, lectures, assignments, exams, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  
  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smart_lecture_notes_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smart_lecture_notes_history', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const quickPrompts = [
    { icon: '📚', text: 'Explain today\'s lecture on graph algorithms' },
    { icon: '📝', text: 'When is my next assignment due?' },
    { icon: '🧪', text: 'Generate practice problems for data structures' },
    { icon: '🎯', text: 'What topics are important for the upcoming exam?' },
  ];

  const getSystemContext = () => {
    const now = new Date();
    const upcomingAssignments = assignments
      .filter(a => new Date(a.dueDate) > now && a.status !== 'submitted')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
      .map(a => `- ${a.title} (Due: ${formatDateShort(a.dueDate)}, ${getTimeUntil(a.dueDate)})`)
      .join('\n');

    const upcomingExams = exams
      .filter(e => new Date(e.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2)
      .map(e => `- ${e.title} (Date: ${e.date} at ${e.time})`)
      .join('\n');

    const recentLectures = lectures
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(l => `- ${l.title} (${l.professor})`)
      .join('\n');

    return `
Context Data:
Current Date: ${now.toDateString()}
User: ${user.name}

Upcoming Assignments:
${upcomingAssignments || "No pending assignments."}

Upcoming Exams:
${upcomingExams || "No upcoming exams."}

Recent Lectures:
${recentLectures}

Instructions:
1. You are "Cornelius", an AI study assistant.
2. Use the context data to answer questions about schedules, deadlines, and topics.
3. If you suggest navigating to a specific section of the app, use the format **SectionName** (e.g., **Calendar**, **Assignments**, **Profile**, **Lectures**, **Home**). These will be rendered as interactive buttons for the user.
4. Keep responses helpful, encouraging, and concise.
5. Use Markdown for formatting. Use lists, bold text, and clear paragraphs.
`;
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setCurrentModel(null);
    setShowHistory(false);
    setInputText('');
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setCurrentModel(session.model);
    setShowHistory(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      createNewChat();
    }
  };

  const clearAllHistory = () => {
    if (!confirm('Clear all chat history? This cannot be undone.')) return;
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
    setInputText('');
    setCurrentModel(null);
    setShowHistory(false);
    try {
      localStorage.removeItem('smart_lecture_notes_history');
    } catch (e) {
      console.error('Failed to clear history from localStorage', e);
    }
  };"},{ 

  const updateSession = (id: string, newMessages: ChatMessage[], model: string | null) => {
    setSessions(prev => prev.map(session => {
      if (session.id === id) {
        return {
          ...session,
          messages: newMessages,
          model: model || session.model,
          // Update title if it's the first message user sent
          title: session.messages.length === 0 && newMessages.length > 0 
            ? newMessages[0].content.slice(0, 40) + (newMessages[0].content.length > 40 ? '...' : '')
            : session.title
        };
      }
      return session;
    }));
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    // Determine Session ID
    let activeSessionId = currentSessionId;
    let currentMessages = [...messages, userMessage];

    if (!activeSessionId) {
      // Create new session
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: inputText.slice(0, 40) + (inputText.length > 40 ? '...' : ''),
        date: new Date().toISOString(),
        messages: currentMessages,
        model: null
      };
      setSessions(prev => [newSession, ...prev]);
      activeSessionId = newId;
      setCurrentSessionId(newId);
    } else {
      // Update existing session
      updateSession(activeSessionId, currentMessages, currentModel);
    }

    setMessages(currentMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const context = getSystemContext();
      const fullMessage = `${context}\n\nUser Question: ${userMessage.content}`;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-cbed0fc6/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ message: fullMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        sources: data.sources,
      };

      const finalMessages = [...currentMessages, aiMessage];
      setMessages(finalMessages);
      setCurrentModel(data.model);
      
      // Update session with AI response
      if (activeSessionId) {
        updateSession(activeSessionId, finalMessages, data.model);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure the Gemini API key is configured properly.',
        timestamp: new Date().toISOString(),
      };
      const errorMessages = [...currentMessages, errorMessage];
      setMessages(errorMessages);
      if (activeSessionId) {
        updateSession(activeSessionId, errorMessages, currentModel);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const MarkdownComponents = {
    strong: ({ children }: any) => {
      const text = String(children);
      const lowerName = text.toLowerCase();
      let screen: Screen | null = null;
      
      if (lowerName === 'calendar' || lowerName === 'assignments' || lowerName === 'tasks') screen = 'tasks';
      else if (lowerName === 'lectures' || lowerName === 'notes') screen = 'lectures';
      else if (lowerName === 'profile') screen = 'profile';
      else if (lowerName === 'home' || lowerName === 'dashboard') screen = 'home';
      else if (lowerName === 'chat') screen = 'chat';

      if (screen) {
        return (
          <button
            onClick={() => onNavigate(screen!)}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors transform translate-y-[-1px] cursor-pointer"
          >
            {children}
            <ArrowRight className="w-3 h-3" />
          </button>
        );
      }
      return <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>;
    },
    p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc pl-4 mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-4 mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
    li: ({ children }: any) => <li className="pl-1">{children}</li>,
    h1: ({ children }: any) => <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-lg font-bold mb-2 mt-3 text-gray-900 dark:text-white">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-md font-bold mb-2 mt-2 text-gray-900 dark:text-white">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 my-3 italic text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      return inline ? (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800 dark:text-gray-200">{children}</code>
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto my-3 text-xs font-mono text-gray-800 dark:text-gray-200">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    a: ({ href, children }: any) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
        {children}
      </a>
    ),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Header - Minimalist */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0a0a0a] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">Cornelius</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Chat History"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button 
            onClick={createNewChat}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-20"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-[#0f0f0f] border-l border-gray-200 dark:border-gray-800 z-30 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-white">Previous Chats</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No previous chats</p>
                  </div>
                ) : (
                  sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`w-full p-3 rounded-xl text-left group transition-all border ${
                        currentSessionId === session.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm font-medium line-clamp-2 ${
                          currentSessionId === session.id
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {session.title || 'Untitled Chat'}
                        </span>
                        <div 
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500 text-gray-400"
                          onClick={(e) => deleteSession(e, session.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={clearAllHistory}
                  disabled={sessions.length === 0}
                  className="w-full mb-3 py-2.5 px-4 bg-white dark:bg-transparent text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title="Clear all chat history"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Chats
                </button>

                <button 
                  onClick={createNewChat}
                  className="w-full py-2.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Start New Chat
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-0">
        {messages.length === 0 ? (
          // Empty State - Vibecoded
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-lg mx-auto"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Hello, {user.name.split(' ')[0]}.
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 font-light">
                I'm Cornelius. I've analyzed your upcoming tasks and lectures. What shall we focus on today?
              </p>
            </motion.div>
            
            {/* Quick Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="group p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all text-left border border-transparent hover:border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{prompt.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prompt.text}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          // Messages List
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
              {messages.map((message, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id} 
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gray-200 dark:bg-gray-800'
                        : 'bg-gray-900 dark:bg-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Bot className="w-4 h-4 text-white dark:text-black" />
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-2xl min-w-0 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ${message.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                      {message.role === 'user' ? 'You' : 'Cornelius'}
                    </div>
                    
                    {message.role === 'user' ? (
                      // User Message: Keep bubble style
                      <div className="inline-block rounded-2xl rounded-tr-sm px-5 py-3.5 bg-blue-600 text-white shadow-md text-sm leading-relaxed text-left">
                        {message.content}
                      </div>
                    ) : (
                      // AI Message: Free flowing Markdown
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown components={MarkdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Sources & Model Info (Only for AI) */}
                    {message.role === 'assistant' && (
                      <div className="flex flex-col gap-2 mt-4 ml-1">
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, index) => (
                              <button
                                key={index}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-colors text-xs text-gray-600 dark:text-gray-300 shadow-sm"
                              >
                                <FileText className="w-3 h-3 text-blue-500" />
                                <span className="truncate max-w-[150px]">{source.lectureTitle}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Model Used - Show only on latest AI message or if stored */}
                        {(idx === messages.length - 1 && currentModel) || (idx < messages.length - 1 && idx % 2 !== 0) ? (
                           <div className="flex items-center gap-1.5">
                             <Sparkles className="w-3 h-3 text-gray-400" />
                             <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                               Generated with {idx === messages.length - 1 ? currentModel : 'Gemini'}
                             </span>
                           </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-white dark:text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Cornelius
                    </div>
                    <div className="inline-flex items-center gap-1 bg-transparent px-1 py-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-4 relative z-10">
        <div className="max-w-3xl mx-auto relative flex items-end gap-3 bg-gray-50 dark:bg-gray-900 rounded-2xl p-2 border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cornelius..."
            className="flex-1 max-h-[200px] min-h-[44px] py-2.5 px-3 bg-transparent text-gray-900 dark:text-white resize-none focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm leading-relaxed"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
          Cornelius can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};