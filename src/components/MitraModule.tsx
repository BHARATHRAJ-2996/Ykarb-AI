import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, Heart, Globe, Smile, Frown, Meh, Phone, Shield, BookOpen, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface MitraModuleProps {
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mitra';
  timestamp: Date;
  language?: string;
  emotion?: string;
}

interface MoodEntry {
  id: string;
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited' | 'angry' | 'overwhelmed' | 'peaceful';
  intensity: number; // 1-10 scale
  date: string;
  note?: string;
  triggers?: string[];
  coping_strategies?: string[];
}

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'mindfulness' | 'exercise' | 'sleep' | 'social' | 'learning';
  deadline: string;
}

function MitraModule({ onBack }: MitraModuleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoal[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'mood' | 'goals' | 'resources' | 'crisis'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी' },
    { code: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
  ];

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-600', bg: 'bg-green-50', description: 'Feeling joyful and content' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-600', bg: 'bg-blue-50', description: 'Feeling down or melancholy' },
    { value: 'anxious', label: 'Anxious', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', description: 'Feeling worried or nervous' },
    { value: 'angry', label: 'Angry', icon: Frown, color: 'text-red-600', bg: 'bg-red-50', description: 'Feeling frustrated or irritated' },
    { value: 'excited', label: 'Excited', icon: Smile, color: 'text-purple-600', bg: 'bg-purple-50', description: 'Feeling energetic and enthusiastic' },
    { value: 'overwhelmed', label: 'Overwhelmed', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Feeling like there\'s too much to handle' },
    { value: 'peaceful', label: 'Peaceful', icon: Heart, color: 'text-teal-600', bg: 'bg-teal-50', description: 'Feeling calm and centered' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-600', bg: 'bg-gray-50', description: 'Feeling balanced, neither good nor bad' }
  ];

  const culturalResponses = {
    english: [
      "I understand how you're feeling. Your emotions are completely valid, and I'm here to support you through this journey.",
      "Thank you for trusting me with your feelings. Remember, seeking support is a sign of strength, not weakness.",
      "I hear you, and I want you to know that you're not alone. Many people experience similar challenges, and there's always hope.",
      "Your feelings matter, and it's okay to not be okay sometimes. What would help you feel more supported right now?",
      "I appreciate your openness. Taking care of your mental health is just as important as taking care of your physical health."
    ],
    hindi: [
      "मैं समझ सकता हूं कि आप कैसा महसूस कर रहे हैं। आपकी भावनाएं बिल्कुल सही हैं, और मैं इस यात्रा में आपका साथ देने के लिए यहां हूं।",
      "मुझ पर भरोसा करने के लिए धन्यवाद। याद रखें, सहायता मांगना कमजोरी नहीं, बल्कि ताकत का प्रतीक है।",
      "मैं आपकी बात सुन रहा हूं, और मैं चाहता हूं कि आप जानें कि आप अकेले नहीं हैं। हमेशा उम्मीद होती है।"
    ],
    bengali: [
      "আমি বুঝতে পারছি আপনি কেমন অনুভব করছেন। আপনার আবেগ সম্পূর্ণ বৈধ, এবং আমি এই যাত্রায় আপনাকে সমর্থন করার জন্য এখানে আছি।",
      "আমাকে বিশ্বাস করার জন্য ধন্যবাদ। মনে রাখবেন, সাহায্য চাওয়া দুর্বলতার নয়, শক্তির লক্ষণ।"
    ]
  };

  useEffect(() => {
    // Initialize with culturally appropriate welcome message
    const welcomeMessages = {
      english: "Namaste! I'm Mitra, your caring companion. I'm here to listen and support you through any challenges you're facing. How are you feeling today?",
      hindi: "नमस्ते! मैं मित्र हूं, आपका देखभाल करने वाला साथी। मैं यहां आपकी बात सुनने और किसी भी चुनौती में आपका साथ देने के लिए हूं। आज आप कैसा महसूस कर रहे हैं?",
      bengali: "নমস্কার! আমি মিত্র, আপনার যত্নশীল সঙ্গী। আমি এখানে আছি আপনার কথা শুনতে এবং যেকোনো চ্যালেঞ্জে আপনাকে সাহায্য করতে। আজ আপনি কেমন অনুভব করছেন?"
    };

    const welcomeMessage: Message = {
      id: '1',
      text: welcomeMessages[selectedLanguage as keyof typeof welcomeMessages] || welcomeMessages.english,
      sender: 'mitra',
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages([welcomeMessage]);

    // Load sample mood history
    const sampleMoods: MoodEntry[] = [
      { 
        id: '1', 
        mood: 'happy', 
        intensity: 7,
        date: '2025-01-03', 
        note: 'Had a great day with friends, feeling grateful',
        triggers: ['social connection', 'achievement'],
        coping_strategies: ['gratitude practice']
      },
      { 
        id: '2', 
        mood: 'anxious', 
        intensity: 6,
        date: '2025-01-02', 
        note: 'Worried about upcoming exams',
        triggers: ['academic pressure', 'uncertainty'],
        coping_strategies: ['deep breathing', 'study planning']
      },
      { 
        id: '3', 
        mood: 'peaceful', 
        intensity: 8,
        date: '2025-01-01', 
        note: 'New year meditation session was very calming',
        triggers: ['mindfulness practice'],
        coping_strategies: ['meditation', 'nature walk']
      }
    ];
    setMoodHistory(sampleMoods);

    // Sample wellness goals
    const sampleGoals: WellnessGoal[] = [
      {
        id: '1',
        title: 'Daily Meditation',
        description: 'Practice mindfulness meditation for better mental clarity',
        target: 30,
        current: 12,
        unit: 'days',
        category: 'mindfulness',
        deadline: '2025-01-31'
      },
      {
        id: '2',
        title: 'Quality Sleep',
        description: 'Maintain consistent sleep schedule for better mood',
        target: 8,
        current: 6.5,
        unit: 'hours/night',
        category: 'sleep',
        deadline: '2025-01-31'
      }
    ];
    setWellnessGoals(sampleGoals);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate Mitra's culturally aware response
    setTimeout(() => {
      const responses = culturalResponses[selectedLanguage as keyof typeof culturalResponses] || culturalResponses.english;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const mitraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'mitra',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, mitraResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const addMoodEntry = (mood: string, note: string = '') => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      mood: mood as any,
      intensity: moodIntensity,
      date: new Date().toISOString().split('T')[0],
      note,
      triggers: [],
      coping_strategies: []
    };
    setMoodHistory(prev => [newMood, ...prev]);
    setCurrentMood(mood);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'neutral';
    
    const recent = moodHistory.slice(0, 3);
    const avgIntensity = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    
    if (avgIntensity >= 7) return 'positive';
    if (avgIntensity <= 4) return 'concerning';
    return 'stable';
  };

  const crisisResources = [
    {
      name: 'National Crisis Helpline',
      number: '1-800-273-8255',
      description: '24/7 crisis support and suicide prevention',
      available: '24/7'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, confidential crisis support via text',
      available: '24/7'
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information service',
      available: '24/7'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Mitra Module</h1>
                  <p className="text-sm text-gray-600">Your compassionate mental health companion</p>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 bg-white/60 p-1 rounded-lg mb-8 w-fit">
          {[
            { key: 'chat', label: 'Chat', icon: MessageCircle },
            { key: 'mood', label: 'Mood Tracker', icon: Heart },
            { key: 'goals', label: 'Wellness Goals', icon: TrendingUp },
            { key: 'resources', label: 'Resources', icon: BookOpen },
            { key: 'crisis', label: 'Crisis Support', icon: Phone }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'chat' && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Enhanced Chat Interface */}
              <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Mitra</h3>
                        <p className="text-sm text-green-600">Your caring companion • Always here to listen</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-4 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Share what's on your mind... I'm here to listen"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Support Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Mood Check</h3>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.slice(0, 4).map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => addMoodEntry(mood.value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          currentMood === mood.value
                            ? `border-green-500 ${mood.bg}`
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        title={mood.description}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${mood.color}`} />
                        <p className="text-xs font-medium">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Mood Trend</h3>
                <div className={`p-3 rounded-lg ${
                  getMoodTrend() === 'positive' ? 'bg-green-50' :
                  getMoodTrend() === 'concerning' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    getMoodTrend() === 'positive' ? 'text-green-800' :
                    getMoodTrend() === 'concerning' ? 'text-red-800' : 'text-blue-800'
                  }`}>
                    {getMoodTrend() === 'positive' && '📈 Trending positive'}
                    {getMoodTrend() === 'concerning' && '📉 Needs attention'}
                    {getMoodTrend() === 'stable' && '📊 Stable mood'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Daily Affirmations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      "You are stronger than you think and more resilient than you know."
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      "It's okay to not be okay sometimes. Healing is not linear."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">How are you feeling today?</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moodOptions.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => setCurrentMood(mood.value)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          currentMood === mood.value
                            ? `border-green-500 ${mood.bg}`
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        title={mood.description}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${mood.color}`} />
                        <p className="text-sm font-medium text-gray-800">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>

                {currentMood && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intensity (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={moodIntensity}
                        onChange={(e) => setMoodIntensity(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Mild</span>
                        <span className="font-medium">{moodIntensity}</span>
                        <span>Intense</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addMoodEntry(currentMood)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors"
                    >
                      Log Mood Entry
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mood History</h3>
              
              <div className="space-y-4">
                {moodHistory.map((entry) => {
                  const moodOption = moodOptions.find(m => m.value === entry.mood);
                  const Icon = moodOption?.icon || Meh;
                  
                  return (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${moodOption?.color || 'text-gray-600'}`} />
                          <div>
                            <p className="font-medium text-gray-800 capitalize">{entry.mood}</p>
                            <p className="text-sm text-gray-500">Intensity: {entry.intensity}/10</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-2">{entry.note}</p>
                      )}
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Triggers:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.triggers.map((trigger, index) => (
                              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Wellness Goals</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Add New Goal
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {wellnessGoals.map((goal) => (
                  <div key={goal.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        goal.category === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                        goal.category === 'sleep' ? 'bg-blue-100 text-blue-800' :
                        goal.category === 'exercise' ? 'bg-green-100 text-green-800' :
                        goal.category === 'social' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.current}/{goal.target} {goal.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-600" />
                Self-Care Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">Practice deep breathing for 5 minutes daily</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">Write down 3 things you're grateful for</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">Take a 10-minute walk in nature</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-800">Connect with a trusted friend or family member</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Professional Help
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-800">Find a Therapist</p>
                  <p className="text-sm text-blue-700">Connect with licensed mental health professionals in your area</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="font-semibold text-teal-800">Support Groups</p>
                  <p className="text-sm text-teal-700">Join peer support groups for shared experiences</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="font-semibold text-indigo-800">Online Therapy</p>
                  <p className="text-sm text-indigo-700">Access therapy from the comfort of your home</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Educational Resources
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-800">Mental Health Basics</p>
                  <p className="text-sm text-purple-700">Understanding common mental health conditions</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-800">Coping Strategies</p>
                  <p className="text-sm text-green-700">Learn healthy ways to manage stress and emotions</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-800">Mindfulness Guide</p>
                  <p className="text-sm text-orange-700">Introduction to meditation and mindfulness practices</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crisis' && (
          <div className="space-y-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-red-800">Crisis Support</h2>
              </div>
              <p className="text-red-700 mb-6">
                If you're having thoughts of self-harm or suicide, please reach out for immediate help. You are not alone, and there are people who want to support you.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Phone className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                    </div>
                    <p className="text-lg font-mono text-red-600 mb-2">{resource.number}</p>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <p className="text-xs text-gray-500">Available: {resource.available}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Safety Planning
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Warning Signs</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">Feeling hopeless or trapped</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">Withdrawing from friends and family</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">Dramatic mood changes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Coping Strategies</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">Call a trusted friend or family member</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">Practice grounding techniques (5-4-3-2-1)</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">Remove means of self-harm from environment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MitraModule;