import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

interface QuizGeneratorProps {
  onBack: () => void;
  topic: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onBack, topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Mock quiz data
  const questions = [
    {
      id: 1,
      question: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
      options: [
        "O(V^2)",
        "O(E log V)",
        "O(V log E)",
        "O(V + E)"
      ],
      correct: 1,
      explanation: "Using a binary heap (priority queue), Dijkstra's algorithm runs in O(E log V) time complexity."
    },
    {
      id: 2,
      question: "Which data structure is most suitable for implementing a Priority Queue?",
      options: [
        "Array",
        "Linked List",
        "Heap",
        "Stack"
      ],
      correct: 2,
      explanation: "A Heap is the most efficient data structure for implementing a Priority Queue operations."
    },
    {
      id: 3,
      question: "In a directed acyclic graph (DAG), which algorithm is used for topological sorting?",
      options: [
        "Prim's Algorithm",
        "Kruskal's Algorithm",
        "DFS based algorithm",
        "Bellman-Ford Algorithm"
      ],
      correct: 2,
      explanation: "Topological sorting is typically performed using Depth First Search (DFS)."
    }
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
    }
  };

  const isQuizComplete = currentQuestion === questions.length - 1 && showResult;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz: {topic}</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!isQuizComplete ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Question */}
            <div className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
              {questions[currentQuestion].question}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                let buttonStyle = "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800";
                let icon = null;

                if (showResult) {
                  if (index === questions[currentQuestion].correct) {
                    buttonStyle = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                    icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                  } else if (index === selectedAnswer) {
                    buttonStyle = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                    icon = <XCircle className="w-5 h-5 text-red-500" />;
                  } else {
                    buttonStyle = "opacity-50 border-gray-200 dark:border-gray-700";
                  }
                } else if (selectedAnswer === index) {
                   buttonStyle = "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${buttonStyle}`}
                  >
                    <span className="font-medium">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Explanation</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {showResult && (
              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You scored {score} out of {questions.length} correct.
            </p>
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Back to Lecture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};