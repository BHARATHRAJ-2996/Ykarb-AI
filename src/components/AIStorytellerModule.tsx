import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Pause, Volume2, VolumeX, Heart, Moon, Sun, Sparkles, RotateCcw, Download } from 'lucide-react';

interface ComfortStory {
  id: string;
  title: string;
  content: string;
  duration: string;
  mood: string;
  language: string;
  breathingCues: string[];
  backgroundMusic: string;
  theme: string;
  culturalElements: string[];
}

interface AIStorytellerModuleProps {
  onBack: () => void;
}

function AIStorytellerModule({ onBack }: AIStorytellerModuleProps) {
  const [stories, setStories] = useState<ComfortStory[]>([]);
  const [currentStory, setCurrentStory] = useState<ComfortStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedMood, setSelectedMood] = useState('calm');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const moods = [
    { id: 'calm', label: 'Calm & Peaceful', icon: Moon, color: 'blue', description: 'Gentle stories for relaxation' },
    { id: 'sad', label: 'Comfort & Hope', icon: Heart, color: 'pink', description: 'Uplifting stories for difficult times' },
    { id: 'anxious', label: 'Grounding & Safety', icon: Sparkles, color: 'green', description: 'Stories to ease worry and fear' },
    { id: 'tired', label: 'Rest & Renewal', icon: Moon, color: 'purple', description: 'Bedtime stories for peaceful sleep' },
    { id: 'motivated', label: 'Inspiration & Strength', icon: Sun, color: 'yellow', description: 'Empowering stories of courage' }
  ];

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা' }
  ];

  const backgroundMusic = [
    { id: 'soft-rain', name: 'Gentle Rain', description: 'Soft rainfall sounds' },
    { id: 'forest', name: 'Forest Sounds', description: 'Birds and gentle breeze' },
    { id: 'ocean', name: 'Ocean Waves', description: 'Calming wave sounds' },
    { id: 'meditation', name: 'Meditation Bells', description: 'Soft chimes and bells' },
    { id: 'silence', name: 'Peaceful Silence', description: 'No background music' }
  ];

  useEffect(() => {
    loadSampleStories();
  }, []);

  const loadSampleStories = () => {
    const sampleStories: ComfortStory[] = [
      {
        id: '1',
        title: 'The Moonlit Garden of Healing',
        content: `Once upon a time, in a peaceful village nestled between gentle hills, there lived a young woman named Priya who discovered a secret garden that only appeared under the full moon.

This garden was unlike any other - its flowers glowed with a soft, silver light, and each bloom held the power to heal different kinds of pain. The jasmine flowers eased worry, the roses mended broken hearts, and the lotus blossoms brought deep, restful sleep.

Every night when the moon was full, Priya would walk through this magical garden, breathing in the healing fragrances and feeling her troubles melt away like morning mist. She learned that just as the moon goes through phases - sometimes full, sometimes hidden - her own emotions were natural cycles too.

The wise old gardener, who appeared to be made of moonbeams and stardust, whispered to her: "Dear child, you carry this garden within your heart. Even when the moon is new and the garden seems hidden, its healing power remains with you always."

From that night forward, whenever Priya felt overwhelmed or sad, she would close her eyes and remember the moonlit garden, feeling its peace flow through her like gentle streams of silver light.

And so she learned that healing comes not from avoiding difficult emotions, but from tending to them with the same gentle care a gardener gives to precious flowers.`,
        duration: '8 minutes',
        mood: 'calm',
        language: 'english',
        breathingCues: [
          'Take a deep breath as we enter the garden...',
          'Breathe in the healing jasmine scent...',
          'Feel the peaceful energy with each breath...',
          'Let the moonlight fill your lungs with calm...'
        ],
        backgroundMusic: 'soft-rain',
        theme: 'healing',
        culturalElements: ['Indian flowers', 'Traditional wisdom', 'Moon symbolism']
      },
      {
        id: '2',
        title: 'The Brave Little Diya',
        content: `In a small village during Diwali, there lived a little diya (oil lamp) named Deepika who was afraid she wasn't bright enough to make a difference.

While all the other diyas seemed to shine so brilliantly, Deepika felt her light was too small, too dim to matter. She watched as the grand chandeliers and electric lights illuminated the festival, feeling invisible and unimportant.

But on the darkest night of the year, when a power outage left the entire village in darkness, something magical happened. Deepika's small, steady flame became a beacon of hope. One by one, other diyas were lit from her flame, creating a chain of light that spread throughout the village.

An elderly grandmother, lighting her diya from Deepika's flame, whispered, "Beta, it's not the size of your light that matters, but the warmth and hope it brings to others. Even the smallest flame can chase away the deepest darkness."

As the night progressed, Deepika realized that her gentle, steady light had started a beautiful chain reaction. Hundreds of diyas now glowed because of her courage to shine, no matter how small she felt.

The village celebrated not just Diwali that night, but the lesson that every light matters, every person has value, and sometimes the smallest flames burn the brightest when they're needed most.

From that day forward, Deepika shone with confidence, knowing that her light - however small - had the power to illuminate the world.`,
        duration: '6 minutes',
        mood: 'motivated',
        language: 'english',
        breathingCues: [
          'Breathe in courage like Deepika...',
          'Feel your inner light growing stronger...',
          'Exhale any doubts about your worth...',
          'Shine with confidence in your unique gifts...'
        ],
        backgroundMusic: 'meditation',
        theme: 'self-worth',
        culturalElements: ['Diwali festival', 'Traditional oil lamps', 'Indian values']
      },
      {
        id: '3',
        title: 'चांदनी रात की कहानी (Moonlit Night Story)',
        content: `एक बार की बात है, एक छोटे से गांव में सुमित्रा नाम की एक युवा लड़की रहती थी। वह अक्सर चिंता और उदासी से घिरी रहती थी।

एक चांदनी रात में, जब वह अपनी छत पर बैठी चांद को देख रही थी, उसकी दादी माँ आईं और उसके पास बैठ गईं।

दादी माँ ने कहा, "बेटी, देखो चांद कैसे अपनी रोशनी से पूरी दुनिया को रोशन कर रहा है। कभी-कभी वह छुप जाता है, कभी आधा दिखता है, लेकिन हमेशा वापस आता है।"

"तुम्हारे दुख और खुशी भी चांद की तरह हैं। कभी अंधेरा होता है, कभी उजाला। लेकिन याद रखो, हर अंधेरी रात के बाद सुबह जरूर आती है।"

सुमित्रा ने महसूस किया कि उसकी दादी माँ सही कह रही थीं। जैसे चांद अपने चक्र में बदलता रहता है, वैसे ही जीवन में भी उतार-चढ़ाव आते रहते हैं।

उस रात से, जब भी सुमित्रा उदास होती, वह चांद को देखती और याद करती कि यह भी एक चरण है जो गुजर जाएगा।

और इस तरह, चांदनी रात की उस बातचीत ने उसे जीवन का एक अनमोल पाठ सिखाया - धैर्य रखना और समय के साथ चलना।`,
        duration: '5 minutes',
        mood: 'sad',
        language: 'hindi',
        breathingCues: [
          'गहरी सांस लें और चांद की रोशनी महसूस करें...',
          'दादी माँ के प्यार को अपने दिल में भरें...',
          'धैर्य की शक्ति को सांस के साथ लें...',
          'आशा की किरण को महसूस करें...'
        ],
        backgroundMusic: 'forest',
        theme: 'hope',
        culturalElements: ['Grandmother wisdom', 'Moon symbolism', 'Hindi language']
      }
    ];
    setStories(sampleStories);
  };

  const generateNewStory = async () => {
    setIsGenerating(true);
    
    // Simulate AI story generation
    setTimeout(() => {
      const storyTemplates = {
        calm: {
          title: 'The Peaceful River Journey',
          content: 'A gentle story about finding inner peace through nature...',
          theme: 'tranquility'
        },
        sad: {
          title: 'The Phoenix and the New Dawn',
          content: 'An uplifting tale about rising from difficult times...',
          theme: 'resilience'
        },
        anxious: {
          title: 'The Safe Harbor',
          content: 'A grounding story about finding safety and security...',
          theme: 'security'
        },
        tired: {
          title: 'The Sleepy Village Lullaby',
          content: 'A soothing bedtime story for peaceful rest...',
          theme: 'rest'
        },
        motivated: {
          title: 'The Mountain Climber\'s Dream',
          content: 'An inspiring story about achieving your goals...',
          theme: 'achievement'
        }
      };

      const template = storyTemplates[selectedMood as keyof typeof storyTemplates];
      
      const newStory: ComfortStory = {
        id: Date.now().toString(),
        title: template.title,
        content: template.content + ' (This would be a full AI-generated story based on your current mood and preferences)',
        duration: '7 minutes',
        mood: selectedMood,
        language: selectedLanguage,
        breathingCues: [
          'Take a deep breath to begin...',
          'Breathe with the rhythm of the story...',
          'Feel peace flowing through you...',
          'Let the story\'s wisdom settle in your heart...'
        ],
        backgroundMusic: 'soft-rain',
        theme: template.theme,
        culturalElements: ['Personalized elements', 'Cultural sensitivity', 'Regional wisdom']
      };

      setStories(prev => [newStory, ...prev]);
      setCurrentStory(newStory);
      setIsGenerating(false);
    }, 3000);
  };

  const playStory = (story: ComfortStory) => {
    setCurrentStory(story);
    setIsPlaying(true);
    setCurrentPosition(0);
    
    // Simulate story playback
    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const pauseStory = () => {
    setIsPlaying(false);
  };

  const resetStory = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack} className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Storyteller</h1>
                <p className="text-sm text-gray-600">Personalized comfort stories with voice narration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStory && (
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Story Generator */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Your Personal Story</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling?</label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map(mood => {
                  const Icon = mood.icon;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedMood === mood.id
                          ? `bg-${mood.color}-100 text-${mood.color}-700 border-${mood.color}-200`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-xs font-medium">{mood.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.native}</option>
                ))}
              </select>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Sounds</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  {backgroundMusic.map(music => (
                    <option key={music.id} value={music.id}>{music.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={generateNewStory}
            disabled={isGenerating}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating your personalized story...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate AI Story</span>
              </>
            )}
          </button>
        </div>

        {/* Current Story Player */}
        {currentStory && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{currentStory.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatDuration(currentStory.duration)} • {currentStory.mood} • {currentStory.language}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetStory}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentPosition}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{Math.floor(currentPosition)}%</span>
                <span>{currentStory.duration}</span>
              </div>
            </div>

            {/* Play Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => isPlaying ? pauseStory() : playStory(currentStory)}
                className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>

            {/* Story Content Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Story Preview</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentStory.content.substring(0, 200)}...
              </p>
            </div>

            {/* Breathing Cues */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Breathing Cues Included</h4>
              <ul className="space-y-1">
                {currentStory.breathingCues.map((cue, index) => (
                  <li key={index} className="text-sm text-blue-700">• {cue}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Story Library */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Story Library</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map(story => {
              const moodConfig = moods.find(m => m.id === story.mood);
              const Icon = moodConfig?.icon || BookOpen;
              
              return (
                <div key={story.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 bg-${moodConfig?.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${moodConfig?.color}-600`} />
                    </div>
                    <span className="text-xs text-gray-500">{story.duration}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {story.content.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <span className={`text-xs px-2 py-1 bg-${moodConfig?.color}-100 text-${moodConfig?.color}-700 rounded-full`}>
                        {story.mood}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {story.language}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => playStory(story)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIStorytellerModule;