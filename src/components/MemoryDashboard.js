'use client';

import { useState, useEffect } from 'react';
import { Brain, Target, Users, AlertTriangle, Heart, Trophy, X, Calendar } from 'lucide-react';
import { AdaptiveMemory } from '../utils/adaptiveMemory';

export default function MemoryDashboard({ isOpen, onClose, userName }) {
  const [memory, setMemory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && userName) {
      const memoryInstance = new AdaptiveMemory(userName);
      setMemory(memoryInstance);
    }
  }, [isOpen, userName]);

  if (!isOpen || !memory) return null;

  const context = memory.getConversationContext();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'relationships', label: 'People', icon: Users },
    { id: 'insights', label: 'Insights', icon: Heart },
    { id: 'milestones', label: 'Progress', icon: Trophy }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Journey with MindfulChat</h2>
              <p className="text-sm text-gray-600">
                {context.totalSessions} sessions over {context.daysSinceFirstVisit} days
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{context.totalSessions}</div>
                  <div className="text-sm text-blue-800">Total Sessions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{context.activeGoals.length}</div>
                  <div className="text-sm text-green-800">Active Goals</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{memory.memory.milestones.length}</div>
                  <div className="text-sm text-purple-800">Milestones</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{context.daysSinceFirstVisit}</div>
                  <div className="text-sm text-orange-800">Days Together</div>
                </div>
              </div>

              {context.uncelebratedMilestones.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">🎉 Recent Achievements</h3>
                  {context.uncelebratedMilestones.map(milestone => (
                    <div key={milestone.id} className="text-sm text-yellow-700">
                      • {milestone.milestone} ({getDaysAgo(milestone.date)})
                    </div>
                  ))}
                </div>
              )}

              {context.recentEvents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Life Events</h3>
                  <div className="space-y-2">
                    {context.recentEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-start space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-gray-900">{event.event}</div>
                          <div className="text-gray-500">{getDaysAgo(event.dateShared)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              {context.activeGoals.length > 0 ? (
                context.activeGoals.map(goal => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{goal.goal}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Set {getDaysAgo(goal.dateSet)} • {goal.category}
                        </p>
                        {goal.progress.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">Latest progress:</p>
                            <p className="text-sm text-gray-800">{goal.progress[goal.progress.length - 1].note}</p>
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'active' ? 'bg-green-100 text-green-800' :
                        goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No goals tracked yet. Share your aspirations in conversation!</p>
                </div>
              )}
            </div>
          )}

          {/* Relationships Tab */}
          {activeTab === 'relationships' && (
            <div className="space-y-4">
              {context.recentRelationships.length > 0 ? (
                context.recentRelationships.map(relationship => (
                  <div key={relationship.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{relationship.person}</h3>
                        <p className="text-sm text-gray-500">{relationship.relationship}</p>
                        {relationship.context && (
                          <p className="text-sm text-gray-600 mt-1">{relationship.context}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Last mentioned {getDaysAgo(relationship.lastMentioned)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No relationships tracked yet. Share about important people in your life!</p>
                </div>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {context.frequentTriggers.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Known Triggers
                  </h3>
                  <div className="grid gap-3">
                    {context.frequentTriggers.map(trigger => (
                      <div key={trigger.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="font-medium text-orange-900">{trigger.trigger}</div>
                        <div className="text-sm text-orange-700">
                          Severity: {trigger.severity} • Mentioned {trigger.occurrences} time(s)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {context.effectiveCoping.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-green-500" />
                    Effective Coping Strategies
                  </h3>
                  <div className="grid gap-3">
                    {context.effectiveCoping.map(strategy => (
                      <div key={strategy.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="font-medium text-green-900">{strategy.strategy}</div>
                        <div className="text-sm text-green-700">
                          Effectiveness: {strategy.effectiveness} • Used {strategy.timesUsed} time(s)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {memory.memory.conversationInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Conversation Insights</h3>
                  <div className="space-y-2">
                    {memory.memory.conversationInsights.slice(-5).map(insight => (
                      <div key={insight.id} className="text-sm">
                        <div className="text-gray-900">{insight.insight}</div>
                        <div className="text-gray-500">{getDaysAgo(insight.date)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {memory.memory.milestones.length > 0 ? (
                memory.memory.milestones.slice().reverse().map(milestone => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Trophy className={`h-5 w-5 mt-0.5 ${
                        milestone.celebrated ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{milestone.milestone}</h3>
                        <p className="text-sm text-gray-500">
                          {milestone.type} • {formatDate(milestone.date)}
                        </p>
                      </div>
                      {!milestone.celebrated && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          New!
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No milestones yet. Keep going - your progress will be celebrated here!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Your memory is stored locally and remains completely private.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
