'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Heart, Waves } from 'lucide-react';

export default function BreathingExercise({ isOpen, onClose, technique = '4-7-8' }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(technique);
  const intervalRef = useRef(null);

  const techniques = {
    '4-7-8': {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8. Great for anxiety and sleep.',
      inhale: 4,
      hold: 7,
      exhale: 8,
      totalCycles: 4,
      color: 'blue'
    },
    'box': {
      name: 'Box Breathing',
      description: 'Equal counts for each phase. Used by Navy SEALs for stress management.',
      inhale: 4,
      hold: 4,
      exhale: 4,
      hold2: 4,
      totalCycles: 5,
      color: 'green'
    },
    'calm': {
      name: 'Calming Breath',
      description: 'Simple technique for immediate relaxation.',
      inhale: 4,
      hold: 2,
      exhale: 6,
      totalCycles: 6,
      color: 'purple'
    },
    'energize': {
      name: 'Energizing Breath',
      description: 'Quick technique to boost focus and energy.',
      inhale: 3,
      hold: 1,
      exhale: 3,
      totalCycles: 8,
      color: 'orange'
    }
  };

  const currentTechnique = techniques[selectedTechnique];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          const newCount = prev + 1;
          
          // Determine current phase and when to switch
          if (phase === 'inhale' && newCount >= currentTechnique.inhale) {
            setPhase(currentTechnique.hold ? 'hold' : 'exhale');
            return 0;
          } else if (phase === 'hold' && newCount >= currentTechnique.hold) {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && newCount >= currentTechnique.exhale) {
            if (currentTechnique.hold2) {
              setPhase('hold2');
              return 0;
            } else {
              setCycle(prev => prev + 1);
              setPhase('inhale');
              return 0;
            }
          } else if (phase === 'hold2' && newCount >= currentTechnique.hold2) {
            setCycle(prev => prev + 1);
            setPhase('inhale');
            return 0;
          }
          
          return newCount;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, phase, currentTechnique]);

  // Auto-stop after completing all cycles
  useEffect(() => {
    if (cycle >= currentTechnique.totalCycles) {
      setIsActive(false);
      // Optional: show completion message
    }
  }, [cycle, currentTechnique.totalCycles]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);
    setCycle(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
      case 'hold2':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Ready';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'inhale':
        return 'Slowly breathe in through your nose';
      case 'hold':
      case 'hold2':
        return 'Hold your breath gently';
      case 'exhale':
        return 'Slowly breathe out through your mouth';
      default:
        return 'Choose a technique and click start';
    }
  };

  const getCircleScale = () => {
    const maxCount = {
      inhale: currentTechnique.inhale,
      hold: currentTechnique.hold || 0,
      exhale: currentTechnique.exhale,
      hold2: currentTechnique.hold2 || 0
    }[phase];

    if (phase === 'inhale') {
      return 1 + (count / maxCount) * 0.5; // Grow during inhale
    } else if (phase === 'exhale') {
      return 1.5 - (count / maxCount) * 0.5; // Shrink during exhale
    } else {
      return phase === 'hold' ? 1.5 : 1; // Stay large during hold
    }
  };

  const getColorClass = () => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[currentTechnique.color] || 'bg-blue-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Waves className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Breathing Exercise</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Technique Selector */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Technique:
          </label>
          <select
            value={selectedTechnique}
            onChange={(e) => {
              setSelectedTechnique(e.target.value);
              resetExercise();
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(techniques).map(([key, tech]) => (
              <option key={key} value={key}>{tech.name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            {currentTechnique.description}
          </p>
        </div>

        {/* Breathing Visual */}
        <div className="p-8 text-center">
          {/* Breathing Circle */}
          <div className="relative mx-auto mb-6" style={{ width: '200px', height: '200px' }}>
            <div 
              className={`absolute inset-0 rounded-full ${getColorClass()} opacity-20 transition-transform duration-1000 ease-in-out`}
              style={{
                transform: `scale(${getCircleScale()})`,
                transformOrigin: 'center'
              }}
            />
            <div 
              className={`absolute inset-4 rounded-full ${getColorClass()} opacity-40 transition-transform duration-1000 ease-in-out`}
              style={{
                transform: `scale(${getCircleScale()})`,
                transformOrigin: 'center'
              }}
            />
            <div 
              className={`absolute inset-8 rounded-full ${getColorClass()} transition-transform duration-1000 ease-in-out flex items-center justify-center`}
              style={{
                transform: `scale(${getCircleScale()})`,
                transformOrigin: 'center'
              }}
            >
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{Math.max(0, (
                  {
                    inhale: currentTechnique.inhale,
                    hold: currentTechnique.hold || 0,
                    exhale: currentTechnique.exhale,
                    hold2: currentTechnique.hold2 || 0
                  }[phase] - count
                ))}</div>
                <div className="text-sm">{getPhaseInstruction()}</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getPhaseInstruction()}
            </h3>
            <p className="text-gray-600">{getPhaseDescription()}</p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Cycle {cycle + 1} of {currentTechnique.totalCycles}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getColorClass()} transition-all duration-300`}
                style={{ 
                  width: `${((cycle) / currentTechnique.totalCycles) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={pauseExercise}
                className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            )}
            
            <button
              onClick={resetExercise}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Completion Message */}
          {cycle >= currentTechnique.totalCycles && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Exercise Complete!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Great job! How are you feeling now?
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
