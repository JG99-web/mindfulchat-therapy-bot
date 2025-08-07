import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Clock, Users, Send, Shield, AlertCircle, Coffee } from 'lucide-react';

export default function CommunitySupport({ isOpen, onClose, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [realUsersOnline, setRealUsersOnline] = useState(0);
  const [hasSubmittedMessage, setHasSubmittedMessage] = useState(false);

  // Support rooms - no fake activity counters
  const rooms = [
    { id: 'general', name: 'General Support', description: 'Open discussion for everyone', color: 'blue' },
    { id: 'anxiety', name: 'Anxiety & Stress', description: 'Support for anxiety-related challenges', color: 'purple' },
    { id: 'depression', name: 'Depression Support', description: 'Understanding and coping with depression', color: 'indigo' },
    { id: 'relationships', name: 'Relationships', description: 'Friendship, family, and romantic relationships', color: 'pink' },
    { id: 'work-stress', name: 'Work & Study', description: 'Professional and academic stress', color: 'green' },
    { id: 'recovery', name: 'Recovery Journey', description: 'Addiction and recovery support', color: 'orange' }
  ];

  // Load ONLY real user messages - no fake content
  useEffect(() => {
    if (isOpen) {
      loadRealMessages();
      loadRealUserCount();
    }
  }, [isOpen, selectedRoom]);

  const loadRealMessages = () => {
    // Load actual user-submitted messages only
    const storedMessages = JSON.parse(localStorage.getItem(`communityMessages_${selectedRoom}`) || '[]');
    setMessages(storedMessages);
  };

  const loadRealUserCount = () => {
    // Count actual active users (those who've posted recently)
    const allMessages = JSON.parse(localStorage.getItem('allCommunityMessages') || '[]');
    const recentUsers = new Set();
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    allMessages.forEach(msg => {
      if (msg.timestamp > oneHourAgo) {
        recentUsers.add(msg.userId);
      }
    });
    
    setRealUsersOnline(recentUsers.size);
  };

  // Load real messages when room changes - currently none until backend is connected
  useEffect(() => {
    if (isOpen && selectedRoom) {
      // Load real messages from backend when implemented
      // For now, start with empty array - completely authentic
      setMessages([]);
    }
  }, [isOpen, selectedRoom]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: isAnonymous ? 'Anonymous' : userName || 'User',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hearts: 0,
        room: selectedRoom,
        isCurrentUser: true
      };
      
      // Add to local state immediately for user feedback
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // In a real implementation, this would send to backend
      // TODO: Send to WebSocket/backend when community backend is ready
      console.log('Message would be sent to backend:', message);
    }
  };

  const handleHeartMessage = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, hearts: msg.hearts + 1 }
        : msg
    ));
    
    // TODO: Send heart to backend when community backend is ready
  };

  if (!isOpen) return null;

  const currentRoom = rooms.find(room => room.id === selectedRoom);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar - Room List */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Support Rooms</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full text-left p-4 rounded-xl transition-colors ${
                  selectedRoom === room.id
                    ? `bg-${room.color}-100 border-2 border-${room.color}-300`
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${room.color}-500`}></div>
                  <h4 className="font-medium text-gray-900">{room.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{room.description}</p>
              </button>
            ))}
          </div>

          {/* Community Guidelines */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Community Guidelines</h4>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be kind and respectful</li>
              <li>• No medical advice</li>
              <li>• Maintain anonymity</li>
              <li>• Report harmful content</li>
              <li>• Support, don't judge</li>
            </ul>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className={`p-6 border-b border-gray-200 bg-${currentRoom?.color}-50`}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full bg-${currentRoom?.color}-500`}></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentRoom?.name}</h2>
                <p className="text-gray-600">{currentRoom?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Preparing for real users</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{messages.length} messages</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Anonymous:</label>
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isAnonymous ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready for Real Community
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  This space is prepared for authentic peer-to-peer support. No fake messages, no artificial activity - just real people helping real people.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-green-800">
                    <strong>Your Privacy:</strong> All messages are anonymous by default. You control what you share and how you're identified.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`rounded-xl p-4 ${
                    message.isCurrentUser ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isCurrentUser 
                            ? 'bg-gradient-to-br from-blue-400 to-purple-400' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          <span className="text-white text-sm font-bold">
                            {message.user.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{message.user}</span>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleHeartMessage(message.id)}
                        className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{message.hearts}</span>
                      </button>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your thoughts with the community (currently saved locally only)..."
                  className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              Real community features coming soon. Currently for testing interface only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
