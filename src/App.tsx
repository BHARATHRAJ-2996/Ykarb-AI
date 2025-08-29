import React, { useState } from 'react';
import { Heart, BookOpen, MessageCircle, Calendar, Plus, Mic, Brain } from 'lucide-react';
import SakhiModule from './components/SakhiModule';
import EduCareModule from './components/EduCareModule';
import MitraModule from './components/MitraModule';

function App() {
  const [activeModule, setActiveModule] = useState<'home' | 'sakhi' | 'educare' | 'mitra'>('home');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'sakhi':
        return <SakhiModule onBack={() => setActiveModule('home')} />;
      case 'educare':
        return <EduCareModule onBack={() => setActiveModule('home')} />;
      case 'mitra':
        return <MitraModule onBack={() => setActiveModule('home')} />;
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
  setActiveModule: (module: 'home' | 'sakhi' | 'educare' | 'mitra') => void;
}

function HomePage({ setActiveModule }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ykarb
                </h1>
                <p className="text-sm text-gray-600">Your caring digital companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Supporting women and students with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              intelligent care
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Multilingual, culturally aware support through three specialized modules designed for your well-being and growth.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sakhi Module */}
            <div 
              onClick={() => setActiveModule('sakhi')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-purple-100 hover:border-purple-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sakhi Module</h3>
              <p className="text-gray-600 mb-6">
                Intelligent menstrual and hormonal health tracking with personalized insights and cycle predictions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Period tracking & predictions
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                  Hormonal health insights
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-300 rounded-full mr-2"></div>
                  Symptom tracking
                </div>
              </div>
            </div>

            {/* EduCare Module */}
            <div 
              onClick={() => setActiveModule('educare')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">EduCare Module</h3>
              <p className="text-gray-600 mb-6">
                Voice-to-text notes and intelligent summaries to enhance your learning experience.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Voice recording & transcription
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                  AI-powered summaries
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
                  Study organization
                </div>
              </div>
            </div>

            {/* Mitra Module */}
            <div 
              onClick={() => setActiveModule('mitra')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Mitra Module</h3>
              <p className="text-gray-600 mb-6">
                Compassionate mental health support in your preferred regional language with cultural sensitivity.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Multilingual support
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  Emotional wellness
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                  Cultural awareness
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-12">Built with care for your privacy</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Emotionally Intelligent</h4>
              <p className="text-sm text-gray-600">Understanding and empathetic responses tailored to your needs</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Culturally Aware</h4>
              <p className="text-sm text-gray-600">Respects your cultural background and regional preferences</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Completely Private</h4>
              <p className="text-sm text-gray-600">Your data stays secure with no judgments, ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">
            Ykarb - Your trusted companion for health, education, and mental wellness
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;