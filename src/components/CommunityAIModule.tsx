import React, { useState, useEffect } from 'react';
import { Users, Send, Shield, Heart, AlertTriangle, Star, MessageCircle, Filter, Globe } from 'lucide-react';

interface CommunityMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  topic: 'period' | 'mental-health' | 'study' | 'motivation';
  likes: number;
  isModerated: boolean;
  supportLevel: number;
  language: string;
}

interface CommunityAIModuleProps {
  onBack: () => void;
}

function CommunityAIModule({ onBack }: CommunityAIModuleProps) {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'all' | 'period' | 'mental-health' | 'study' | 'motivation'>('all');
  const [username] = useState(`Anonymous_${Math.floor(Math.random() * 1000)}`);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const topics = [
    { id: 'all', label: 'All Topics', icon: MessageCircle, color: 'gray' },
    { id: 'period', label: 'Period Support', icon: Heart, color: 'pink' },
    { id: 'mental-health', label: 'Mental Wellness', icon: Shield, color: 'green' },
    { id: 'study', label: 'Study Tips', icon: Star, color: 'blue' },
    { id: 'motivation', label: 'Motivation', icon: Users, color: 'purple' }
  ];

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिंदी' },
    { code: 'tamil', name: 'தமிழ்' },
    { code: 'telugu', name: 'తెలుగు' }
  ];

  useEffect(() => {
    // Load sample community messages
    const sampleMessages: CommunityMessage[] = [
      {
        id: '1',
        username: 'Moonflower_24',
        message: 'Having really bad cramps today. Any natural remedies that work for you all?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        topic: 'period',
        likes: 12,
        isModerated: true,
        supportLevel: 8,
        language: 'english'
      },
      {
        id: '2',
        username: 'StudyBuddy_99',
        message: 'Exam stress is getting to me. How do you all manage anxiety during study time?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        topic: 'study',
        likes: 8,
        isModerated: true,
        supportLevel: 7,
        language: 'english'
      },
      {
        id: '3',
        username: 'Sunshine_Girl',
        message: 'Feeling overwhelmed lately. Just wanted to say you\'re all amazing and we\'re in this together 💛',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        topic: 'mental-health',
        likes: 25,
        isModerated: true,
        supportLevel: 9,
        language: 'english'
      },
      {
        id: '4',
        username: 'WiseOwl_123',
        message: 'Try ginger tea and a warm compress for cramps. Also, gentle yoga helps me a lot!',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        topic: 'period',
        likes: 15,
        isModerated: true,
        supportLevel: 8,
        language: 'english'
      }
    ];
    setMessages(sampleMessages);
  }, []);

  const moderateMessage = (message: string, topic: string): { approved: boolean; suggestedReply?: string; warning?: string } => {
    // AI Moderation Logic
    const toxicKeywords = ['stupid', 'ugly', 'worthless', 'hate', 'kill'];
    const supportiveKeywords = ['understand', 'here for you', 'not alone', 'strong', 'brave', 'support'];
    const crisisKeywords = ['want to die', 'kill myself', 'suicide', 'end it all'];
    
    const messageLower = message.toLowerCase();
    
    // Crisis detection
    if (crisisKeywords.some(keyword => messageLower.includes(keyword))) {
      return {
        approved: false,
        warning: 'Crisis language detected. Please reach out for immediate support.',
        suggestedReply: 'I hear you\'re going through a tough time. You\'re not alone. Would you like some immediate support resources? 🤗'
      };
    }
    
    // Toxic content detection
    if (toxicKeywords.some(keyword => messageLower.includes(keyword))) {
      return {
        approved: false,
        warning: 'Message contains harmful language. Let\'s keep our space supportive and kind.',
        suggestedReply: 'Let\'s keep our community supportive and kind. How can we help you feel better? 💛'
      };
    }
    
    // Generate supportive AI replies
    const contextualReplies = {
      'period': [
        'You\'re not alone in this. Many of us understand exactly what you\'re going through 💛',
        'Period struggles are real. Take care of yourself and be gentle 🌸',
        'Your feelings are completely valid. How can we support you today?'
      ],
      'mental-health': [
        'Thank you for sharing. Your courage to speak up matters 💚',
        'You\'re taking an important step by reaching out. We\'re here for you 🤗',
        'Your mental health matters. You deserve support and care ✨'
      ],
      'study': [
        'Study stress is so real! You\'re doing better than you think 📚',
        'Every small step counts. You\'ve got this! 💪',
        'Learning is a journey. Be patient with yourself 🌱'
      ],
      'motivation': [
        'Your determination is inspiring! Keep going 🌟',
        'You\'re stronger than you know. One step at a time 💫',
        'Believe in yourself - you have everything you need inside you ✨'
      ]
    };
    
    const replies = contextualReplies[topic as keyof typeof contextualReplies] || contextualReplies.motivation;
    const suggestedReply = replies[Math.floor(Math.random() * replies.length)];
    
    return { approved: true, suggestedReply };
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const topicForMessage = selectedTopic === 'all' ? 'motivation' : selectedTopic;
    const moderation = moderateMessage(newMessage, topicForMessage);
    
    if (!moderation.approved) {
      alert(moderation.warning);
      return;
    }
    
    const message: CommunityMessage = {
      id: Date.now().toString(),
      username,
      message: newMessage,
      timestamp: new Date(),
      topic: topicForMessage as any,
      likes: 0,
      isModerated: true,
      supportLevel: Math.floor(Math.random() * 5) + 5,
      language: selectedLanguage
    };
    
    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    
    // Simulate AI-generated supportive reply
    if (moderation.suggestedReply) {
      setTimeout(() => {
        const aiReply: CommunityMessage = {
          id: (Date.now() + 1).toString(),
          username: 'YkarbAI_Helper',
          message: moderation.suggestedReply!,
          timestamp: new Date(),
          topic: topicForMessage as any,
          likes: Math.floor(Math.random() * 10) + 5,
          isModerated: true,
          supportLevel: 9,
          language: selectedLanguage
        };
        setMessages(prev => [aiReply, ...prev]);
      }, 2000);
    }
  };

  const likeMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  const filteredMessages = selectedTopic === 'all' 
    ? messages 
    : messages.filter(msg => msg.topic === selectedTopic);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack} className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-purple-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Community AI</h1>
                <p className="text-sm text-gray-600">Safe, moderated support groups</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {topics.map(topic => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  selectedTopic === topic.id
                    ? `bg-${topic.color}-100 text-${topic.color}-700 border-${topic.color}-200`
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } border`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* Community Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">AI-Moderated Safe Space</h3>
              <p className="text-sm text-blue-700">
                Our AI moderates all messages for safety. Be kind, supportive, and respectful. 
                Crisis support is available 24/7. Your privacy is protected with anonymous usernames.
              </p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts, ask for support, or offer encouragement..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">Posting as: {username}</span>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {filteredMessages.map(message => {
            const topic = topics.find(t => t.id === message.topic);
            return (
              <div key={message.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {message.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{message.username}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-${topic?.color}-100 text-${topic?.color}-700`}>
                          {topic?.label}
                        </span>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {message.username === 'YkarbAI_Helper' && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      AI Helper
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3 leading-relaxed">{message.message}</p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => likeMessage(message.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{message.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(message.supportLevel / 2)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Support Level</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No messages in this topic yet.</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to start a supportive conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityAIModule;