// AI Engine for Ykarb - Advanced Features Implementation
export interface UserProfile {
  id: string;
  name?: string;
  preferredLanguage: string;
  tone: 'friendly' | 'calm' | 'professional';
  cycleData: CycleData;
  moodHistory: MoodEntry[];
  studyPreferences: StudyPreferences;
  personalityTraits: PersonalityTraits;
  location?: { lat: number; lng: number };
  culturalContext: string;
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  energyPatterns: EnergyPattern[];
  moodPatterns: MoodPattern[];
  symptomPatterns: SymptomPattern[];
}

export interface EnergyPattern {
  cycleDay: number;
  energyLevel: number; // 1-10
  productivityScore: number; // 1-10
  focusLevel: number; // 1-10
}

export interface MoodPattern {
  cycleDay: number;
  mood: string;
  intensity: number;
  emotionalVulnerability: number;
}

export interface SymptomPattern {
  cycleDay: number;
  symptoms: string[];
  painLevel: number;
  needsRest: boolean;
}

export interface StudyPreferences {
  subjects: string[];
  studyStyle: 'visual' | 'auditory' | 'kinesthetic';
  focusTime: number; // minutes
  breakPreference: number; // minutes
  difficultSubjects: string[];
  preferredStudyTimes: string[];
}

export interface PersonalityTraits {
  communicationStyle: 'brief' | 'detailed' | 'conversational';
  supportType: 'practical' | 'emotional' | 'motivational';
  culturalValues: string[];
}

export class YkarbAIEngine {
  private userProfile: UserProfile;
  private silentMode: boolean = false;
  private silentModeEndTime?: Date;

  constructor(userProfile: UserProfile) {
    this.userProfile = userProfile;
  }

  // 1. Cycle Twin AI - Personalized Rhythm Coach
  generateCycleTwinInsights(currentCycleDay: number): CycleTwinInsight {
    const energyPattern = this.userProfile.cycleData.energyPatterns.find(
      p => Math.abs(p.cycleDay - currentCycleDay) <= 1
    );
    
    const moodPattern = this.userProfile.cycleData.moodPatterns.find(
      p => Math.abs(p.cycleDay - currentCycleDay) <= 1
    );

    const recommendations: string[] = [];
    
    if (energyPattern) {
      if (energyPattern.energyLevel >= 8) {
        recommendations.push("You're usually energetic around this time. Schedule big tasks or workouts!");
      } else if (energyPattern.energyLevel <= 4) {
        recommendations.push("This tends to be a lower energy day for you. Take it slower and be gentle with yourself.");
      }
      
      if (energyPattern.focusLevel >= 8) {
        recommendations.push("Your focus is typically sharp now - perfect for studying or important work!");
      }
    }

    if (moodPattern && moodPattern.emotionalVulnerability >= 7) {
      recommendations.push("You might feel more emotionally sensitive today. Extra self-care is recommended.");
    }

    return {
      currentPhase: this.getCurrentPhase(currentCycleDay),
      energyForecast: energyPattern?.energyLevel || 5,
      moodForecast: moodPattern?.mood || 'neutral',
      recommendations,
      bestActivities: this.getBestActivitiesForDay(currentCycleDay),
      restRecommendation: this.shouldRest(currentCycleDay)
    };
  }

  // 2. Community MicroSupport - Anonymous Group AI Moderation
  moderateMessage(message: string, context: 'period' | 'mental-health' | 'study' | 'motivation'): ModerationResult {
    const toxicKeywords = ['stupid', 'ugly', 'worthless', 'kill yourself', 'hate'];
    const supportiveKeywords = ['understand', 'here for you', 'not alone', 'strong', 'brave'];
    
    const isToxic = toxicKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    const isSupportive = supportiveKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isToxic) {
      return {
        approved: false,
        reason: 'Contains harmful language',
        suggestedReply: "Let's keep our space supportive and kind. How can we help you feel better? 💛"
      };
    }

    if (this.detectsCrisis(message)) {
      return {
        approved: true,
        flagForSupport: true,
        suggestedReply: "I hear you're going through a tough time. You're not alone. Would you like some immediate support resources? 🤗"
      };
    }

