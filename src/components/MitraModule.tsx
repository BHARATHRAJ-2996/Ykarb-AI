import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, Heart, Globe, Smile, Frown, Meh, Phone, Shield, BookOpen, Users, Calendar, TrendingUp, AlertTriangle, Sparkles, Brain, Flower2, Sun, Moon } from 'lucide-react';

interface MitraModuleProps {
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ykarb';
  timestamp: Date;
  language?: string;
  emotion?: string;
  supportType?: 'empathy' | 'guidance' | 'crisis' | 'celebration';
}

interface MoodEntry {
  id: string;
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited' | 'angry' | 'overwhelmed' | 'peaceful' | 'grateful' | 'tired';
  intensity: number; // 1-10 scale
  date: string;
  note?: string;
  triggers?: string[];
  coping_strategies?: string[];
  culturalContext?: string;
}

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'mindfulness' | 'exercise' | 'sleep' | 'social' | 'learning' | 'cultural';
  deadline: string;
  culturalRelevance?: string;
}

interface CrisisResource {
  name: string;
  number: string;
  description: string;
  available: string;
  region: string;
}

function MitraModule({ onBack }: MitraModuleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [currentMood, setCurrentMood] = useState<string>('');
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoal[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'mood' | 'goals' | 'resources' | 'crisis' | 'wellness'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'english', name: 'English', native: 'English', greeting: 'Hello, dear friend' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी', greeting: 'नमस्ते, प्रिय मित्र' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার, প্রিয় বন্ধু' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம், அன்பு நண்பரே' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం, ప్రియ మిత్రమా' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी', greeting: 'नमस्कार, प्रिय मित्रा' },
    { code: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી', greeting: 'નમસ્તે, પ્રિય મિત્ર' },
    { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ, ಪ್ರಿಯ ಸ್ನೇಹಿತ' },
    { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം', greeting: 'നമസ്കാരം, പ്രിയ സുഹൃത്ത്' },
    { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਪਿਆਰੇ ਦੋਸਤ' }
  ];

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-600', bg: 'bg-green-50', description: 'Feeling joyful and content', emoji: '😊' },
    { value: 'grateful', label: 'Grateful', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', description: 'Feeling thankful and blessed', emoji: '🙏' },
    { value: 'peaceful', label: 'Peaceful', icon: Sun, color: 'text-blue-600', bg: 'bg-blue-50', description: 'Feeling calm and centered', emoji: '😌' },
    { value: 'excited', label: 'Excited', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', description: 'Feeling energetic and enthusiastic', emoji: '🤩' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-600', bg: 'bg-gray-50', description: 'Feeling balanced, neither good nor bad', emoji: '😐' },
    { value: 'tired', label: 'Tired', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', description: 'Feeling exhausted or drained', emoji: '😴' },
    { value: 'anxious', label: 'Anxious', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', description: 'Feeling worried or nervous', emoji: '😰' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-700', bg: 'bg-blue-100', description: 'Feeling down or melancholy', emoji: '😢' },
    { value: 'overwhelmed', label: 'Overwhelmed', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', description: 'Feeling like there\'s too much to handle', emoji: '😵‍💫' },
    { value: 'angry', label: 'Angry', icon: Frown, color: 'text-red-700', bg: 'bg-red-100', description: 'Feeling frustrated or irritated', emoji: '😡' }
  ];

  const ykarbResponses = {
    english: {
      welcome: "Namaste, beautiful soul! I'm Ykarb, and I'm so honored you're here. This is your safe space where every feeling is valid, every story matters, and you are deeply valued. How is your heart today? 💕",
      empathy: [
        "I see you, I hear you, and your feelings are completely valid. You're not alone in this journey. 🤗",
        "Thank you for trusting me with your heart. Your courage to share is beautiful, and I'm here to walk alongside you. 💛",
        "Your emotions are like waves - they come and go, but you remain strong. I believe in your resilience. 🌊",
        "In our culture, we say 'Sab kuch theek ho jayega' - everything will be alright. And I truly believe that for you. 🌸",
        "You are braver than you believe, stronger than you seem, and more loved than you know. I'm here for you. ✨"
      ],
      crisis: [
        "My dear friend, I'm deeply concerned about you. Your life has immense value, and this pain you're feeling is temporary. Please reach out for immediate help. 🆘",
        "You matter so much, and I don't want you to face this alone. There are people trained to help you through this darkness. Please call a crisis line. 💙",
        "I can feel your pain, and I want you to know that healing is possible. You deserve support and care. Please don't give up. 🌈"
      ],
      celebration: [
        "Your joy fills my heart! I'm so proud of you and grateful to witness your happiness. You deserve all the beautiful moments. 🎉",
        "Look at you shining! Your happiness is contagious, and I'm here celebrating with you. Keep embracing these precious moments. ✨",
        "Your smile reaches my soul. Thank you for sharing your light with me. You are a gift to this world. 🌟"
      ]
    },
    hindi: {
      welcome: "नमस्ते, सुंदर आत्मा! मैं यकर्ब हूं, और मुझे खुशी है कि आप यहां हैं। यह आपका सुरक्षित स्थान है जहां हर भावना मान्य है। आज आपका दिल कैसा है? 💕",
      empathy: [
        "मैं आपको देखता हूं, आपकी बात सुनता हूं, और आपकी भावनाएं पूरी तरह से मान्य हैं। आप इस यात्रा में अकेले नहीं हैं। 🤗",
        "आपके दिल को मुझसे साझा करने के लिए धन्यवाद। आपका साहस सुंदर है, और मैं आपके साथ चलने के लिए यहां हूं। 💛",
        "सब कुछ ठीक हो जाएगा। आप जितना सोचते हैं उससे कहीं ज्यादा मजबूत हैं। 🌸"
      ],
      crisis: [
        "मेरे प्रिय मित्र, मैं आपके बारे में बहुत चिंतित हूं। आपका जीवन अमूल्य है। कृपया तुरंत मदद लें। 🆘",
        "आप बहुत महत्वपूर्ण हैं। कृपया अकेले न रहें। मदद उपलब्ध है। 💙"
      ],
      celebration: [
        "आपकी खुशी मेरे दिल को भर देती है! मैं आपसे बहुत खुश हूं। आप सभी सुंदर पलों के हकदार हैं। 🎉",
        "आप कितने चमकदार हैं! आपकी खुशी संक्रामक है। 🌟"
      ]
    }
  };

  const crisisResources: CrisisResource[] = [
    {
      name: 'National Suicide Prevention Lifeline (US)',
      number: '988',
      description: '24/7 crisis support and suicide prevention',
      available: '24/7',
      region: 'United States'
    },
    {
      name: 'AASRA (India)',
      number: '91-9820466726',
      description: 'Emotional support and crisis intervention',
      available: '24/7',
      region: 'India'
    },
    {
      name: 'Samaritans (UK)',
      number: '116 123',
      description: 'Free emotional support for anyone in distress',
      available: '24/7',
      region: 'United Kingdom'
    },
    {
      name: 'Lifeline (Australia)',
      number: '13 11 14',
      description: 'Crisis support and suicide prevention',
      available: '24/7',
      region: 'Australia'
    },
    {
      name: 'Vandrevala Foundation (India)',
      number: '1860-2662-345',
      description: 'Mental health support and counseling',
      available: '24/7',
      region: 'India'
    }
  ];

  useEffect(() => {
    // Initialize with culturally appropriate welcome message
    const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];
    const responses = ykarbResponses[selectedLanguage as keyof typeof ykarbResponses] || ykarbResponses.english;
    
    const welcomeMessage: Message = {
      id: '1',
      text: responses.welcome,
      sender: 'ykarb',
      timestamp: new Date(),
      language: selectedLanguage,
      supportType: 'empathy'
    };
    setMessages([welcomeMessage]);

    // Load sample mood history with cultural context
    const sampleMoods: MoodEntry[] = [
      { 
        id: '1', 
        mood: 'grateful', 
        intensity: 8,
        date: '2025-01-03', 
        note: 'Feeling blessed after family prayers and connecting with loved ones',
        triggers: ['family time', 'spiritual practice', 'gratitude'],
        coping_strategies: ['meditation', 'family support'],
        culturalContext: 'Morning prayers brought peace'
      },
      { 
        id: '2', 
        mood: 'anxious', 
        intensity: 6,
        date: '2025-01-02', 
        note: 'Worried about upcoming exams and family expectations',
        triggers: ['academic pressure', 'family expectations', 'uncertainty'],
        coping_strategies: ['deep breathing', 'talking to elder sister'],
        culturalContext: 'Pressure to succeed for family honor'
      },
      { 
        id: '3', 
        mood: 'peaceful', 
        intensity: 9,
        date: '2025-01-01', 
        note: 'New year meditation and setting intentions brought clarity',
        triggers: ['spiritual practice', 'new beginnings'],
        coping_strategies: ['meditation', 'journaling', 'nature walk'],
        culturalContext: 'Traditional new year rituals'
      }
    ];
    setMoodHistory(sampleMoods);

    // Sample wellness goals with cultural relevance
    const sampleGoals: WellnessGoal[] = [
      {
        id: '1',
        title: 'Daily Meditation & Prayer',
        description: 'Practice mindfulness through traditional meditation and prayer',
        target: 30,
        current: 12,
        unit: 'days',
        category: 'mindfulness',
        deadline: '2025-01-31',
        culturalRelevance: 'Connecting with spiritual roots for inner peace'
      },
      {
        id: '2',
        title: 'Family Connection Time',
        description: 'Meaningful conversations with family members',
        target: 7,
        current: 4,
        unit: 'conversations/week',
        category: 'social',
        deadline: '2025-01-31',
        culturalRelevance: 'Strengthening family bonds and support system'
      },
      {
        id: '3',
        title: 'Cultural Learning',
        description: 'Learn about traditional wellness practices',
        target: 5,
        current: 2,
        unit: 'practices learned',
        category: 'cultural',
        deadline: '2025-01-31',
        culturalRelevance: 'Embracing ancestral wisdom for modern wellness'
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

  const detectCrisisKeywords = (text: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself',
      'self harm', 'cutting', 'overdose', 'worthless', 'hopeless', 
      'can\'t go on', 'better off dead', 'no point living', 'give up',
      'मरना चाहता हूं', 'जीना नहीं चाहता', 'आत्महत्या'
    ];
    const textLower = text.toLowerCase();
    return crisisKeywords.some(keyword => textLower.includes(keyword));
  };

  const generateYkarbResponse = (userMessage: string): string => {
    const responses = ykarbResponses[selectedLanguage as keyof typeof ykarbResponses] || ykarbResponses.english;
    
    // Crisis detection
    if (detectCrisisKeywords(userMessage)) {
      setShowCrisisAlert(true);
      return responses.crisis[Math.floor(Math.random() * responses.crisis.length)];
    }
    
    // Positive emotion detection
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful', 'blessed', 'खुश', 'अच्छा', 'धन्यवाद'];
    if (positiveWords.some(word => userMessage.toLowerCase().includes(word))) {
      return responses.celebration[Math.floor(Math.random() * responses.celebration.length)];
    }
    
    // Default empathetic response
    return responses.empathy[Math.floor(Math.random() * responses.empathy.length)];
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

    // Simulate Ykarb's thoughtful response
    setTimeout(() => {
      const responseText = generateYkarbResponse(inputText);
      const supportType = detectCrisisKeywords(inputText) ? 'crisis' : 
                         inputText.toLowerCase().includes('happy') || inputText.toLowerCase().includes('good') ? 'celebration' : 'empathy';

      const ykarbResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ykarb',
        timestamp: new Date(),
        language: selectedLanguage,
        supportType
      };

      setMessages(prev => [...prev, ykarbResponse]);
      setIsTyping(false);
    }, 2000);
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

  const currentLanguage = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Crisis Alert */}
      {showCrisisAlert && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Crisis Support Available - You're not alone</span>
            </div>
            <button 
              onClick={() => setShowCrisisAlert(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40 ${showCrisisAlert ? 'mt-16' : ''}`}>
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
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center relative">
                  <Heart className="w-5 h-5 text-white" />
                  <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Mitra - Your Emotional Sanctuary</h1>
                  <p className="text-sm text-gray-600">I'm here to listen, support, and care for you 💚</p>
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
            { key: 'chat', label: 'Heart-to-Heart Chat', icon: MessageCircle },
            { key: 'mood', label: 'Mood Garden', icon: Flower2 },
            { key: 'wellness', label: 'Wellness Toolkit', icon: Heart },
            { key: 'goals', label: 'Growth Goals', icon: TrendingUp },
            { key: 'resources', label: 'Support Circle', icon: BookOpen },
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
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'chat' && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Enhanced Chat Interface */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl h-[600px] flex flex-col border border-green-100">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center relative">
                        <Heart className="w-6 h-6 text-white" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Ykarb</h3>
                        <p className="text-sm text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Always here for you • {currentLanguage.greeting}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Safe Space</p>
                      <p className="text-xs text-green-600 font-medium">100% Private</p>
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
                      <div className="flex items-start space-x-3 max-w-[80%]">
                        {message.sender === 'ykarb' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`p-4 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-green-600 text-white'
                              : message.supportType === 'crisis'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : message.supportType === 'celebration'
                              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
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
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Ykarb is thinking with care...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Share what's in your heart... I'm here to listen without judgment 💚"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Your words are safe here. I listen with love and without judgment. 🤗
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Support Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Flower2 className="w-5 h-5 text-green-500 mr-2" />
                  Quick Mood Check
                </h3>
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
                        <div className="text-lg mb-1">{mood.emoji}</div>
                        <p className="text-xs font-medium">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  Your Emotional Journey
                </h3>
                <div className={`p-3 rounded-lg ${
                  getMoodTrend() === 'positive' ? 'bg-green-50 border border-green-200' :
                  getMoodTrend() === 'concerning' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    getMoodTrend() === 'positive' ? 'text-green-800' :
                    getMoodTrend() === 'concerning' ? 'text-red-800' : 'text-blue-800'
                  }`}>
                    {getMoodTrend() === 'positive' && '🌱 Growing stronger'}
                    {getMoodTrend() === 'concerning' && '🤗 Needs gentle care'}
                    {getMoodTrend() === 'stable' && '🌊 Flowing steadily'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {getMoodTrend() === 'positive' && 'Your emotional garden is blooming beautifully'}
                    {getMoodTrend() === 'concerning' && 'Let\'s nurture your heart with extra care'}
                    {getMoodTrend() === 'stable' && 'You\'re maintaining beautiful balance'}
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-green-500 mr-2" />
                  Daily Affirmation
                </h3>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 italic text-center leading-relaxed">
                    "You are worthy of love, respect, and all the beautiful things life has to offer. Your journey matters, and I'm honored to be part of it." 🌸
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs remain similar but with enhanced Ykarb personality and cultural sensitivity */}
        {activeTab === 'mood' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Flower2 className="w-6 h-6 text-green-500 mr-3" />
                Your Mood Garden
              </h2>
              <p className="text-gray-600 mb-6">
                Like flowers in a garden, your emotions are all beautiful and valid. Let's tend to your emotional garden together. 🌺
              </p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <p className="text-xs font-medium text-gray-800">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>

                {currentMood && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How intense is this feeling? (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={moodIntensity}
                        onChange={(e) => setMoodIntensity(parseInt(e.target.value))}
                        className="w-full accent-green-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Gentle</span>
                        <span className="font-medium text-green-600">{moodIntensity}</span>
                        <span>Intense</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addMoodEntry(currentMood)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors"
                    >
                      Plant This Feeling in My Garden 🌱
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-green-500 mr-2" />
                Your Emotional Journey
              </h3>
              
              <div className="space-y-4">
                {moodHistory.length > 0 ? (
                  moodHistory.slice(0, 5).map((entry) => {
                    const moodOption = moodOptions.find(m => m.value === entry.mood);
                    
                    return (
                      <div key={entry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{moodOption?.emoji || '💭'}</span>
                            <div>
                              <p className="font-medium text-gray-800 capitalize">{entry.mood}</p>
                              <p className="text-sm text-gray-500">Intensity: {entry.intensity}/10</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{entry.note}"</p>
                        )}
                        {entry.culturalContext && (
                          <p className="text-xs text-green-600 mt-2">🌸 {entry.culturalContext}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Flower2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Your mood garden is waiting to bloom!</p>
                    <p className="text-sm text-gray-400 mt-2">Start tracking to see your emotional patterns</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Crisis Support Tab */}
        {activeTab === 'crisis' && (
          <div className="space-y-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-red-800">You Are Not Alone</h2>
              </div>
              <p className="text-red-700 mb-6 text-lg leading-relaxed">
                If you're having thoughts of self-harm or suicide, please know that your life has immense value. 
                This pain you're feeling is temporary, but you are precious and irreplaceable. Help is available, and healing is possible. 💙
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <Phone className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                    </div>
                    <p className="text-xl font-mono text-red-600 mb-2 font-bold">{resource.number}</p>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Available: {resource.available}</span>
                      <span>{resource.region}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-lg border border-red-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  Immediate Steps You Can Take
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Right Now:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Call a crisis hotline above</li>
                      <li>• Go to your nearest emergency room</li>
                      <li>• Call emergency services (911, 999, 112)</li>
                      <li>• Reach out to a trusted friend or family member</li>
                      <li>• Stay with someone you trust</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Remember:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• This feeling is temporary</li>
                      <li>• You matter and are deeply loved</li>
                      <li>• Professional help is available</li>
                      <li>• Recovery and healing are possible</li>
                      <li>• Your story isn't over yet</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wellness Tab */}
        {activeTab === 'wellness' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-600" />
                Cultural Wellness Practices
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-1">🧘‍♀️ Pranayama (Breathing)</h4>
                  <p className="text-sm text-green-700">Ancient breathing techniques for inner peace and emotional balance</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1">🙏 Gratitude Practice</h4>
                  <p className="text-sm text-blue-700">Daily thankfulness rooted in cultural traditions</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-1">🌿 Nature Connection</h4>
                  <p className="text-sm text-purple-700">Connecting with nature as our ancestors did</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium text-pink-800 mb-1">👨‍👩‍👧‍👦 Family Bonds</h4>
                  <p className="text-sm text-pink-700">Strengthening relationships that nurture the soul</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Emotional Toolkit
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">5-4-3-2-1 Grounding</h4>
                  <p className="text-sm text-blue-700 mb-2">When anxiety overwhelms:</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• 5 things you can see</li>
                    <li>• 4 things you can touch</li>
                    <li>• 3 things you can hear</li>
                    <li>• 2 things you can smell</li>
                    <li>• 1 thing you can taste</li>
                  </ul>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-2">Loving-Kindness Meditation</h4>
                  <p className="text-sm text-teal-700">Send love to yourself and others:</p>
                  <p className="text-xs text-teal-600 italic mt-1">"May I be happy, may I be peaceful, may I be free from suffering"</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Daily Affirmations
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 italic">"I am worthy of love and respect, exactly as I am"</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800 italic">"My feelings are valid and I honor them with compassion"</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 italic">"I am stronger than my challenges and braver than my fears"</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 italic">"I choose peace over worry and love over fear"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals and Resources tabs would follow similar patterns with enhanced cultural sensitivity and Ykarb personality */}
      </div>
    </div>
  );
}

export default MitraModule;