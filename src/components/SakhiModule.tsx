import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Heart, TrendingUp, AlertCircle, CheckCircle, Moon, Sun, Droplets, Activity, Sparkles, Flower } from 'lucide-react';

interface SakhiModuleProps {
  onBack: () => void;
}

interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  flowIntensity: 'light' | 'medium' | 'heavy';
}

interface CyclePredictions {
  nextPeriod: Date;
  ovulation: Date;
  fertileWindow: { start: Date; end: Date };
  daysUntilNextPeriod: number;
  currentPhase: string;
  phaseDescription: string;
  hormoneLevel: string;
  fertilityScore: number;
  cycleDay: number;
  emotionalSupport: string;
  wellnessTip: string;
}

interface SymptomEntry {
  date: string;
  symptoms: string[];
  mood: string;
  flow: string;
  notes: string;
  energyLevel: number;
  selfCareActivities: string[];
}

const SakhiModule: React.FC<SakhiModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'insights' | 'symptoms' | 'wellness'>('tracker');
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodDate: '',
    cycleLength: 28,
    periodLength: 5,
    flowIntensity: 'medium'
  });
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [predictions, setPredictions] = useState<CyclePredictions | null>(null);

  const calculatePredictions = (data: CycleData): CyclePredictions => {
    if (!data.lastPeriodDate) {
      const today = new Date();
      return {
        nextPeriod: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        ovulation: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        fertileWindow: {
          start: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
          end: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000)
        },
        daysUntilNextPeriod: 28,
        currentPhase: 'Follicular',
        phaseDescription: 'Your body is preparing for ovulation',
        hormoneLevel: 'Rising estrogen',
        fertilityScore: 3,
        cycleDay: 1,
        emotionalSupport: 'Take time for self-care and gentle movement',
        wellnessTip: 'Stay hydrated and eat iron-rich foods'
      };
    }

    const lastPeriod = new Date(data.lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceLastPeriod % data.cycleLength) + 1;
    
    const nextPeriod = new Date(lastPeriod.getTime() + data.cycleLength * 24 * 60 * 60 * 1000);
    const ovulation = new Date(lastPeriod.getTime() + (data.cycleLength - 14) * 24 * 60 * 60 * 1000);
    const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);
    
    const daysUntilNextPeriod = Math.max(0, Math.floor((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    let currentPhase = 'Follicular';
    let phaseDescription = 'Your body is preparing for ovulation';
    let hormoneLevel = 'Rising estrogen';
    let fertilityScore = 2;
    let emotionalSupport = 'Focus on energizing activities';
    let wellnessTip = 'Great time for cardio and strength training';

    if (cycleDay >= 1 && cycleDay <= data.periodLength) {
      currentPhase = 'Menstrual';
      phaseDescription = 'Your period is here - time for rest and renewal';
      hormoneLevel = 'Low estrogen and progesterone';
      fertilityScore = 1;
      emotionalSupport = 'Be gentle with yourself and prioritize comfort';
      wellnessTip = 'Light yoga and warm baths can help with cramps';
    } else if (cycleDay > data.periodLength && cycleDay < data.cycleLength - 14) {
      currentPhase = 'Follicular';
      phaseDescription = 'Energy is building as your body prepares for ovulation';
      hormoneLevel = 'Rising estrogen';
      fertilityScore = 3;
      emotionalSupport = 'Great time to start new projects and socialize';
      wellnessTip = 'Perfect for trying new workouts and activities';
    } else if (cycleDay >= data.cycleLength - 16 && cycleDay <= data.cycleLength - 12) {
      currentPhase = 'Ovulation';
      phaseDescription = 'Peak fertility window - your body is ready';
      hormoneLevel = 'Peak estrogen, LH surge';
      fertilityScore = 5;
      emotionalSupport = 'You may feel confident and social';
      wellnessTip = 'Stay hydrated and listen to your body';
    } else {
      currentPhase = 'Luteal';
      phaseDescription = 'Your body is either preparing for pregnancy or your next cycle';
      hormoneLevel = 'Rising progesterone';
      fertilityScore = 2;
      emotionalSupport = 'Focus on self-care and stress management';
      wellnessTip = 'Gentle exercise and nutritious meals support your body';
    }

    return {
      nextPeriod,
      ovulation,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      daysUntilNextPeriod,
      currentPhase,
      phaseDescription,
      hormoneLevel,
      fertilityScore,
      cycleDay,
      emotionalSupport,
      wellnessTip
    };
  };

  useEffect(() => {
    setPredictions(calculatePredictions(cycleData));
  }, [cycleData]);

  const handleCycleDataUpdate = (field: keyof CycleData, value: any) => {
    setCycleData(prev => ({ ...prev, [field]: value }));
  };

  const addSymptomEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: SymptomEntry = {
      date: today,
      symptoms: [],
      mood: '',
      flow: '',
      notes: '',
      energyLevel: 5,
      selfCareActivities: []
    };
    setSymptoms(prev => [newEntry, ...prev]);
  };

  const updateSymptomEntry = (index: number, field: keyof SymptomEntry, value: any) => {
    setSymptoms(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFertilityColor = (score: number) => {
    if (score <= 2) return 'text-blue-600 bg-blue-50';
    if (score <= 3) return 'text-green-600 bg-green-50';
    return 'text-pink-600 bg-pink-50';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Menstrual': return 'text-red-600 bg-red-50';
      case 'Follicular': return 'text-green-600 bg-green-50';
      case 'Ovulation': return 'text-pink-600 bg-pink-50';
      case 'Luteal': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-pink-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Flower className="w-6 h-6 text-pink-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Sakhi - Menstrual Wellness
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl mb-6 border border-pink-100">
          {[
            { id: 'tracker', label: 'Cycle Tracker', icon: Calendar },
            { id: 'insights', label: 'Insights', icon: TrendingUp },
            { id: 'symptoms', label: 'Symptoms', icon: Activity },
            { id: 'wellness', label: 'Wellness', icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Cycle Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {/* Cycle Setup */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-pink-500 mr-2" />
                Cycle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Period Start Date
                  </label>
                  <input
                    type="date"
                    value={cycleData.lastPeriodDate}
                    onChange={(e) => handleCycleDataUpdate('lastPeriodDate', e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Cycle Length (days)
                  </label>
                  <input
                    type="number"
                    min="21"
                    max="35"
                    value={cycleData.cycleLength}
                    onChange={(e) => handleCycleDataUpdate('cycleLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period Length (days)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={cycleData.periodLength}
                    onChange={(e) => handleCycleDataUpdate('periodLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flow Intensity
                  </label>
                  <select
                    value={cycleData.flowIntensity}
                    onChange={(e) => handleCycleDataUpdate('flowIntensity', e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Status */}
            {predictions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Phase</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getPhaseColor(predictions.currentPhase)}`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {predictions.currentPhase} - Day {predictions.cycleDay}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{predictions.phaseDescription}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 text-pink-500 mr-2" />
                      <span className="text-gray-600">{predictions.hormoneLevel}</span>
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded ${getFertilityColor(predictions.fertilityScore)}`}>
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">
                        Fertility Score: {predictions.fertilityScore}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Dates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 text-pink-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Next Period</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800">
                          {formatDate(predictions.nextPeriod)}
                        </div>
                        <div className="text-xs text-gray-500">
                          in {predictions.daysUntilNextPeriod} days
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Ovulation</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatDate(predictions.ovulation)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Fertile Window</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800">
                          {formatDate(predictions.fertileWindow.start)}
                        </div>
                        <div className="text-xs text-gray-500">
                          to {formatDate(predictions.fertileWindow.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && predictions && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-pink-500 mr-2" />
                Personalized Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Heart className="w-4 h-4 text-pink-500 mr-2" />
                      Emotional Support
                    </h3>
                    <p className="text-sm text-gray-600">{predictions.emotionalSupport}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Activity className="w-4 h-4 text-green-500 mr-2" />
                      Wellness Tip
                    </h3>
                    <p className="text-sm text-gray-600">{predictions.wellnessTip}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                      Energy Level
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                          style={{ width: `${(predictions.fertilityScore / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {predictions.fertilityScore}/5
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Moon className="w-4 h-4 text-indigo-500 mr-2" />
                      Sleep & Recovery
                    </h3>
                    <p className="text-sm text-gray-600">
                      {predictions.currentPhase === 'Menstrual' 
                        ? 'Prioritize 8-9 hours of sleep for recovery'
                        : predictions.currentPhase === 'Ovulation'
                        ? 'You may feel more energetic - maintain good sleep hygiene'
                        : 'Aim for consistent sleep schedule to support hormonal balance'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Symptoms Tab */}
        {activeTab === 'symptoms' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Activity className="w-5 h-5 text-pink-500 mr-2" />
                  Symptom Tracking
                </h2>
                <button
                  onClick={addSymptomEntry}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all font-medium"
                >
                  Add Entry
                </button>
              </div>
              
              {symptoms.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No symptom entries yet. Add your first entry to start tracking!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {symptoms.map((entry, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => updateSymptomEntry(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                          <select
                            value={entry.mood}
                            onChange={(e) => updateSymptomEntry(index, 'mood', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select mood</option>
                            <option value="happy">Happy</option>
                            <option value="calm">Calm</option>
                            <option value="anxious">Anxious</option>
                            <option value="irritable">Irritable</option>
                            <option value="sad">Sad</option>
                            <option value="energetic">Energetic</option>
                            <option value="tired">Tired</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Flow</label>
                          <select
                            value={entry.flow}
                            onChange={(e) => updateSymptomEntry(index, 'flow', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                          >
                            <option value="">No flow</option>
                            <option value="spotting">Spotting</option>
                            <option value="light">Light</option>
                            <option value="medium">Medium</option>
                            <option value="heavy">Heavy</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={entry.notes}
                          onChange={(e) => updateSymptomEntry(index, 'notes', e.target.value)}
                          placeholder="Any additional notes about how you're feeling..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wellness Tab */}
        {activeTab === 'wellness' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Heart className="w-5 h-5 text-pink-500 mr-2" />
                Wellness & Self-Care
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Heart className="w-4 h-4 text-pink-500 mr-2" />
                      Self-Care Reminders
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Take time for gentle movement
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Stay hydrated throughout the day
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Practice mindfulness or meditation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Get adequate sleep (7-9 hours)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Activity className="w-4 h-4 text-green-500 mr-2" />
                      Nutrition Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Iron-rich foods during menstruation</li>
                      <li>• Calcium and magnesium for cramp relief</li>
                      <li>• Complex carbs for stable energy</li>
                      <li>• Omega-3 fatty acids for inflammation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Moon className="w-4 h-4 text-purple-500 mr-2" />
                      Cycle-Synced Activities
                    </h3>
                    {predictions && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">For your {predictions.currentPhase} phase:</p>
                        {predictions.currentPhase === 'Menstrual' && (
                          <ul className="space-y-1">
                            <li>• Gentle yoga or stretching</li>
                            <li>• Warm baths with Epsom salts</li>
                            <li>• Journaling and reflection</li>
                            <li>• Restorative activities</li>
                          </ul>
                        )}
                        {predictions.currentPhase === 'Follicular' && (
                          <ul className="space-y-1">
                            <li>• Try new workouts or activities</li>
                            <li>• Social activities and networking</li>
                            <li>• Creative projects</li>
                            <li>• Goal setting and planning</li>
                          </ul>
                        )}
                        {predictions.currentPhase === 'Ovulation' && (
                          <ul className="space-y-1">
                            <li>• High-intensity workouts</li>
                            <li>• Important conversations</li>
                            <li>• Public speaking or presentations</li>
                            <li>• Social events and dating</li>
                          </ul>
                        )}
                        {predictions.currentPhase === 'Luteal' && (
                          <ul className="space-y-1">
                            <li>• Moderate exercise like walking</li>
                            <li>• Organizing and completing tasks</li>
                            <li>• Self-care and relaxation</li>
                            <li>• Preparing for next cycle</li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                      When to Consult a Doctor
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Severe pain that interferes with daily life</li>
                      <li>• Irregular cycles (shorter than 21 or longer than 35 days)</li>
                      <li>• Heavy bleeding (changing pad/tampon every hour)</li>
                      <li>• Missing periods for 3+ months</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SakhiModule;