    return {
      approved: true,
      suggestedReply: isSupportive ? "Thank you for being so supportive! 💕" : this.generateContextualReply(message, context)
    };
  }

  // 3. Real-Time Local Resource AI
  async findLocalResources(userLocation: { lat: number; lng: number }, needType: 'clinic' | 'ngo' | 'pads' | 'counseling'): Promise<LocalResource[]> {
    // Mock implementation - in real app, integrate with MapMyIndia, Aarogya Setu APIs
    const mockResources: LocalResource[] = [
      {
        name: "Women's Health Center",
        distance: "1.2 km",
        description: "Free pads available on weekends. Counseling in Telugu every Thursday.",
        contact: "+91-9876543210",
        address: "Near Bus Stand, Main Road",
        services: ['health-checkup', 'counseling', 'free-pads'],
        timings: "9 AM - 6 PM",
        language: this.userProfile.preferredLanguage
      },
      {
        name: "Mahila Mandal NGO",
        distance: "2.5 km",
        description: "Support groups for women. Mental health sessions in Hindi.",
        contact: "+91-9876543211",
        address: "Community Center, Sector 5",
        services: ['support-groups', 'mental-health', 'education'],
        timings: "10 AM - 5 PM",
        language: 'hindi'
      }
    ];

    return mockResources.filter(resource => 
      resource.services.includes(needType) || 
      (needType === 'counseling' && resource.services.includes('mental-health'))
    );
  }

  // 4. Menstrual Nutrition Coach AI
  getNutritionAdvice(currentCycleDay: number, symptoms: string[], recentMeals?: string[]): NutritionAdvice {
    const phase = this.getCurrentPhase(currentCycleDay);
    const advice: NutritionAdvice = {
      phase,
      recommendations: [],
      foods: [],
      supplements: [],
      hydration: '',
      culturalTips: []
    };

    switch (phase) {
      case 'menstrual':
        advice.recommendations.push("Focus on iron-rich foods to replenish what you're losing");
        advice.foods.push("Jaggery", "Dates", "Spinach", "Pomegranate");
        advice.hydration = "Drink warm water and herbal teas";
        advice.culturalTips.push("Try ajwain water for cramps", "Turmeric milk before bed");
        break;
        
      case 'follicular':
        advice.recommendations.push("Light, energizing foods to support rising energy");
        advice.foods.push("Fresh fruits", "Whole grains", "Lean proteins");
        advice.hydration = "Stay well hydrated with coconut water";
        break;
        
      case 'ovulation':
        advice.recommendations.push("Anti-inflammatory foods to support peak fertility");
        advice.foods.push("Walnuts", "Flax seeds", "Green leafy vegetables");
        advice.hydration = "Increase water intake";
        break;
        
      case 'luteal':
        advice.recommendations.push("Magnesium-rich foods to reduce PMS symptoms");
        advice.foods.push("Bananas", "Dark chocolate", "Almonds");
        advice.hydration = "Reduce caffeine, increase herbal teas";
        advice.culturalTips.push("Fennel tea for bloating", "Warm sesame oil massage");
        break;
    }

    // Symptom-specific advice
    if (symptoms.includes('cramps')) {
      advice.foods.push("Ginger tea", "Cinnamon");
      advice.culturalTips.push("Heat therapy with warm cloth");
    }
    
    if (symptoms.includes('bloating')) {
      advice.foods.push("Cucumber", "Watermelon");
      advice.culturalTips.push("Jeera water on empty stomach");
    }

    return advice;
  }

  // 5. AI Storyteller for Emotional Comfort
  generateComfortStory(mood: string, language: string = 'english', theme?: string): ComfortStory {
    const storyPrompts = {
      sad: {
        english: "Once upon a time, in a peaceful village surrounded by gentle hills, there lived a young woman who discovered that even the darkest nights eventually give way to the most beautiful sunrises...",
        hindi: "एक बार की बात है, शांत पहाड़ियों से घिरे एक गांव में, एक युवा लड़की रहती थी जिसने पाया कि सबसे अंधेरी रातें भी सबसे सुंदर सूर्योदय का रास्ता बनाती हैं..."
      },
      anxious: {
        english: "In a quiet forest, a little bird felt overwhelmed by the vastness of the sky. But an wise old tree whispered, 'Dear one, you don't have to fly across the whole sky at once. Just spread your wings for this moment...'",
        hindi: "एक शांत जंगल में, एक छोटी चिड़िया आसमान की विशालता से घबरा गई। लेकिन एक बुद्धिमान पुराने पेड़ ने फुसफुसाया, 'प्रिय, तुम्हें पूरे आसमान में एक साथ उड़ने की जरूरत नहीं है। बस इस पल के लिए अपने पंख फैलाओ...'"
      },
      tired: {
        english: "There was once a moon who worked so hard lighting up the night that she forgot to rest. The stars gently reminded her, 'Even the moon needs to wane to become full again...'",
        hindi: "एक बार एक चांद था जो रात को रोशन करने में इतना मेहनत करता था कि वह आराम करना भूल गया। तारों ने धीरे से उसे याद दिलाया, 'चांद को भी पूर्ण होने के लिए घटना पड़ता है...'"
      }
    };

    const selectedStory = storyPrompts[mood as keyof typeof storyPrompts]?.[language as keyof typeof storyPrompts.sad] || 
                        storyPrompts.sad.english;

    return {
      title: `A gentle story for your ${mood} heart`,
      content: selectedStory,
      duration: "5 minutes",
      breathingCues: [
        "Take a deep breath as you begin...",
        "Breathe gently with the rhythm of the story...",
        "Let each word bring you peace..."
      ],
      backgroundMusic: "soft-rain",
      language
    };
  }

  // 6. Enhanced AI-Coached Study Planner
  generateStudyPlan(subjects: string[], examDates: { [subject: string]: string }, currentCycleDay: number): StudyPlan {
    const cycleTwinInsight = this.generateCycleTwinInsights(currentCycleDay);
    
    const plan: StudyPlan = {
      weekPlan: [],
      dailyTips: [],
      cycleAwareness: cycleTwinInsight.recommendations
    };

    // Enhanced study planning with realistic cycle patterns
    const cyclePhases = this.getCyclePhasePattern();
    
    // Generate 7-day plan with varied energy and focus
    for (let day = 0; day < 7; day++) {
      const dayNumber = currentCycleDay + day;
      const phaseInfo = this.getPhaseInfo(dayNumber);
      const dayEnergy = this.predictEnergyForDay(dayNumber);
      const focusLevel = this.predictFocusForDay(dayNumber);
      
      const dayPlan: DayPlan = {
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        energy: dayEnergy,
        focus: focusLevel,
        phase: phaseInfo.phase,
        subjects: [],
        tips: [],
        studyDuration: this.calculateOptimalStudyDuration(dayEnergy, focusLevel),
        breakFrequency: this.calculateBreakFrequency(dayEnergy),
        bestStudyTimes: this.getBestStudyTimes(phaseInfo.phase, dayEnergy),
        avoidActivities: this.getActivitiesToAvoid(phaseInfo.phase, dayEnergy)
      };

      // Subject allocation based on energy and focus
      if (dayEnergy >= 8 && focusLevel >= 8) {
        // High energy, high focus - tackle most difficult subjects
        dayPlan.subjects = this.getDifficultSubjects(subjects).slice(0, 2);
        dayPlan.tips.push("Peak performance day! Perfect for challenging topics and new concepts.");
        dayPlan.tips.push("Try the Pomodoro technique: 50 minutes study, 10 minutes break.");
      } else if (dayEnergy >= 6 && focusLevel >= 6) {
        // Medium energy, good focus - balanced approach
        dayPlan.subjects = this.getMixedSubjects(subjects).slice(0, 2);
        dayPlan.tips.push("Good steady energy - perfect for consistent progress.");
        dayPlan.tips.push("Mix difficult and easier topics for balanced learning.");
      } else if (dayEnergy <= 4 || focusLevel <= 4) {
        // Low energy or focus - light review and easy subjects
        dayPlan.subjects = this.getEasySubjects(subjects).slice(0, 1);
        dayPlan.tips.push("Take it easy today. Light revision and self-care are priorities.");
        dayPlan.tips.push("Short 20-minute study sessions with longer breaks.");
      } else {
        // Moderate energy - standard approach
        dayPlan.subjects = subjects.slice(0, 2);
        dayPlan.tips.push("Balanced energy - good for steady, consistent progress.");
        dayPlan.tips.push("Standard 45-minute study blocks work well today.");
      }

      // Phase-specific tips
      switch (phaseInfo.phase) {
        case 'menstrual':
          dayPlan.tips.push("Period phase - be extra gentle with yourself. Shorter sessions, more breaks.");
          dayPlan.tips.push("Warm drinks and comfortable seating will help with focus.");
          break;
        case 'follicular':
          dayPlan.tips.push("Rising energy phase - great time to start new topics or projects.");
          dayPlan.tips.push("Your brain is primed for learning new information.");
          break;
        case 'ovulation':
          dayPlan.tips.push("Peak focus time - excellent for memorization and complex problem-solving!");
          dayPlan.tips.push("This is your cognitive superpower window - use it wisely.");
          break;
        case 'luteal':
          dayPlan.tips.push("Detail-oriented phase - perfect for review, editing, and organizing notes.");
          dayPlan.tips.push("You might feel more critical - use this for thorough revision.");
          break;
      }

      // Add exam-specific urgency
      const urgentSubjects = this.getUrgentSubjects(subjects, examDates);
      if (urgentSubjects.length > 0 && dayEnergy >= 6) {
        dayPlan.subjects = urgentSubjects.slice(0, 1).concat(dayPlan.subjects.slice(0, 1));
        dayPlan.tips.push(`Priority: ${urgentSubjects[0]} exam is approaching!`);
      }

      plan.weekPlan.push(dayPlan);
    }

    // Add overall cycle awareness tips
    plan.cycleAwareness = [
      "Your menstrual cycle affects cognitive performance - this plan adapts to your natural rhythms",
      "Days 1-5: Focus on review and light learning during your period",
      "Days 6-13: Rising energy - perfect for tackling new, challenging material",
      "Days 14-16: Peak focus window - maximize difficult subjects and memorization",
      "Days 17-28: Detail-oriented phase - excellent for revision and organizing knowledge"
    ];

    return plan;
  }

  // 7. Sentiment-Aware Notifications
  shouldSendNotification(notificationType: string): NotificationDecision {
    const recentMood = this.getRecentMood();
    const currentTime = new Date();
    
    if (this.silentMode && this.silentModeEndTime && currentTime < this.silentModeEndTime) {
      return {
        send: false,
        reason: 'User in silent mode',
        alternativeMessage: null
      };
    }

    if (recentMood && recentMood.intensity >= 8 && ['sad', 'anxious', 'overwhelmed'].includes(recentMood.mood)) {
      // User is in distress - send empathetic message instead
      return {
        send: true,
        reason: 'Empathetic approach needed',
        alternativeMessage: "Hey, how are you feeling? I'm here if you need a moment to breathe 💛"
      };
    }

    if (recentMood && recentMood.intensity <= 3) {
      // User seems low - gentle approach
      return {
        send: true,
        reason: 'Gentle approach',
        alternativeMessage: this.getGentleReminder(notificationType)
      };
    }

    return {
      send: true,
      reason: 'Normal mood detected',
      alternativeMessage: null
    };
  }

  // 8. Silent Mode for Overwhelmed Users
  activateSilentMode(duration: number = 24): void {
    this.silentMode = true;
    this.silentModeEndTime = new Date(Date.now() + duration * 60 * 60 * 1000);
  }

  checkSilentModeStatus(): SilentModeStatus {
    const currentTime = new Date();
    
    if (this.silentMode && this.silentModeEndTime && currentTime >= this.silentModeEndTime) {
      this.silentMode = false;
      return {
        active: false,
        message: "I'm still here when you're ready. You matter 💛",
        checkInTime: currentTime
      };
    }

    return {
      active: this.silentMode,
      message: null,
      checkInTime: this.silentModeEndTime || null
    };
  }

  // 9. Festival-Aware Care Mode
  getFestivalAwareAdvice(currentDate: Date, currentCycleDay: number): FestivalAdvice | null {
    const festivals = this.getIndianFestivals(currentDate);
    const currentPhase = this.getCurrentPhase(currentCycleDay);
    
    if (festivals.length === 0) return null;

    const festival = festivals[0];
    const advice: FestivalAdvice = {
      festival: festival.name,
      phase: currentPhase,
      recommendations: [],
      culturalTips: [],
      warnings: []
    };

    if (festival.involvesFasting) {
      if (currentPhase === 'menstrual') {
        advice.warnings.push("You're on your period - consider breaking fast gently if you feel weak");
        advice.recommendations.push("Eat warm, nourishing foods when breaking fast");
        advice.culturalTips.push("Dates and milk are traditional and gentle for breaking fasts");
      } else if (currentPhase === 'luteal') {
        advice.recommendations.push("PMS phase - stay hydrated during fasting");
        advice.culturalTips.push("Coconut water is excellent for maintaining electrolytes");
      }
    }

    if (festival.name === 'Navratri' && currentPhase === 'menstrual') {
      advice.culturalTips.push("Some traditions allow rest during periods - listen to your body");
      advice.recommendations.push("If participating, take frequent breaks and stay hydrated");
    }

    return advice;
  }

  // 10. AI Personalization Engine
  updatePersonalization(interactions: UserInteraction[]): PersonalizationUpdate {
    const update: PersonalizationUpdate = {
      toneAdjustment: null,
      languagePreference: null,
      communicationStyle: null,
      topicPreferences: [],
      responseLength: null
    };

    // Analyze interaction patterns
    const avgResponseTime = interactions.reduce((sum, i) => sum + i.responseTime, 0) / interactions.length;
    const preferredTopics = this.extractPreferredTopics(interactions);
    const communicationPatterns = this.analyzeCommunicationPatterns(interactions);

    // Quick responses suggest preference for brief communication
    if (avgResponseTime < 5000) { // 5 seconds
      update.communicationStyle = 'brief';
      update.responseLength = 'short';
    } else if (avgResponseTime > 30000) { // 30 seconds
      update.communicationStyle = 'detailed';
      update.responseLength = 'long';
    }

    // Language switching patterns
    const languageUsage = this.analyzeLanguageUsage(interactions);
    if (languageUsage.primary !== this.userProfile.preferredLanguage) {
      update.languagePreference = languageUsage.primary;
    }

    // Emotional tone preferences
    const emotionalResponses = interactions.filter(i => i.emotionalResponse);
    if (emotionalResponses.length > 0) {
      const positiveResponses = emotionalResponses.filter(i => i.emotionalResponse === 'positive');
      if (positiveResponses.length / emotionalResponses.length > 0.7) {
        update.toneAdjustment = 'more_encouraging';
      }
    }

    update.topicPreferences = preferredTopics;

    return update;
  }

  // Enhanced helper methods for study planning
  private getCyclePhasePattern(): CyclePhasePattern[] {
    return [
      { phase: 'menstrual', days: [1, 2, 3, 4, 5], energyRange: [2, 4], focusRange: [3, 5] },
      { phase: 'follicular', days: [6, 7, 8, 9, 10, 11, 12, 13], energyRange: [5, 8], focusRange: [6, 8] },
      { phase: 'ovulation', days: [14, 15, 16], energyRange: [8, 10], focusRange: [8, 10] },
      { phase: 'luteal', days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], energyRange: [4, 7], focusRange: [5, 8] }
    ];
  }

  private getPhaseInfo(cycleDay: number): { phase: string; energyRange: number[]; focusRange: number[] } {
    const patterns = this.getCyclePhasePattern();
    const normalizedDay = ((cycleDay - 1) % 28) + 1;
    
    for (const pattern of patterns) {
      if (pattern.days.includes(normalizedDay)) {
        return {
          phase: pattern.phase,
          energyRange: pattern.energyRange,
          focusRange: pattern.focusRange
        };
      }
    }
    
    return { phase: 'follicular', energyRange: [5, 7], focusRange: [6, 7] };
  }

  private predictEnergyForDay(cycleDay: number): number {
    const phaseInfo = this.getPhaseInfo(cycleDay);
    const [min, max] = phaseInfo.energyRange;
    
    // Add some natural variation
    const baseEnergy = min + Math.random() * (max - min);
    const variation = (Math.random() - 0.5) * 2; // ±1 variation
    
    return Math.max(1, Math.min(10, Math.round(baseEnergy + variation)));
  }

  private predictFocusForDay(cycleDay: number): number {
    const phaseInfo = this.getPhaseInfo(cycleDay);
    const [min, max] = phaseInfo.focusRange;
    
    // Add some natural variation
    const baseFocus = min + Math.random() * (max - min);
    const variation = (Math.random() - 0.5) * 2; // ±1 variation
    
    return Math.max(1, Math.min(10, Math.round(baseFocus + variation)));
  }

  private getDifficultSubjects(subjects: string[]): string[] {
    const difficultKeywords = ['mathematics', 'math', 'physics', 'chemistry', 'calculus', 'algebra', 'organic chemistry'];
    return subjects.filter(subject => 
      difficultKeywords.some(keyword => subject.toLowerCase().includes(keyword))
    );
  }

  private getEasySubjects(subjects: string[]): string[] {
    const easyKeywords = ['literature', 'history', 'art', 'music', 'social', 'language'];
    return subjects.filter(subject => 
      easyKeywords.some(keyword => subject.toLowerCase().includes(keyword))
    );
  }

  private getMixedSubjects(subjects: string[]): string[] {
    const difficult = this.getDifficultSubjects(subjects);
    const easy = this.getEasySubjects(subjects);
    const mixed = [];
    
    if (difficult.length > 0) mixed.push(difficult[0]);
    if (easy.length > 0) mixed.push(easy[0]);
    
    return mixed.length > 0 ? mixed : subjects.slice(0, 2);
  }

  private calculateOptimalStudyDuration(energy: number, focus: number): string {
    const avgScore = (energy + focus) / 2;
    
    if (avgScore >= 8) return "50-60 minutes";
    if (avgScore >= 6) return "40-45 minutes";
    if (avgScore >= 4) return "25-30 minutes";
    return "15-20 minutes";
  }

  private calculateBreakFrequency(energy: number): string {
    if (energy >= 8) return "Every 50 minutes";
    if (energy >= 6) return "Every 40 minutes";
    if (energy >= 4) return "Every 25 minutes";
    return "Every 15 minutes";
  }

  private getBestStudyTimes(phase: string, energy: number): string[] {
    const times = [];
    
    if (phase === 'ovulation' || energy >= 8) {
      times.push("Morning (9-11 AM)", "Late morning (11 AM-1 PM)");
    } else if (phase === 'menstrual' || energy <= 4) {
      times.push("Mid-morning (10-11 AM)", "Early evening (4-5 PM)");
    } else {
      times.push("Morning (9-11 AM)", "Afternoon (2-4 PM)");
    }
    
    return times;
  }

  private getActivitiesToAvoid(phase: string, energy: number): string[] {
    const avoid = [];
    
    if (phase === 'menstrual' || energy <= 4) {
      avoid.push("Late night studying", "Intensive memorization", "Complex problem-solving");
    } else if (energy >= 8) {
      avoid.push("Passive reading only", "Too many breaks");
    }
    
    return avoid;
  }

  private getUrgentSubjects(subjects: string[], examDates: { [subject: string]: string }): string[] {
    const urgent = [];
    const today = new Date();
    
    for (const subject of subjects) {
      if (examDates[subject]) {
        const examDate = new Date(examDates[subject]);
        const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExam <= 7) {
          urgent.push(subject);
        }
      }
    }
    
    return urgent;
  }

  // Helper methods (existing ones remain the same)
  private getCurrentPhase(cycleDay: number): string {
    const { cycleLength, periodLength } = this.userProfile.cycleData;
    
    if (cycleDay <= periodLength) return 'menstrual';
    if (cycleDay <= cycleLength / 2 - 2) return 'follicular';
    if (cycleDay <= cycleLength / 2 + 2) return 'ovulation';
    return 'luteal';
  }

  private shouldRest(cycleDay: number): boolean {
    const symptomPattern = this.userProfile.cycleData.symptomPatterns.find(
      p => Math.abs(p.cycleDay - cycleDay) <= 1
    );
    return symptomPattern?.needsRest || false;
  }

  private getBestActivitiesForDay(cycleDay: number): string[] {
    const energy = this.predictEnergyForDay(cycleDay);
    const phase = this.getCurrentPhase(cycleDay);
    
    if (energy >= 8) {
      return ['High-intensity workout', 'Important meetings', 'Creative projects'];
    } else if (energy <= 4) {
      return ['Gentle yoga', 'Reading', 'Meditation', 'Light walks'];
    } else {
      return ['Moderate exercise', 'Study sessions', 'Social activities'];
    }
  }

  private detectsCrisis(message: string): boolean {
    const crisisKeywords = [
      'want to die', 'kill myself', 'suicide', 'end it all', 'hurt myself',
      'no point living', 'better off dead', 'can\'t go on'
    ];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private generateContextualReply(message: string, context: string): string {
    const replies = {
      'period': [
        "You're not alone in this. Many of us understand exactly what you're going through 💛",
        "Period struggles are real. Take care of yourself and be gentle 🌸",
        "Your feelings are completely valid. How can we support you today?"
      ],
      'mental-health': [
        "Thank you for sharing. Your courage to speak up matters 💚",
        "You're taking an important step by reaching out. We're here for you 🤗",
        "Your mental health matters. You deserve support and care ✨"
      ],
      'study': [
        "Study stress is so real! You're doing better than you think 📚",
        "Every small step counts. You've got this! 💪",
        "Learning is a journey. Be patient with yourself 🌱"
      ],
      'motivation': [
        "Your determination is inspiring! Keep going 🌟",
        "You're stronger than you know. One step at a time 💫",
        "Believe in yourself - you have everything you need inside you ✨"
      ]
    };

    const contextReplies = replies[context as keyof typeof replies] || replies['motivation'];
    return contextReplies[Math.floor(Math.random() * contextReplies.length)];
  }

  private getRecentMood(): MoodEntry | null {
    if (this.userProfile.moodHistory.length === 0) return null;
    return this.userProfile.moodHistory[this.userProfile.moodHistory.length - 1];
  }

  private getGentleReminder(notificationType: string): string {
    const gentleReminders = {
      'period-tracking': "Just a gentle reminder to check in with your body today 🌸",
      'mood-check': "How are you feeling today? I'm here to listen 💛",
      'study-reminder': "No pressure, but maybe a little study time when you feel ready? 📚",
      'self-care': "Remember to be kind to yourself today 💚"
    };

    return gentleReminders[notificationType as keyof typeof gentleReminders] || 
           "Just checking in - you matter 💛";
  }

  private getIndianFestivals(date: Date): Festival[] {
    // Mock implementation - in real app, integrate with Indian calendar API
    const festivals: Festival[] = [
      {
        name: 'Navratri',
        date: '2025-03-22',
        involvesFasting: true,
        culturalSignificance: 'Nine nights of devotion to Goddess Durga'
      },
      {
        name: 'Karva Chauth',
        date: '2025-11-01',
        involvesFasting: true,
        culturalSignificance: 'Fasting for husband\'s long life'
      }
    ];

    const dateStr = date.toISOString().split('T')[0];
    return festivals.filter(f => f.date === dateStr);
  }

  private extractPreferredTopics(interactions: UserInteraction[]): string[] {
    // Analyze user messages to find most discussed topics
    const topicCounts: { [topic: string]: number } = {};
    
    interactions.forEach(interaction => {
      const message = interaction.userMessage.toLowerCase();
      if (message.includes('period') || message.includes('cycle')) topicCounts['menstrual-health'] = (topicCounts['menstrual-health'] || 0) + 1;
      if (message.includes('study') || message.includes('exam')) topicCounts['education'] = (topicCounts['education'] || 0) + 1;
      if (message.includes('sad') || message.includes('anxious')) topicCounts['mental-health'] = (topicCounts['mental-health'] || 0) + 1;
      if (message.includes('food') || message.includes('eat')) topicCounts['nutrition'] = (topicCounts['nutrition'] || 0) + 1;
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  private analyzeCommunicationPatterns(interactions: UserInteraction[]): CommunicationPattern {
    const avgMessageLength = interactions.reduce((sum, i) => sum + i.userMessage.length, 0) / interactions.length;
    const questionCount = interactions.filter(i => i.userMessage.includes('?')).length;
    const emotionalWords = interactions.filter(i => 
      /feel|emotion|sad|happy|anxious|excited/i.test(i.userMessage)
    ).length;

    return {
      averageMessageLength: avgMessageLength,
      questionFrequency: questionCount / interactions.length,
      emotionalExpression: emotionalWords / interactions.length,
      preferredStyle: avgMessageLength > 100 ? 'detailed' : 'brief'
    };
  }

  private analyzeLanguageUsage(interactions: UserInteraction[]): LanguageUsage {
    const languageCounts: { [lang: string]: number } = {};
    
    interactions.forEach(interaction => {
      // Simple language detection based on script/keywords
      const message = interaction.userMessage;
      if (/[\u0900-\u097F]/.test(message)) languageCounts['hindi'] = (languageCounts['hindi'] || 0) + 1;
      else if (/[\u0B80-\u0BFF]/.test(message)) languageCounts['tamil'] = (languageCounts['tamil'] || 0) + 1;
      else if (/[\u0C00-\u0C7F]/.test(message)) languageCounts['telugu'] = (languageCounts['telugu'] || 0) + 1;
      else languageCounts['english'] = (languageCounts['english'] || 0) + 1;
    });

    const primary = Object.entries(languageCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'english';

    return {
      primary,
      distribution: languageCounts
    };
  }
}

// Type definitions
export interface CycleTwinInsight {
  currentPhase: string;
  energyForecast: number;
  moodForecast: string;
  recommendations: string[];
  bestActivities: string[];
  restRecommendation: boolean;
}

export interface ModerationResult {
  approved: boolean;
  reason?: string;
  flagForSupport?: boolean;
  suggestedReply: string;
}

export interface LocalResource {
  name: string;
  distance: string;
  description: string;
  contact: string;
  address: string;
  services: string[];
  timings: string;
  language: string;
}

export interface NutritionAdvice {
  phase: string;
  recommendations: string[];
  foods: string[];
  supplements: string[];
  hydration: string;
  culturalTips: string[];
}

export interface ComfortStory {
  title: string;
  content: string;
  duration: string;
  breathingCues: string[];
  backgroundMusic: string;
  language: string;
}

export interface StudyPlan {
  weekPlan: DayPlan[];
  dailyTips: string[];
  cycleAwareness: string[];
}

export interface DayPlan {
  date: string;
  energy: number;
  focus?: number;
  phase?: string;
  subjects: string[];
  tips: string[];
  studyDuration?: string;
  breakFrequency?: string;
  bestStudyTimes?: string[];
  avoidActivities?: string[];
}

export interface CyclePhasePattern {
  phase: string;
  days: number[];
  energyRange: number[];
  focusRange: number[];
}

export interface NotificationDecision {
  send: boolean;
  reason: string;
  alternativeMessage: string | null;
}

export interface SilentModeStatus {
  active: boolean;
  message: string | null;
  checkInTime: Date | null;
}

export interface FestivalAdvice {
  festival: string;
  phase: string;
  recommendations: string[];
  culturalTips: string[];
  warnings: string[];
}

export interface Festival {
  name: string;
  date: string;
  involvesFasting: boolean;
  culturalSignificance: string;
}

export interface PersonalizationUpdate {
  toneAdjustment: string | null;
  languagePreference: string | null;
  communicationStyle: string | null;
  topicPreferences: string[];
  responseLength: string | null;
}

export interface UserInteraction {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  responseTime: number;
  emotionalResponse?: 'positive' | 'negative' | 'neutral';
  topic: string;
}

export interface CommunicationPattern {
  averageMessageLength: number;
  questionFrequency: number;
  emotionalExpression: number;
  preferredStyle: 'detailed' | 'brief';
}

export interface LanguageUsage {
  primary: string;
  distribution: { [lang: string]: number };
}

export interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  date: string;
  note?: string;
  triggers?: string[];
  coping_strategies?: string[];
  culturalContext?: string;
}