import React, { useState, useEffect } from 'react';
import { Utensils, Calendar, TrendingUp, Droplets, Apple, Coffee, AlertCircle, CheckCircle, Brain, Heart } from 'lucide-react';

interface NutritionAdvice {
  phase: string;
  recommendations: string[];
  foods: string[];
  supplements: string[];
  hydration: string;
  culturalTips: string[];
  avoidFoods: string[];
  mealTiming: string[];
}

interface FoodEntry {
  id: string;
  food: string;
  time: string;
  portion: string;
  mood: string;
  energy: number;
  date: string;
}

interface NutritionCoachModuleProps {
  onBack: () => void;
}

function NutritionCoachModule({ onBack }: NutritionCoachModuleProps) {
  const [currentCycleDay, setCurrentCycleDay] = useState(15);
  const [nutritionAdvice, setNutritionAdvice] = useState<NutritionAdvice | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [activeTab, setActiveTab] = useState<'advice' | 'tracker' | 'insights'>('advice');

  const cyclePhases = [
    { name: 'Menstrual', days: '1-5', color: 'red' },
    { name: 'Follicular', days: '6-13', color: 'green' },
    { name: 'Ovulation', days: '14-16', color: 'pink' },
    { name: 'Luteal', days: '17-28', color: 'purple' }
  ];

  const commonSymptoms = [
    'cramps', 'bloating', 'headache', 'fatigue', 'mood swings', 
    'breast tenderness', 'acne', 'food cravings', 'nausea'
  ];

  useEffect(() => {
    generateNutritionAdvice();
    loadSampleFoodEntries();
  }, [currentCycleDay, symptoms]);

  const generateNutritionAdvice = () => {
    const phase = getCurrentPhase(currentCycleDay);
    
    const phaseAdvice: { [key: string]: NutritionAdvice } = {
      'Menstrual': {
        phase: 'Menstrual',
        recommendations: [
          'Focus on iron-rich foods to replenish what you\'re losing',
          'Eat warm, cooked foods to support digestion',
          'Include anti-inflammatory foods to reduce cramping'
        ],
        foods: ['Jaggery', 'Dates', 'Spinach', 'Pomegranate', 'Sesame seeds', 'Dark chocolate'],
        supplements: ['Iron', 'Magnesium', 'Vitamin B6'],
        hydration: 'Drink warm water and herbal teas. Aim for 8-10 glasses daily.',
        culturalTips: [
          'Try ajwain (carom seed) water for cramps',
          'Turmeric milk before bed for anti-inflammatory benefits',
          'Ginger tea to reduce nausea and pain'
        ],
        avoidFoods: ['Cold drinks', 'Excessive caffeine', 'Processed foods', 'High sodium foods'],
        mealTiming: ['Eat smaller, frequent meals', 'Have warm breakfast', 'Light dinner before 8 PM']
      },
      'Follicular': {
        phase: 'Follicular',
        recommendations: [
          'Support rising energy with fresh, light foods',
          'Include probiotics for gut health',
          'Focus on foods that support estrogen production'
        ],
        foods: ['Fresh fruits', 'Leafy greens', 'Whole grains', 'Yogurt', 'Flax seeds', 'Broccoli'],
        supplements: ['Probiotics', 'Vitamin D', 'Folate'],
        hydration: 'Stay well hydrated with coconut water and fresh juices.',
        culturalTips: [
          'Include fermented foods like idli, dosa',
          'Fresh mint and coriander in meals',
          'Seasonal fruits for natural energy'
        ],
        avoidFoods: ['Heavy, oily foods', 'Excessive sugar'],
        mealTiming: ['Start day with fruits', 'Balanced lunch', 'Light, early dinner']
      },
      'Ovulation': {
        phase: 'Ovulation',
        recommendations: [
          'Support peak fertility with antioxidant-rich foods',
          'Include healthy fats for hormone production',
          'Stay hydrated for optimal cervical mucus'
        ],
        foods: ['Walnuts', 'Avocado', 'Berries', 'Green tea', 'Almonds', 'Sweet potato'],
        supplements: ['Omega-3', 'Vitamin E', 'Zinc'],
        hydration: 'Increase water intake. Add lemon or cucumber for variety.',
        culturalTips: [
          'Include ghee in moderation',
          'Fresh coconut water for electrolytes',
          'Fennel seeds after meals for digestion'
        ],
        avoidFoods: ['Inflammatory foods', 'Excessive alcohol'],
        mealTiming: ['Protein-rich breakfast', 'Nutrient-dense lunch', 'Light dinner']
      },
      'Luteal': {
        phase: 'Luteal',
        recommendations: [
          'Support progesterone with magnesium-rich foods',
          'Include complex carbs to stabilize mood',
          'Focus on foods that reduce PMS symptoms'
        ],
        foods: ['Bananas', 'Dark chocolate', 'Quinoa', 'Pumpkin seeds', 'Sweet potato', 'Chickpeas'],
        supplements: ['Magnesium', 'Vitamin B6', 'Calcium'],
        hydration: 'Reduce caffeine, increase herbal teas like chamomile.',
        culturalTips: [
          'Warm sesame oil massage for relaxation',
          'Jeera (cumin) water for bloating',
          'Ashwagandha tea for stress relief'
        ],
        avoidFoods: ['Excess salt', 'Refined sugar', 'Caffeine after 2 PM'],
        mealTiming: ['Protein breakfast', 'Balanced lunch', 'Early, light dinner']
      }
    };

    // Add symptom-specific advice
    const advice = { ...phaseAdvice[phase] };
    
    if (symptoms.includes('cramps')) {
      advice.foods.push('Ginger', 'Cinnamon');
      advice.culturalTips.push('Heat therapy with warm cloth');
    }
    
    if (symptoms.includes('bloating')) {
      advice.foods.push('Cucumber', 'Watermelon', 'Fennel');
      advice.culturalTips.push('Jeera water on empty stomach');
    }

    if (symptoms.includes('mood swings')) {
      advice.foods.push('Dark chocolate', 'Nuts', 'Bananas');
      advice.culturalTips.push('Brahmi tea for mental clarity');
    }

    setNutritionAdvice(advice);
  };

  const loadSampleFoodEntries = () => {
    const sampleEntries: FoodEntry[] = [
      {
        id: '1',
        food: 'Oatmeal with berries and almonds',
        time: '8:00 AM',
        portion: '1 bowl',
        mood: 'energetic',
        energy: 8,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        food: 'Spinach and dal curry with rice',
        time: '1:00 PM',
        portion: '1 plate',
        mood: 'satisfied',
        energy: 7,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        food: 'Green tea with ginger',
        time: '4:00 PM',
        portion: '1 cup',
        mood: 'calm',
        energy: 6,
        date: new Date().toISOString().split('T')[0]
      }
    ];
    setFoodEntries(sampleEntries);
  };

  const getCurrentPhase = (cycleDay: number): string => {
    if (cycleDay <= 5) return 'Menstrual';
    if (cycleDay <= 13) return 'Follicular';
    if (cycleDay <= 16) return 'Ovulation';
    return 'Luteal';
  };

  const addFoodEntry = () => {
    if (!newFood.trim()) return;

    const entry: FoodEntry = {
      id: Date.now().toString(),
      food: newFood,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      portion: '1 serving',
      mood: 'neutral',
      energy: 5,
      date: new Date().toISOString().split('T')[0]
    };

    setFoodEntries(prev => [entry, ...prev]);
    setNewFood('');
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, 12));
  };

  const getPhaseColor = (phase: string) => {
    const phaseConfig = cyclePhases.find(p => p.name === phase);
    return phaseConfig?.color || 'gray';
  };

  const currentPhase = getCurrentPhase(currentCycleDay);
  const phaseColor = getPhaseColor(currentPhase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack} className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                <Utensils className="w-5 h-5 text-orange-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Nutrition Coach</h1>
                <p className="text-sm text-gray-600">Cycle-aware nutrition guidance</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Cycle Day</p>
              <p className="text-lg font-bold text-orange-600">{currentCycleDay}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Current Phase Indicator */}
        <div className={`bg-${phaseColor}-50 border border-${phaseColor}-200 rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold text-${phaseColor}-800`}>
                {currentPhase} Phase - Day {currentCycleDay}
              </h2>
              <p className={`text-sm text-${phaseColor}-600`}>
                Your body needs specific nutrients during this phase
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Droplets className={`w-6 h-6 text-${phaseColor}-600 mx-auto mb-1`} />
                <p className="text-xs text-gray-600">{waterIntake}/10 glasses</p>
              </div>
              
              <div className="text-center">
                <Apple className={`w-6 h-6 text-${phaseColor}-600 mx-auto mb-1`} />
                <p className="text-xs text-gray-600">{foodEntries.length} meals logged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 p-1 rounded-lg mb-6 w-fit">
          {[
            { key: 'advice', label: 'AI Nutrition Advice', icon: Brain },
            { key: 'tracker', label: 'Food Tracker', icon: Utensils },
            { key: 'insights', label: 'Insights', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'advice' && nutritionAdvice && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Phase Recommendations
              </h3>
              <ul className="space-y-3">
                {nutritionAdvice.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Foods */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Apple className="w-5 h-5 text-orange-500 mr-2" />
                Recommended Foods
              </h3>
              <div className="flex flex-wrap gap-2">
                {nutritionAdvice.foods.map((food, index) => (
                  <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {food}
                  </span>
                ))}
              </div>
              
              <h4 className="font-medium text-gray-700 mt-4 mb-2">Supplements</h4>
              <div className="flex flex-wrap gap-2">
                {nutritionAdvice.supplements.map((supplement, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {supplement}
                  </span>
                ))}
              </div>
            </div>

            {/* Cultural Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-pink-500 mr-2" />
                Cultural Wellness Tips
              </h3>
              <ul className="space-y-2">
                {nutritionAdvice.culturalTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600">🌿 {tip}</li>
                ))}
              </ul>
            </div>

            {/* Hydration Guide */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                Hydration Guide
              </h3>
              <p className="text-sm text-gray-600 mb-4">{nutritionAdvice.hydration}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today's Progress</span>
                  <button
                    onClick={addWater}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    +1 Glass
                  </button>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-8 rounded ${
                        i < waterIntake ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500">{waterIntake}/10 glasses completed</p>
              </div>
            </div>

            {/* Foods to Avoid */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                Foods to Limit
              </h3>
              <ul className="space-y-2">
                {nutritionAdvice.avoidFoods.map((food, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>

            {/* Meal Timing */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                Meal Timing Tips
              </h3>
              <ul className="space-y-2">
                {nutritionAdvice.mealTiming.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600">⏰ {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Food Entry */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Log Your Meals</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    placeholder="What did you eat? (e.g., Dal rice with vegetables)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={addFoodEntry}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Food Entries */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Today's Meals</h3>
                <div className="space-y-3">
                  {foodEntries.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{entry.food}</p>
                        <p className="text-sm text-gray-500">{entry.time} • {entry.portion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Energy: {entry.energy}/10</p>
                        <p className="text-xs text-gray-500 capitalize">{entry.mood}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Symptoms Tracker */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Current Symptoms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        symptoms.includes(symptom)
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } border`}
                    >
                      {symptom.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Tips</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">💡 Eat iron-rich foods during your period</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">💧 Stay hydrated with warm water and herbal teas</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800">🌿 Try traditional remedies like ginger tea for cramps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Nutrition Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <p className="text-sm text-gray-600">Great job following phase-based nutrition!</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Energy Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Morning</span>
                  <span className="text-sm font-medium text-green-600">High (8/10)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Afternoon</span>
                  <span className="text-sm font-medium text-yellow-600">Medium (6/10)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Evening</span>
                  <span className="text-sm font-medium text-orange-600">Low (4/10)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hydration Goal</span>
                  <span className="text-sm font-medium text-blue-600">6/7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Meal Logging</span>
                  <span className="text-sm font-medium text-green-600">5/7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cultural Tips Tried</span>
                  <span className="text-sm font-medium text-purple-600">3 new tips</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NutritionCoachModule;