import React, { useState } from 'react';
import { ArrowLeft, RotateCw, ArrowRight, ArrowLeft as ArrowPrev } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlashcardsCreatorProps {
  onBack: () => void;
  topic: string;
}

export const FlashcardsCreator: React.FC<FlashcardsCreatorProps> = ({ onBack, topic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    {
      id: 1,
      front: "What is Dijkstra's Algorithm?",
      back: "An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks."
    },
    {
      id: 2,
      front: "Time Complexity of DFS?",
      back: "O(V + E) where V is the number of vertices and E is the number of edges in the graph."
    },
    {
      id: 3,
      front: "Difference between BFS and DFS?",
      back: "BFS uses a Queue data structure and finds the shortest path in unweighted graphs. DFS uses a Stack (or recursion) and is better for path finding and topological sorting."
    },
    {
      id: 4,
      front: "What is a Minimum Spanning Tree?",
      back: "A subset of the edges of a connected, edge-weighted graph that connects all the vertices together, without any cycles and with the minimum possible total edge weight."
    }
  ];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Flashcards: {topic}</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="w-full max-w-xl aspect-[3/2] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="relative w-full h-full preserve-3d transition-transform duration-500"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#171717] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Question</span>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {flashcards[currentIndex].front}
              </h3>
              <div className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Tap to flip
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden bg-blue-600 dark:bg-blue-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-sm font-medium text-blue-200 uppercase tracking-wider mb-4">Answer</span>
              <p className="text-xl font-medium text-white leading-relaxed">
                {flashcards[currentIndex].back}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-4 rounded-full bg-white dark:bg-[#171717] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowPrev className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {flashcards.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="p-4 rounded-full bg-white dark:bg-[#171717] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};