import { useState, useEffect } from 'react';
import { X, AlertTriangle, Shield, TrendingUp, Brain, Activity, Clock } from 'lucide-react';
import { CrisisPrediction } from '../utils/crisisPrediction';

export default function CrisisPredictionDashboard({ isOpen, onClose, userName }) {
  const [crisisPredictor, setCrisisPredictor] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [trends, setTrends] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (userName && isOpen) {
      const predictor = new CrisisPrediction(userName);
      setCrisisPredictor(predictor);
      
      const currentAssessment = predictor.getRiskAssessment();
      const currentTrends = predictor.getTrends();
      const preventionSuggestions = predictor.getPreventionSuggestions();
      
      setAssessment(currentAssessment);
      setTrends(currentTrends);
      setSuggestions(preventionSuggestions);
    }
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'medium': return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case 'low': return <Activity className="h-6 w-6 text-yellow-600" />;
      default: return <Shield className="h-6 w-6 text-green-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Wellness Monitor</h2>
              <p className="text-gray-600">AI-powered mental health insights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {assessment && (
            <>
              {/* Current Risk Assessment */}
              <div className={`p-6 rounded-xl border-2 mb-6 ${getRiskColor(assessment.level)}`}>
                <div className="flex items-center space-x-4">
                  {getRiskIcon(assessment.level)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Current Wellness Status</h3>
                    <p className="text-sm">{assessment.message}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold capitalize">{assessment.level}</div>
                    <div className="text-xs opacity-75">Risk Level</div>
                  </div>
                </div>
              </div>

              {/* Trends */}
              {trends && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Mood Trend</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Direction:</span>
                        <span className={`text-sm font-medium ${
                          trends.moodTrend === 'increasing' ? 'text-green-600' :
                          trends.moodTrend === 'decreasing' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {trends.moodTrend}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Average:</span>
                        <span className="text-sm font-medium text-blue-900">
                          {trends.averageMood?.toFixed(1) || 'N/A'}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Risk Pattern</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">Trend:</span>
                        <span className={`text-sm font-medium ${
                          trends.riskTrend === 'decreasing' ? 'text-green-600' :
                          trends.riskTrend === 'increasing' ? 'text-red-600' : 'text-purple-600'
                        }`}>
                          {trends.riskTrend}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">Level:</span>
                        <span className="text-sm font-medium text-purple-900">
                          {trends.averageRisk?.toFixed(1) || '0.0'}/3.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prevention Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Personalized Recommendations
                  </h4>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  How This Works
                </h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Pattern Analysis:</strong> Our AI analyzes your conversation patterns, mood trends, and behavioral indicators to identify potential wellness concerns.
                  </p>
                  <p>
                    <strong>Early Detection:</strong> By recognizing patterns early, we can provide timely interventions and support before situations escalate.
                  </p>
                  <p>
                    <strong>Privacy First:</strong> All analysis happens locally on your device. No personal data is shared or stored externally.
                  </p>
                  <p>
                    <strong>Professional Support:</strong> This tool complements but doesn't replace professional mental health care. Always consult healthcare providers for serious concerns.
                  </p>
                </div>
              </div>
            </>
          )}

          {!assessment && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Building Your Wellness Profile</h3>
              <p className="text-gray-600">
                Continue using the therapy bot to build your personalized wellness insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
