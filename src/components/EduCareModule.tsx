import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, FileText, Download, Play, Pause, Trash2, Plus, BookOpen, Brain, Search, Filter, Star, Clock, Volume2 } from 'lucide-react';

interface EduCareModuleProps {
  onBack: () => void;
}

interface Recording {
  id: string;
  title: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
  duration: number;
  date: string;
  subject: string;
  language: string;
  isRecording?: boolean;
  audioUrl?: string;
  tags: string[];
  starred: boolean;
}

interface StudySession {
  id: string;
  title: string;
  recordings: string[];
  date: string;
  totalDuration: number;
}

function EduCareModule({ onBack }: EduCareModuleProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'record' | 'library' | 'sessions' | 'analytics'>('record');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingSubject, setRecordingSubject] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const subjects = ['Mathematics', 'Science', 'History', 'Literature', 'Languages', 'Arts', 'Technology', 'Other'];
  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' }
  ];

  useEffect(() => {
    // Load enhanced sample recordings
    const sampleRecordings: Recording[] = [
      {
        id: '1',
        title: 'Advanced Calculus - Derivatives and Applications',
        transcript: 'Today we explored the fundamental concepts of calculus, focusing on derivatives and their real-world applications. We began with the definition of a derivative as the limit of the difference quotient. The derivative represents the instantaneous rate of change of a function at any given point. We covered the power rule, product rule, and chain rule for finding derivatives. Applications include finding velocity from position functions, optimization problems in business and engineering, and analyzing the behavior of functions through critical points.',
        summary: 'Comprehensive introduction to calculus derivatives covering fundamental rules and practical applications in physics, engineering, and optimization problems.',
        keyPoints: [
          'Derivative as instantaneous rate of change',
          'Power rule: d/dx(x^n) = nx^(n-1)',
          'Product rule and chain rule applications',
          'Real-world applications in optimization',
          'Critical points and function analysis'
        ],
        duration: 2400,
        date: '2025-01-03',
        subject: 'Mathematics',
        language: 'english',
        tags: ['calculus', 'derivatives', 'optimization', 'mathematics'],
        starred: true
      },
      {
        id: '2',
        title: 'Cell Biology - Mitosis and Cell Division',
        transcript: 'In this lecture, we examined the process of mitosis and cell division in eukaryotic cells. Mitosis consists of several phases: prophase, metaphase, anaphase, and telophase, followed by cytokinesis. During prophase, chromosomes condense and the nuclear envelope breaks down. In metaphase, chromosomes align at the cell equator. Anaphase involves chromosome separation, and telophase sees the reformation of nuclear envelopes. This process is crucial for growth, repair, and asexual reproduction in organisms.',
        summary: 'Detailed explanation of mitosis phases and the importance of cell division in biological processes, growth, and reproduction.',
        keyPoints: [
          'Four phases of mitosis: prophase, metaphase, anaphase, telophase',
          'Chromosome behavior during each phase',
          'Cytokinesis and cell division completion',
          'Importance for growth and repair',
          'Differences from meiosis'
        ],
        duration: 1800,
        date: '2025-01-02',
        subject: 'Science',
        language: 'english',
        tags: ['biology', 'cell-division', 'mitosis', 'science'],
        starred: false
      },
      {
        id: '3',
        title: 'World War II - Causes and Global Impact',
        transcript: 'World War II was a global conflict that lasted from 1939 to 1945, involving most of the world\'s nations. The war had multiple causes including the Treaty of Versailles aftermath, economic depression, rise of totalitarian regimes, and failure of the League of Nations. Key events included the invasion of Poland, Pearl Harbor attack, D-Day landings, and the atomic bombings of Hiroshima and Nagasaki. The war resulted in significant geopolitical changes, the establishment of the United Nations, and the beginning of the Cold War era.',
        summary: 'Comprehensive overview of World War II causes, major events, and lasting global impact on international relations and society.',
        keyPoints: [
          'Multiple causes: economic, political, and social factors',
          'Key events: Pearl Harbor, D-Day, atomic bombs',
          'Global participation and alliances',
          'Establishment of United Nations',
          'Beginning of Cold War tensions'
        ],
        duration: 2100,
        date: '2025-01-01',
        subject: 'History',
        language: 'english',
        tags: ['world-war-2', 'history', 'global-conflict', 'politics'],
        starred: true
      }
    ];
    setRecordings(sampleRecordings);

    // Sample study sessions
    const sampleSessions: StudySession[] = [
      {
        id: '1',
        title: 'Mathematics Study Session',
        recordings: ['1'],
        date: '2025-01-03',
        totalDuration: 2400
      }
    ];
    setStudySessions(sampleSessions);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        createRecordingFromBlob(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const createRecordingFromBlob = (audioUrl: string) => {
    // Enhanced mock transcription and analysis
    const mockTranscripts = [
      "This recording demonstrates the advanced voice-to-text capabilities of EduCare. In a real implementation, this would contain the actual transcription of your lecture or study session using state-of-the-art speech recognition technology. The system would process your audio in real-time, handling multiple languages and technical terminology with high accuracy.",
      "Today's study session covered important concepts that will be automatically transcribed and analyzed. The AI system would identify key topics, create structured summaries, and extract important points for easy review. This helps students focus on learning rather than note-taking.",
      "This demonstration shows how EduCare can transform spoken content into organized, searchable text. The system would recognize different speakers, handle background noise, and maintain context throughout long recordings."
    ];

    const mockSummaries = [
      "Demonstration of EduCare's voice-to-text functionality showcasing real-time transcription, AI-powered analysis, and automatic summarization capabilities for enhanced learning.",
      "Study session recording highlighting the system's ability to process educational content, extract key concepts, and create structured learning materials.",
      "Example of advanced speech recognition technology applied to educational content with multi-language support and technical terminology handling."
    ];

    const mockKeyPoints = [
      ['Voice-to-text technology demonstration', 'Real-time transcription capabilities', 'AI-powered content analysis', 'Multi-language support'],
      ['Educational content processing', 'Key concept extraction', 'Structured learning materials', 'Study session optimization'],
      ['Advanced speech recognition', 'Technical terminology handling', 'Context maintenance', 'Speaker identification']
    ];

    const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
    
    const newRecording: Recording = {
      id: Date.now().toString(),
      title: recordingTitle || `Recording ${recordings.length + 1}`,
      transcript: mockTranscripts[randomIndex],
      summary: mockSummaries[randomIndex],
      keyPoints: mockKeyPoints[randomIndex],
      duration: recordingTime,
      date: new Date().toISOString().split('T')[0],
      subject: recordingSubject || 'Other',
      language: selectedLanguage,
      audioUrl: audioUrl,
      tags: [],
      starred: false
    };

    setRecordings(prev => [newRecording, ...prev]);
    setCurrentRecording(newRecording);
    
    // Reset form
    setRecordingTitle('');
    setRecordingSubject('');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (currentRecording?.id === id) {
      setCurrentRecording(null);
    }
  };

  const toggleStar = (id: string) => {
    setRecordings(prev => prev.map(r => 
      r.id === id ? { ...r, starred: !r.starred } : r
    ));
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || recording.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalRecordings = recordings.length;
  const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0);
  const averageDuration = totalRecordings > 0 ? totalDuration / totalRecordings : 0;
  const starredCount = recordings.filter(r => r.starred).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">EduCare Module</h1>
                <p className="text-sm text-gray-600">Smart Voice Notes & AI Learning Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 p-1 rounded-lg mb-8 w-fit">
          {[
            { key: 'record', label: 'Record', icon: Mic },
            { key: 'library', label: `Library (${totalRecordings})`, icon: FileText },
            { key: 'sessions', label: 'Study Sessions', icon: BookOpen },
            { key: 'analytics', label: 'Analytics', icon: Brain }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'record' && (
              /* Enhanced Recording Interface */
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Smart Voice Recording</h2>
                  <p className="text-gray-600 mb-8">Record lectures, study sessions, or personal notes. I'll transcribe, summarize, and extract key insights automatically.</p>
                  
                  {!isRecording && (
                    <div className="space-y-4 mb-8">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Recording title (optional)"
                          value={recordingTitle}
                          onChange={(e) => setRecordingTitle(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={recordingSubject}
                          onChange={(e) => setRecordingSubject(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select subject (optional)</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                      
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.native}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-100 border-4 border-red-300 animate-pulse' 
                        : 'bg-blue-100 border-4 border-blue-200 hover:border-blue-300'
                    }`}>
                      {isRecording ? (
                        <MicOff className="w-12 h-12 text-red-600" />
                      ) : (
                        <Mic className="w-12 h-12 text-blue-600" />
                      )}
                    </div>
                    
                    {isRecording && (
                      <div className="mt-4">
                        <div className="text-3xl font-mono font-bold text-red-600">
                          {formatTime(recordingTime)}
                        </div>
                        <p className="text-sm text-gray-500">Recording in progress...</p>
                        <div className="flex justify-center mt-2">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-red-500 rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 20 + 10}px`,
                                  animationDelay: `${i * 0.1}s`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Mic className="w-5 h-5" />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <MicOff className="w-5 h-5" />
                        <span>Stop Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              /* Enhanced Library Interface */
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recording Library</h2>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search recordings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredRecordings.map((recording) => (
                      <div
                        key={recording.id}
                        onClick={() => setCurrentRecording(recording)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          currentRecording?.id === recording.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-800">{recording.title}</h3>
                              {recording.starred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(recording.duration)}</span>
                              </span>
                              <span>{formatDate(recording.date)}</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {recording.subject}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {languages.find(l => l.code === recording.language)?.native}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {recording.summary}
                            </p>
                            
                            {recording.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {recording.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(recording.id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                recording.starred 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${recording.starred ? 'fill-current' : ''}`} />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Download functionality would go here
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRecording(recording.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredRecordings.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">
                          {searchTerm || selectedSubject !== 'all' 
                            ? 'No recordings match your search criteria' 
                            : 'No recordings yet. Start by creating your first recording!'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Study Sessions</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Session</span>
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Study sessions help you organize related recordings</p>
                  <p className="text-sm text-gray-400 mt-2">Create your first study session to get started</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Analytics</h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalRecordings}</div>
                      <div className="text-sm text-gray-600">Total Recordings</div>
                    </div>
                    
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">{formatTime(totalDuration)}</div>
                      <div className="text-sm text-gray-600">Total Duration</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatTime(Math.round(averageDuration))}</div>
                      <div className="text-sm text-gray-600">Avg Duration</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{starredCount}</div>
                      <div className="text-sm text-gray-600">Starred</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Subject Distribution</h3>
                      <div className="space-y-2">
                        {subjects.map(subject => {
                          const count = recordings.filter(r => r.subject === subject).length;
                          const percentage = totalRecordings > 0 ? (count / totalRecordings) * 100 : 0;
                          
                          if (count === 0) return null;
                          
                          return (
                            <div key={subject} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{subject}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-500 w-8">{count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Details Panel */}
          <div className="lg:col-span-1">
            {currentRecording ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{currentRecording.title}</h3>
                  <button
                    onClick={() => toggleStar(currentRecording.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      currentRecording.starred 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${currentRecording.starred ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {currentRecording.audioUrl && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Audio Playback
                      </h4>
                      <audio controls className="w-full">
                        <source src={currentRecording.audioUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Summary
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{currentRecording.summary}</p>
                    </div>
                  </div>

                  {currentRecording.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Key Points</h4>
                      <div className="space-y-2">
                        {currentRecording.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Full Transcript</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                      <p className="text-sm text-gray-700 leading-relaxed">{currentRecording.transcript}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <br />
                        {formatTime(currentRecording.duration)}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <br />
                        {formatDate(currentRecording.date)}
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span>
                        <br />
                        {currentRecording.subject}
                      </div>
                      <div>
                        <span className="font-medium">Language:</span>
                        <br />
                        {languages.find(l => l.code === currentRecording.language)?.native}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a recording to view details</p>
                  <p className="text-sm mt-2">AI-powered transcription and analysis will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EduCareModule;