import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { jargonData } from '../data/jargonData';

function Flashcards() {
  const { state, updateFlashcardIndex, masterFlashcard } = useApp();
  const [currentTab, setCurrentTab] = useState('terms');
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = currentTab === 'terms' ? jargonData.terms : jargonData.acronyms;
  const currentCard = data[currentIndex];

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const shuffleCards = () => {
    setFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * data.length));
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleMastered = (difficulty) => {
    masterFlashcard(`${currentTab}-${currentIndex}-${difficulty}`);
    nextCard();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          📚 Flashcards
        </h1>
        <p className="text-xl text-white/80">
          Learn at your own pace with interactive cards
        </p>
      </motion.div>

      {/* Tab Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="glass-card p-2 rounded-xl flex space-x-2">
          <button
            onClick={() => {
              setCurrentTab('terms');
              setCurrentIndex(0);
              setFlipped(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentTab === 'terms'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🔤 General Jargon ({jargonData.terms.length})
          </button>
          <button
            onClick={() => {
              setCurrentTab('acronyms');
              setCurrentIndex(0);
              setFlipped(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentTab === 'acronyms'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🏢 Acronyms ({jargonData.acronyms.length})
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-4 rounded-xl mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">
            Card {currentIndex + 1} of {data.length}
          </span>
          <span className="text-white/80 text-sm">
            {Math.round(((currentIndex + 1) / data.length) * 100)}% Complete
          </span>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
          />
        </div>
      </motion.div>

      {/* Flashcard */}
      <motion.div
        key={`${currentTab}-${currentIndex}`}
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -90 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8"
      >
        <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner relative">
            {/* Front of card */}
            <div className="flip-card-front absolute inset-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={handleFlip}
                className="glass-card p-8 rounded-2xl cursor-pointer h-80 flex flex-col justify-center items-center text-center"
              >
                <div className="text-6xl mb-6">
                  {currentTab === 'terms' ? '🤔' : '🏢'}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {currentTab === 'terms' ? currentCard?.term : currentCard?.acronym}
                </h2>
                {currentCard?.category && (
                  <div className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                    {currentCard.category}
                  </div>
                )}
                <p className="text-white/60 text-sm mt-4">
                  Click to reveal definition
                </p>
              </motion.div>
            </div>

            {/* Back of card */}
            <div className="flip-card-back absolute inset-0">
              <motion.div
                onClick={handleFlip}
                className="glass-card p-8 rounded-2xl cursor-pointer h-80 flex flex-col justify-center text-center"
              >
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {currentTab === 'terms' ? 'Definition:' : 'Full Name:'}
                </h3>
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  {currentTab === 'terms' ? currentCard?.definition : currentCard?.full_name}
                </p>
                {currentTab === 'terms' && currentCard?.example && (
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-white/70 text-sm mb-2">Example:</p>
                    <p className="text-white/90 text-sm italic">
                      "{currentCard.example}"
                    </p>
                  </div>
                )}
                <p className="text-white/60 text-xs mt-4">
                  Click to flip back
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center space-x-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevCard}
          className="glass-card p-3 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shuffleCards}
          className="glass-card p-3 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowPathIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextCard}
          className="glass-card p-3 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowRightIcon className="h-6 w-6 text-white" />
        </motion.button>
      </motion.div>

      {/* Self Assessment */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl text-center"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              How well did you know this term?
            </h3>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMastered('easy')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              >
                <CheckIcon className="h-5 w-5" />
                <span>Easy</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMastered('medium')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Medium
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMastered('hard')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Hard</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Flashcards;
