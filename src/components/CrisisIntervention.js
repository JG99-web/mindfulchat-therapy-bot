'use client';

import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Heart, X, AlertTriangle, Waves } from 'lucide-react';

export default function CrisisIntervention({ crisisLevel, onClose, onConfirmSafety, onStartBreathing }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleConfirmSafety = () => {
    onConfirmSafety();
    handleClose();
  };

  if (!isVisible) return null;

  const getInterventionContent = () => {
    switch (crisisLevel) {
      case 'immediate':
        return {
          title: "IMMEDIATE SAFETY ALERT",
          color: "red",
          bgColor: "bg-red-600",
          textColor: "text-red-900",
          borderColor: "border-red-600",
          message: "You mentioned specific plans that suggest you're in immediate danger. Your safety is the top priority right now.",
          urgentActions: [
            "Call 999 (UK) or 911 (US) if you're in immediate danger",
            "Go to your nearest A&E/emergency room",
            "Call someone you trust to stay with you"
          ]
        };
      
      case 'severe':
        return {
          title: "CRISIS SUPPORT NEEDED",
          color: "orange",
          bgColor: "bg-orange-600",
          textColor: "text-orange-900",
          borderColor: "border-orange-600",
          message: "I'm deeply concerned about what you've shared. You don't have to go through this alone.",
          urgentActions: [
            "Please consider calling for help",
            "Reach out to someone you trust",
            "Remember that this feeling can change"
          ]
        };
      
      default:
        return {
          title: "SUPPORT RESOURCES",
          color: "yellow",
          bgColor: "bg-yellow-600",
          textColor: "text-yellow-900",
          borderColor: "border-yellow-600",
          message: "I notice you're going through a difficult time. Help is available.",
          urgentActions: [
            "Consider reaching out for support",
            "Use coping strategies that work for you",
            "Remember that you matter"
          ]
        };
    }
  };

  const content = getInterventionContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-2xl max-w-md w-full border-4 ${content.borderColor}`}>
        {/* Header */}
        <div className={`${content.bgColor} text-white p-4 rounded-t-lg flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-lg font-bold">{content.title}</h2>
          </div>
          {crisisLevel !== 'immediate' && (
            <button 
              onClick={handleClose}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`${content.textColor} mb-4 font-medium`}>
            {content.message}
          </p>

          {/* Urgent Actions */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Right now:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {content.urgentActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          {/* Crisis Contacts */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">Immediate Help:</h3>
            
            <div className="grid gap-3">
              <a
                href="tel:116123"
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">Call 116 123 (UK)</div>
                  <div className="text-sm text-green-700">Samaritans - Free 24/7</div>
                </div>
              </a>

              <a
                href="tel:988"
                className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Phone className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">Call 988 (US)</div>
                  <div className="text-sm text-red-700">Suicide Prevention Lifeline</div>
                </div>
              </a>

              <a
                href="sms:741741?body=HOME"
                className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Text HOME to 741741 (US)</div>
                  <div className="text-sm text-blue-700">Crisis Text Line</div>
                </div>
              </a>

              {crisisLevel === 'immediate' && (
                <a
                  href="tel:999"
                  className="flex items-center space-x-3 p-3 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <AlertTriangle className="h-5 w-5 text-red-700" />
                  <div>
                    <div className="font-semibold text-red-900">Call 999/112 (UK) or 911 (US)</div>
                    <div className="text-sm text-red-800">Emergency Services</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {/* Breathing Exercise Button (for moderate to severe crisis) */}
            {(crisisLevel === 'moderate' || crisisLevel === 'severe') && onStartBreathing && (
              <button
                onClick={() => {
                  onStartBreathing();
                  handleClose();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Waves className="h-4 w-4" />
                <span>Start Breathing Exercise</span>
              </button>
            )}

            {crisisLevel !== 'immediate' && (
              <button
                onClick={handleConfirmSafety}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>I'm safe for now, continue conversation</span>
              </button>
            )}
            
            <button
              onClick={() => window.open('/crisis', '_blank')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Crisis Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
