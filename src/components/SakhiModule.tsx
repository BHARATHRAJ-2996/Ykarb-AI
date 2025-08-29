import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Heart, TrendingUp, AlertCircle, CheckCircle, Moon, Sun, Droplets, Activity } from 'lucide-react';

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
}

interface SymptomEntry {
  date: string;
  symptoms: string[];
  mood: string;
  flow: string;
  notes: string;
}

function SakhiModule({ onBack }: SakhiModuleProps) {
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodDate: '',
    cycleLength: 28,
    periodLength: 5,
    flowIntensity: 'medium'
  });
  
  const [predictions, setPredictions] = useState<CyclePredictions | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState('');
  const [flowLevel, setFlowLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>([]);
  const [isSetup, setIsSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'track' | 'insights' | 'calendar'>('overview');

  const calculateAdvancedPredictions = (data: CycleData): CyclePredictions => {
    const lastPeriod = new Date(data.lastPeriodDate);
    const today = new Date();
    
    // Calculate cycle day
    const cycleDay = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const adjustedCycleDay = cycleDay > data.cycleLength ? cycleDay % data.cycleLength : cycleDay;
    
    // Next period calculation
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + data.cycleLength);
    
    // Ovulation calculation (typically 14 days before next period)
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(nextPeriod.getDate() - 14);
    
    // Fertile window (5 days before ovulation + ovulation day + 1 day after)
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);
    
    // Days until next period
    const daysUntilNext = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determine current phase and hormone levels
    let currentPhase = '';
    let phaseDescription = '';
    let hormoneLevel = '';
    let fertilityScore = 0;
    
    if (adjustedCycleDay <= data.periodLength) {
      currentPhase = 'Menstrual Phase';
      phaseDescription = 'Your body is shedding the uterine lining. Rest and self-care are important.';
      hormoneLevel = 'Low estrogen and progesterone';
      fertilityScore = 10;
    } else if (adjustedCycleDay <= 13) {
      currentPhase = 'Follicular Phase';
      phaseDescription = 'Your body is preparing for ovulation. Energy levels may be increasing.';
      hormoneLevel = 'Rising estrogen';
      fertilityScore = 30;
    } else if (adjustedCycleDay >= 12 && adjustedCycleDay <= 16) {
      currentPhase = 'Ovulation Phase';
      phaseDescription = 'Peak fertility window. Your body is releasing an egg.';
      hormoneLevel = 'Peak estrogen, LH surge';
      fertilityScore = 95;
    } else {
      currentPhase = 'Luteal Phase';
      phaseDescription = 'Post-ovulation phase. You might experience PMS symptoms.';
      hormoneLevel = 'High progesterone, declining estrogen';
      fertilityScore = 20;
    }
    
    return {
      nextPeriod,
      ovulation,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      daysUntilNextPeriod: daysUntilNext > 0 ? daysUntilNext : 0,
      currentPhase,
      phaseDescription,
      hormoneLevel,
      fertilityScore,
      cycleDay: adjustedCycleDay
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cycleData.lastPeriodDate) {
      const pred = calculateAdvancedPredictions(cycleData);
      setPredictions(pred);
      setIsSetup(true);
    }
  };

  const saveSymptomEntry = () => {
    if (symptoms.length > 0 || currentMood || flowLevel || notes) {
      const entry: SymptomEntry = {
        date: new Date().toISOString().split('T')[0],
        symptoms,
        mood: currentMood,
        flow: flowLevel,
        notes
      };
      setSymptomHistory(prev => [entry, ...prev]);
      
      // Reset form
      setSymptoms([]);
      setCurrentMood('');
      setFlowLevel('');
      setNotes('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const symptomOptions = [
    'Cramps', 'Headache', 'Bloating', 'Mood swings', 'Fatigue', 
    'Breast tenderness', 'Acne', 'Food cravings', 'Insomnia', 'Back pain',
    'Nausea', 'Diarrhea', 'Constipation', 'Hot flashes', 'Dizziness'
  ];

  const moodOptions = ['Happy', 'Sad', 'Anxious', 'Irritable', 'Calm', 'Energetic', 'Tired'];
  const flowOptions = ['Spotting', 'Light', 'Medium', 'Heavy', 'Very Heavy'];

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getFertilityColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 50) return 'text-orange-600 bg-orange-50';
    if (score >= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Menstrual Phase': return <Droplets className="w-5 h-5 text-red-500" />;
      case 'Follicular Phase': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Ovulation Phase': return <Activity className="w-5 h-5 text-pink-500" />;
      case 'Luteal Phase': return <Moon className="w-5 h-5 text-purple-500" />;
      default: return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sakhi Module</h1>
                <p className="text-sm text-gray-600">Your trusted companion for menstrual health</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!isSetup ? (
          /* Enhanced Setup Form */
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Sakhi</h2>
              <p className="text-gray-600">Let's personalize your menstrual health tracking. This information helps me provide accurate predictions and insights tailored just for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When did your last period start? *
                </label>
                <input
                  type="date"
                  value={cycleData.lastPeriodDate}
                  onChange={(e) => setCycleData(prev => ({ ...prev, lastPeriodDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average cycle length (days)
                  </label>
                  <input
                    type="number"
                    min="21"
                    max="35"
                    value={cycleData.cycleLength}
                    onChange={(e) => setCycleData(prev => ({ ...prev, cycleLength: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Usually 21-35 days</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period length (days)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={cycleData.periodLength}
                    onChange={(e) => setCycleData(prev => ({ ...prev, periodLength: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Usually 2-8 days</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical flow intensity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => setCycleData(prev => ({ ...prev, flowIntensity: intensity }))}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${
                        cycleData.flowIntensity === intensity
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-purple-300'
                      }`}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Start Your Journey with Sakhi
              </button>
            </form>
          </div>
        ) : (
          /* Enhanced Dashboard */
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/60 p-1 rounded-lg w-fit">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'track', label: 'Track Today' },
                { key: 'insights', label: 'Insights' },
                { key: 'calendar', label: 'Calendar' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && predictions && (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Cycle Today</h2>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Cycle Day</p>
                      <p className="text-2xl font-bold text-purple-600">{predictions.cycleDay}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        {getPhaseIcon(predictions.currentPhase)}
                        <div>
                          <p className="font-semibold text-gray-800">{predictions.currentPhase}</p>
                          <p className="text-sm text-gray-600">{predictions.phaseDescription}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Hormone Levels</p>
                        <p className="font-semibold text-blue-800">{predictions.hormoneLevel}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-rose-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Next Period</p>
                        <p className="font-semibold text-gray-800">{formatDate(predictions.nextPeriod)}</p>
                        <p className="text-lg font-bold text-rose-600">{predictions.daysUntilNextPeriod} days to go</p>
                      </div>

                      <div className={`p-4 rounded-lg ${getFertilityColor(predictions.fertilityScore)}`}>
                        <p className="text-sm mb-1">Fertility Score</p>
                        <p className="font-bold text-lg">{predictions.fertilityScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Ovulation</p>
                        <p className="font-semibold text-gray-800">{formatDateShort(predictions.ovulation)}</p>
                      </div>
                      <Activity className="w-8 h-8 text-pink-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Fertile Window</p>
                        <p className="font-semibold text-gray-800">
                          {formatDateShort(predictions.fertileWindow.start)} - {formatDateShort(predictions.fertileWindow.end)}
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Cycle Length</p>
                        <p className="font-semibold text-gray-800">{cycleData.cycleLength} days</p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'track' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Track Today's Symptoms</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium text-gray-700 mb-3">How are you feeling?</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {symptomOptions.map((symptom) => (
                          <button
                            key={symptom}
                            onClick={() => toggleSymptom(symptom)}
                            className={`p-2 rounded-lg border-2 text-xs font-medium transition-colors ${
                              symptoms.includes(symptom)
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-purple-300'
                            }`}
                          >
                            {symptoms.includes(symptom) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {symptom}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-3">Mood</p>
                      <div className="grid grid-cols-3 gap-2">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setCurrentMood(mood)}
                            className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                              currentMood === mood
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-3">Flow Level</p>
                      <div className="grid grid-cols-3 gap-2">
                        {flowOptions.map((flow) => (
                          <button
                            key={flow}
                            onClick={() => setFlowLevel(flow)}
                            className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                              flowLevel === flow
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-red-300'
                            }`}
                          >
                            {flow}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-3">Notes</p>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional notes about how you're feeling today..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={saveSymptomEntry}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Save Today's Entry
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Entries</h3>
                  
                  <div className="space-y-4">
                    {symptomHistory.length > 0 ? (
                      symptomHistory.slice(0, 5).map((entry, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-800">
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            {entry.mood && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {entry.mood}
                              </span>
                            )}
                          </div>
                          {entry.symptoms.length > 0 && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Symptoms:</strong> {entry.symptoms.join(', ')}
                            </p>
                          )}
                          {entry.flow && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Flow:</strong> {entry.flow}
                            </p>
                          )}
                          {entry.notes && (
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {entry.notes}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No entries yet. Start tracking to see your patterns!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && predictions && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Personalized Insights</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Cycle Pattern Analysis</p>
                        <p className="text-sm text-blue-700">
                          Your {cycleData.cycleLength}-day cycle is {cycleData.cycleLength >= 21 && cycleData.cycleLength <= 35 ? 'within normal range' : 'outside typical range'}. 
                          {cycleData.cycleLength === 28 && ' This is considered the average cycle length.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Health Recommendations</p>
                        <p className="text-sm text-green-700">
                          {predictions.currentPhase === 'Menstrual Phase' && 'Focus on rest, hydration, and gentle movement. Iron-rich foods can help replenish what you lose.'}
                          {predictions.currentPhase === 'Follicular Phase' && 'Great time for new projects and intense workouts. Your energy is naturally increasing.'}
                          {predictions.currentPhase === 'Ovulation Phase' && 'Peak energy and social time. Stay hydrated and consider tracking basal body temperature.'}
                          {predictions.currentPhase === 'Luteal Phase' && 'Focus on self-care and stress management. Magnesium and B6 may help with PMS symptoms.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-800">Fertility Awareness</p>
                        <p className="text-sm text-purple-700">
                          {predictions.fertilityScore >= 80 && 'You are in your most fertile window. If trying to conceive, this is optimal timing.'}
                          {predictions.fertilityScore >= 50 && predictions.fertilityScore < 80 && 'Moderate fertility window. Conception is possible but less likely.'}
                          {predictions.fertilityScore < 50 && 'Lower fertility period. Natural family planning users consider this a safer time.'}
                        </p>
                      </div>
                    </div>

                    {symptomHistory.length > 0 && (
                      <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                        <Activity className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-800">Symptom Patterns</p>
                          <p className="text-sm text-orange-700">
                            Based on your tracking, we're learning your unique patterns. Keep logging symptoms for more personalized insights.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Cultural Wellness Tips</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Ayurvedic Wisdom</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Warm foods:</strong> During menstruation, favor warm, cooked foods over cold or raw items.
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Gentle yoga:</strong> Practice restorative poses like child's pose and gentle twists.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Traditional Remedies</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-800">
                            <strong>Ginger tea:</strong> Natural anti-inflammatory that may help with cramps and nausea.
                          </p>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-lg">
                          <p className="text-sm text-pink-800">
                            <strong>Heat therapy:</strong> Warm compress on lower abdomen can provide natural pain relief.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && predictions && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Cycle Calendar</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Upcoming Dates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Droplets className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-gray-800">Next Period</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(predictions.nextPeriod)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Activity className="w-4 h-4 text-pink-500" />
                          <span className="font-medium text-gray-800">Ovulation</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(predictions.ovulation)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-4 h-4 text-orange-500" />
                          <span className="font-medium text-gray-800">Fertile Window</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDateShort(predictions.fertileWindow.start)} - {formatDateShort(predictions.fertileWindow.end)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Cycle Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Menstrual Phase</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Follicular Phase</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Ovulation Phase</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Luteal Phase</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SakhiModule;