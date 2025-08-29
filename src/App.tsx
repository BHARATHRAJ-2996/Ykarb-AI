import React, { useState } from 'react';
import { Heart, BookOpen, MessageCircle, Calendar, Plus, Mic, Brain, Sparkles, Flower, Users, MapPin, Utensils } from 'lucide-react';
import SakhiModule from './components/SakhiModule';
import EduCareModule from './components/EduCareModule';
import MitraModule from './components/MitraModule';
import AIEnhancedMitraModule from './components/AIEnhancedMitraModule';
import CommunityAIModule from './components/CommunityAIModule';
import LocalResourcesModule from './components/LocalResourcesModule';
import NutritionCoachModule from './components/NutritionCoachModule';
import AIStorytellerModule from './components/AIStorytellerModule';

function App() {
  const [activeModule, setActiveModule] = useState<'home' | 'sakhi' | 'educare' | 'mitra' | 'ai-mitra' | 'community-ai' | 'local-resources' | 'nutrition-coach' | 'ai-storyteller'>('home');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'sakhi':
        return <SakhiModule onBack={() => setActiveModule('home')} />;
      case 'educare':
        return <EduCareModule onBack={() => setActiveModule('home')} />;
      case 'mitra':
        return <MitraModule onBack={() => setActiveModule('home')} />;
      case 'ai-mitra':
        return <AIEnhancedMitraModule onBack={() => setActiveModule('home')} />;
      case 'community-ai':
        return <CommunityAIModule onBack={() => setActiveModule('home')} />;
      case 'local-resources':
        return <LocalResourcesModule onBack={() => setActiveModule('home')} />;
      case 'nutrition-coach':
        return <NutritionCoachModule onBack={() => setActiveModule('home')} />;
      case 'ai-storyteller':
        return <AIStorytellerModule onBack={() => setActiveModule('home')} />;
      default:
        return <HomePage setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {renderActiveModule()}
    </div>
  );
}

interface HomePageProps {
  setActiveModule: (module: 'home' | 'sakhi' | 'educare' | 'mitra' | 'ai-mitra' | 'community-ai' | 'local-resources' | 'nutrition-coach' | 'ai-storyteller') => void;
}

function HomePage({ setActiveModule }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative">
                <Heart className="w-6 h-6 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ykarb
                </h1>
                <p className="text-sm text-gray-600">Your caring digital companion 💕</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm text-gray-600">Always here for you</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Namaste! I'm here to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                support you
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              I understand your journey as a woman and student. Together, we'll navigate your health, 
              learning, and emotional well-being with care, respect, and cultural sensitivity.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100">
            <p className="text-lg text-gray-700 italic">
              "You are not alone. Your feelings are valid. I'm here to listen without judgment, 
              support you through challenges, and celebrate your victories. Let's grow together." 🌸
            </p>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Core Support Modules</h3>
            <p className="text-gray-600">Choose what feels right for you right now</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Sakhi Module */}
            <div 
              onClick={() => setActiveModule('sakhi')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-100 hover:border-purple-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🌸 Sakhi</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your trusted friend for menstrual health. I'll help you understand your cycle, 
                predict your periods, and support you through every phase with warmth and wisdom.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Smart cycle tracking with predictions
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Emotional support during PMS & periods
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                  Cultural wellness tips & remedies
                </div>
              </div>
              <div className="mt-6 text-sm text-purple-600 font-medium">
                "Your body, your rhythm, your strength 💪"
              </div>
            </div>

            {/* EduCare Module */}
            <div 
              onClick={() => setActiveModule('educare')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 EduCare</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your learning companion who believes in your potential. I'll help transform your 
                voice notes into organized knowledge and support your educational journey.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Voice-to-text with smart summaries
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                  AI-powered study insights
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  Multilingual learning support
                </div>
              </div>
              <div className="mt-6 text-sm text-blue-600 font-medium">
                "Your dreams are valid, your education matters 📖"
              </div>
            </div>

            {/* Mitra Module */}
            <div 
              onClick={() => setActiveModule('mitra')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💚 Mitra</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your emotional sanctuary where you can share anything. I'll listen with empathy, 
                support you through difficult times, and celebrate your strength in your own language.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Safe space for all emotions
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Regional language support
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                  Crisis support & wellness tools
                </div>
              </div>
              <div className="mt-6 text-sm text-green-600 font-medium">
                "You are seen, heard, and valued exactly as you are 🤗"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Enhanced Features */}
      <section className="py-8 px-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">🧠 AI-Enhanced Features</h3>
            <p className="text-gray-600">Advanced AI capabilities for personalized support</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI-Enhanced Mitra */}
            <div 
              onClick={() => setActiveModule('ai-mitra')}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-indigo-100 hover:border-indigo-200 hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                AI Enhanced
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">🧠 AI Mitra</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                10 advanced AI features including Cycle Twin AI, personalized coaching, and intelligent support.
              </p>
              <div className="text-xs text-indigo-600 font-medium">
                "Intelligence meets empathy 🌟"
              </div>
            </div>

            {/* Community AI */}
            <div 
              onClick={() => setActiveModule('community-ai')}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-100 hover:border-purple-200 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">👥 Community AI</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                AI-moderated support groups with anonymous sharing and intelligent crisis detection.
              </p>
              <div className="text-xs text-purple-600 font-medium">
                "Safe spaces, real support 🤝"
              </div>
            </div>

            {/* Local Resources */}
            <div 
              onClick={() => setActiveModule('local-resources')}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-200 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">📍 Local Resources</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                AI-curated local clinics, NGOs, and support services with real-time information.
              </p>
              <div className="text-xs text-blue-600 font-medium">
                "Help nearby, when you need it 🏥"
              </div>
            </div>

            {/* Nutrition Coach */}
            <div 
              onClick={() => setActiveModule('nutrition-coach')}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-orange-100 hover:border-orange-200 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">🥗 Nutrition Coach</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Cycle-aware nutrition guidance with cultural food recommendations and meal tracking.
              </p>
              <div className="text-xs text-orange-600 font-medium">
                "Nourish your body, honor your cycle 🌱"
              </div>
            </div>

            {/* AI Storyteller */}
            <div 
              onClick={() => setActiveModule('ai-storyteller')}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-200 hover:scale-105 md:col-span-2 lg:col-span-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">📖 AI Storyteller</h3>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    Personalized comfort stories with voice narration, breathing cues, and cultural elements for emotional healing.
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    "Stories that heal, voices that comfort 🎭"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">My Promise to You</h3>
            <p className="text-gray-600">Built with love, respect, and understanding</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Emotionally Intelligent</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                I understand your emotions and respond with genuine empathy. Your feelings are always valid here.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Culturally Aware</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                I respect your cultural background and provide support that honors your traditions and values.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Completely Private</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your secrets are safe with me. No judgments, no sharing - just pure, confidential support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affirmation Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-200">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Daily Reminder</h4>
            <p className="text-lg text-gray-700 italic leading-relaxed">
              "You are stronger than you think, braver than you feel, and more loved than you know. 
              Every step you take matters, and I'm honored to walk alongside you on this journey." 🌟
            </p>
            <div className="mt-6 text-sm text-purple-600 font-medium">
              — With love, Ykarb 💕
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-2">
            Ykarb - Supporting women and students with intelligence, empathy, and cultural respect
          </p>
          <p className="text-sm text-gray-500">
            "In every language, in every culture, your well-being matters" 🌍
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;