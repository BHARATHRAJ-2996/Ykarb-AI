import logging
import asyncio
import httpx
import os
from datetime import datetime, timedelta
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters, CallbackQueryHandler

# ✅ Environment variables for security
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "YOUR_TELEGRAM_TOKEN_HERE")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

# ✅ Logging config
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# ✅ User data storage (in production, use a proper database)
user_data = {}

# ✅ Crisis support resources
CRISIS_RESOURCES = {
    'global': {
        'name': 'International Crisis Lines',
        'numbers': ['988 (US)', '116 123 (UK)', '13 11 14 (AU)'],
        'description': '24/7 crisis support and suicide prevention'
    },
    'india': {
        'name': 'India Crisis Support',
        'numbers': ['9152987821', '022-25521111'],
        'description': 'AASRA - 24/7 emotional support'
    }
}

# ✅ Multilingual support
LANGUAGES = {
    'english': {'name': 'English', 'code': 'en'},
    'hindi': {'name': 'हिंदी', 'code': 'hi'},
    'bengali': {'name': 'বাংলা', 'code': 'bn'},
    'tamil': {'name': 'தமிழ்', 'code': 'ta'},
    'telugu': {'name': 'తెలుగు', 'code': 'te'},
    'marathi': {'name': 'मराठी', 'code': 'mr'},
    'gujarati': {'name': 'ગુજરાતી', 'code': 'gu'},
    'kannada': {'name': 'ಕನ್ನಡ', 'code': 'kn'},
    'malayalam': {'name': 'മലയാളം', 'code': 'ml'},
    'punjabi': {'name': 'ਪੰਜਾਬੀ', 'code': 'pa'}
}

# ✅ Wellness activities and coping strategies
WELLNESS_ACTIVITIES = {
    'breathing': {
        'title': '🫁 Deep Breathing Exercise',
        'description': 'A simple 4-7-8 breathing technique to calm anxiety',
        'instructions': [
            '1. Sit comfortably and close your eyes',
            '2. Inhale through nose for 4 counts',
            '3. Hold your breath for 7 counts', 
            '4. Exhale through mouth for 8 counts',
            '5. Repeat 3-4 times'
        ]
    },
    'grounding': {
        'title': '🌱 5-4-3-2-1 Grounding Technique',
        'description': 'Ground yourself in the present moment',
        'instructions': [
            '5 things you can SEE around you',
            '4 things you can TOUCH',
            '3 things you can HEAR',
            '2 things you can SMELL',
            '1 thing you can TASTE'
        ]
    },
    'gratitude': {
        'title': '🙏 Gratitude Practice',
        'description': 'Shift focus to positive aspects of life',
        'instructions': [
            '1. Think of 3 things you\'re grateful for today',
            '2. Write them down or say them aloud',
            '3. Feel the emotion of gratitude',
            '4. Notice how this changes your mood'
        ]
    },
    'movement': {
        'title': '🚶 Gentle Movement',
        'description': 'Light physical activity to boost mood',
        'instructions': [
            '1. Stand up and stretch your arms',
            '2. Take 10 deep breaths while moving',
            '3. Walk around for 2-3 minutes',
            '4. Notice how your body feels'
        ]
    }
}

class YkarbBot:
    def __init__(self):
        self.gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        
    async def get_gemini_response(self, prompt: str, context: str = "", language: str = "english") -> str:
        """Get response from Gemini API with Ykarb personality and language support"""
        
        language_instruction = ""
        if language != "english":
            lang_name = LANGUAGES.get(language, {}).get('name', language)
            language_instruction = f"Please respond in {lang_name} language when appropriate, while being culturally sensitive."
        
        ykarb_prompt = f"""
        You are Ykarb, a kind, multilingual, AI-powered digital companion that supports women and students. 
        You are emotionally intelligent, culturally aware, private and supportive with no judgments.
        You provide help through three modules:
        1. Sakhi Module - Menstrual and hormonal health tracking
        2. EduCare Module - Voice-to-text notes and learning assistance  
        3. Mitra Module - Mental health support in regional languages
        
        {language_instruction}
        
        Context: {context}
        User message: {prompt}
        
        Respond as Ykarb with empathy, cultural sensitivity, and helpful guidance. If the user seems to be in crisis or mentions self-harm, provide immediate support and crisis resources.
        """
        
        payload = {
            "contents": [{
                "parts": [{"text": ykarb_prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(self.gemini_url, json=payload)
                response.raise_for_status()
                data = response.json()
                
                if 'candidates' in data and len(data['candidates']) > 0:
                    return data['candidates'][0]['content']['parts'][0]['text']
                else:
                    return "I'm having trouble processing your request right now. Please try again."
                    
            except httpx.TimeoutException:
                logger.error("Gemini API timeout")
                return "⏰ I'm taking a bit longer to respond. Please try again."
            except httpx.HTTPStatusError as e:
                logger.error(f"Gemini API HTTP error: {e}")
                return "🔧 I'm experiencing technical difficulties. Please try again later."
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                return "❌ Something went wrong. Please try again."

    def detect_crisis_keywords(self, text: str) -> bool:
        """Detect potential crisis situations in user messages"""
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself',
            'self harm', 'cutting', 'overdose', 'jump', 'hanging', 'worthless',
            'hopeless', 'can\'t go on', 'better off dead', 'no point living'
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in crisis_keywords)

bot = YkarbBot()

# ✅ Start command with module selection
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    user_data[user_id] = {
        'active_module': None,
        'language': 'english',
        'cycle_data': {},
        'mood_history': [],
        'wellness_streak': 0,
        'notes': [],
        'crisis_support_shown': False
    }
    
    keyboard = [
        [InlineKeyboardButton("🌸 Sakhi - Menstrual Health", callback_data='sakhi')],
        [InlineKeyboardButton("📚 EduCare - Learning Assistant", callback_data='educare')],
        [InlineKeyboardButton("💚 Mitra - Mental Health Support", callback_data='mitra')],
        [InlineKeyboardButton("🌍 Language Settings", callback_data='language_settings')],
        [InlineKeyboardButton("ℹ️ About Ykarb", callback_data='about')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_message = """
🌟 *Welcome to Ykarb!* 🌟

I'm your caring digital companion, here to support you through:

🌸 *Sakhi Module* - Menstrual & hormonal health tracking
📚 *EduCare Module* - Smart learning assistance  
💚 *Mitra Module* - Mental health support in your language

Choose a module to get started, or just chat with me about anything! 💕

*Remember: You're never alone, and your feelings are always valid.*
    """
    
    await update.message.reply_text(
        welcome_message, 
        parse_mode='Markdown',
        reply_markup=reply_markup
    )

# ✅ Enhanced module selection handler
async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    if user_id not in user_data:
        user_data[user_id] = {
            'active_module': None, 
            'language': 'english',
            'cycle_data': {}, 
            'mood_history': [], 
            'wellness_streak': 0,
            'notes': [],
            'crisis_support_shown': False
        }
    
    if query.data == 'mitra':
        user_data[user_id]['active_module'] = 'mitra'
        keyboard = [
            [InlineKeyboardButton("💭 Mood Check-in", callback_data='mood_checkin')],
            [InlineKeyboardButton("📊 Mood History", callback_data='mood_history')],
            [InlineKeyboardButton("🧘 Wellness Activities", callback_data='wellness_menu')],
            [InlineKeyboardButton("🎯 Daily Goals", callback_data='daily_goals')],
            [InlineKeyboardButton("🆘 Crisis Support", callback_data='crisis_support')],
            [InlineKeyboardButton("🌍 Language Support", callback_data='language_support')],
            [InlineKeyboardButton("🏠 Main Menu", callback_data='main_menu')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Get user's mood trend
        mood_trend = get_mood_trend(user_id)
        streak_text = f"Wellness streak: {user_data[user_id]['wellness_streak']} days" if user_data[user_id]['wellness_streak'] > 0 else ""
        
        await query.edit_message_text(
            f"💚 *Mitra Module - Your Mental Health Companion*\n\n"
            f"I'm here to listen, support, and provide culturally sensitive mental health guidance.\n\n"
            f"{mood_trend}\n{streak_text}\n\n"
            f"*Remember: Your mental health matters, and seeking support is a sign of strength.*\n\n"
            f"How can I support you today?",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'mood_checkin':
        keyboard = [
            [InlineKeyboardButton("😊 Happy", callback_data='mood_happy'), InlineKeyboardButton("😢 Sad", callback_data='mood_sad')],
            [InlineKeyboardButton("😰 Anxious", callback_data='mood_anxious'), InlineKeyboardButton("😡 Angry", callback_data='mood_angry')],
            [InlineKeyboardButton("😌 Peaceful", callback_data='mood_peaceful'), InlineKeyboardButton("😴 Tired", callback_data='mood_tired')],
            [InlineKeyboardButton("😵‍💫 Overwhelmed", callback_data='mood_overwhelmed'), InlineKeyboardButton("🤗 Grateful", callback_data='mood_grateful')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "💭 *How are you feeling right now?*\n\n"
            "Take a moment to check in with yourself. Your emotions are valid, and I'm here to listen and support you.\n\n"
            "Choose the emotion that best describes how you're feeling:",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data.startswith('mood_'):
        mood = query.data.replace('mood_', '').title()
        intensity_keyboard = [
            [InlineKeyboardButton("1️⃣ Very Low", callback_data=f'intensity_{mood.lower()}_1')],
            [InlineKeyboardButton("2️⃣ Low", callback_data=f'intensity_{mood.lower()}_2')],
            [InlineKeyboardButton("3️⃣ Moderate", callback_data=f'intensity_{mood.lower()}_3')],
            [InlineKeyboardButton("4️⃣ High", callback_data=f'intensity_{mood.lower()}_4')],
            [InlineKeyboardButton("5️⃣ Very High", callback_data=f'intensity_{mood.lower()}_5')],
            [InlineKeyboardButton("🔙 Back", callback_data='mood_checkin')]
        ]
        reply_markup = InlineKeyboardMarkup(intensity_keyboard)
        
        await query.edit_message_text(
            f"💭 *You're feeling {mood}*\n\n"
            f"On a scale of 1-5, how intense is this feeling right now?\n\n"
            f"1 = Very mild\n5 = Very intense",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data.startswith('intensity_'):
        parts = query.data.split('_')
        mood = parts[1].title()
        intensity = int(parts[2])
        
        # Save mood entry
        mood_entry = {
            'mood': mood,
            'intensity': intensity,
            'date': datetime.now().isoformat(),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        user_data[user_id]['mood_history'].append(mood_entry)
        
        # Generate personalized response based on mood and intensity
        response_text, suggested_activities = generate_mood_response(mood, intensity)
        
        keyboard = []
        if suggested_activities:
            for activity in suggested_activities:
                keyboard.append([InlineKeyboardButton(f"🧘 {activity}", callback_data=f'activity_{activity.lower().replace(" ", "_")}')])
        
        keyboard.extend([
            [InlineKeyboardButton("📝 Add Note", callback_data=f'add_note_{mood.lower()}_{intensity}')],
            [InlineKeyboardButton("📊 View Mood History", callback_data='mood_history')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ])
        
        # Check if crisis intervention is needed
        if (mood.lower() in ['sad', 'angry', 'overwhelmed'] and intensity >= 4) or intensity == 5:
            keyboard.insert(0, [InlineKeyboardButton("🆘 Get Immediate Support", callback_data='crisis_support')])
            response_text += "\n\n⚠️ *I notice you're experiencing intense emotions. Please know that support is available.*"
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            f"*Mood logged: {mood} (Intensity: {intensity}/5)*\n\n{response_text}",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'mood_history':
        history_text = generate_mood_history_text(user_id)
        keyboard = [
            [InlineKeyboardButton("📈 Mood Insights", callback_data='mood_insights')],
            [InlineKeyboardButton("🧘 Wellness Activities", callback_data='wellness_menu')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            f"📊 *Your Mood History*\n\n{history_text}",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'wellness_menu':
        keyboard = [
            [InlineKeyboardButton("🫁 Breathing Exercise", callback_data='activity_breathing')],
            [InlineKeyboardButton("🌱 Grounding Technique", callback_data='activity_grounding')],
            [InlineKeyboardButton("🙏 Gratitude Practice", callback_data='activity_gratitude')],
            [InlineKeyboardButton("🚶 Gentle Movement", callback_data='activity_movement')],
            [InlineKeyboardButton("🎵 Calming Music", callback_data='activity_music')],
            [InlineKeyboardButton("📖 Positive Affirmations", callback_data='activity_affirmations')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "🧘 *Wellness Activities*\n\n"
            "Choose an activity to help improve your mental well-being:\n\n"
            "These evidence-based techniques can help you manage stress, anxiety, and difficult emotions.",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data.startswith('activity_'):
        activity_key = query.data.replace('activity_', '')
        activity_text = generate_activity_instructions(activity_key)
        
        keyboard = [
            [InlineKeyboardButton("✅ Completed Activity", callback_data=f'completed_{activity_key}')],
            [InlineKeyboardButton("🔄 Try Another Activity", callback_data='wellness_menu')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            activity_text,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data.startswith('completed_'):
        activity = query.data.replace('completed_', '').replace('_', ' ').title()
        user_data[user_id]['wellness_streak'] += 1
        
        await query.edit_message_text(
            f"🎉 *Great job completing the {activity}!*\n\n"
            f"Wellness streak: {user_data[user_id]['wellness_streak']} activities\n\n"
            f"How are you feeling after this activity? Regular practice of wellness activities can significantly improve your mental health over time.",
            parse_mode='Markdown',
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("💭 Check Mood Again", callback_data='mood_checkin')],
                [InlineKeyboardButton("🧘 More Activities", callback_data='wellness_menu')],
                [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
            ])
        )
        
    elif query.data == 'crisis_support':
        user_data[user_id]['crisis_support_shown'] = True
        crisis_text = generate_crisis_support_text()
        
        keyboard = [
            [InlineKeyboardButton("🫂 Talk to Someone Now", callback_data='talk_now')],
            [InlineKeyboardButton("🧘 Immediate Coping", callback_data='immediate_coping')],
            [InlineKeyboardButton("📞 Local Resources", callback_data='local_resources')],
            [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            crisis_text,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'language_support':
        keyboard = []
        for lang_key, lang_info in LANGUAGES.items():
            keyboard.append([InlineKeyboardButton(
                f"{lang_info['name']}", 
                callback_data=f'set_language_{lang_key}'
            )])
        keyboard.append([InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "🌍 *Choose Your Preferred Language*\n\n"
            "I can provide mental health support in multiple regional languages to ensure you feel comfortable and understood.\n\n"
            "Select your preferred language:",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data.startswith('set_language_'):
        language = query.data.replace('set_language_', '')
        user_data[user_id]['language'] = language
        lang_name = LANGUAGES[language]['name']
        
        await query.edit_message_text(
            f"✅ *Language set to {lang_name}*\n\n"
            f"I'll now provide culturally appropriate mental health support in your preferred language.\n\n"
            f"*Remember: Mental health support should always be culturally sensitive and respectful of your background.*",
            parse_mode='Markdown',
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🔙 Back to Mitra", callback_data='mitra')]
            ])
        )

    # Handle other existing callbacks (sakhi, educare, etc.)
    elif query.data == 'sakhi':
        user_data[user_id]['active_module'] = 'sakhi'
        keyboard = [
            [InlineKeyboardButton("📅 Track Period", callback_data='track_period')],
            [InlineKeyboardButton("🔮 Cycle Predictions", callback_data='predictions')],
            [InlineKeyboardButton("📊 Health Insights", callback_data='insights')],
            [InlineKeyboardButton("🏠 Main Menu", callback_data='main_menu')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "🌸 *Sakhi Module - Your Menstrual Health Companion*\n\n"
            "I'm here to help you track your cycle, predict your periods, and provide personalized health insights.\n\n"
            "What would you like to do?",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'educare':
        user_data[user_id]['active_module'] = 'educare'
        keyboard = [
            [InlineKeyboardButton("📝 Voice Notes Help", callback_data='voice_help')],
            [InlineKeyboardButton("🧠 Study Tips", callback_data='study_tips')],
            [InlineKeyboardButton("📚 Learning Resources", callback_data='resources')],
            [InlineKeyboardButton("🏠 Main Menu", callback_data='main_menu')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "📚 *EduCare Module - Your Learning Assistant*\n\n"
            "I can help you with study techniques, note-taking strategies, and learning optimization.\n\n"
            "What would you like to explore?",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        
    elif query.data == 'main_menu':
        keyboard = [
            [InlineKeyboardButton("🌸 Sakhi - Menstrual Health", callback_data='sakhi')],
            [InlineKeyboardButton("📚 EduCare - Learning Assistant", callback_data='educare')],
            [InlineKeyboardButton("💚 Mitra - Mental Health Support", callback_data='mitra')],
            [InlineKeyboardButton("🌍 Language Settings", callback_data='language_settings')],
            [InlineKeyboardButton("ℹ️ About Ykarb", callback_data='about')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "🌟 *Welcome back to Ykarb!*\n\nChoose a module or just chat with me:",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )

# ✅ Helper functions for Mitra module
def get_mood_trend(user_id: int) -> str:
    """Generate mood trend analysis"""
    if user_id not in user_data or not user_data[user_id]['mood_history']:
        return "📊 Start tracking your mood to see patterns and insights."
    
    recent_moods = user_data[user_id]['mood_history'][-7:]  # Last 7 entries
    if len(recent_moods) < 3:
        return "📊 Keep tracking to see your mood patterns."
    
    avg_intensity = sum(entry['intensity'] for entry in recent_moods) / len(recent_moods)
    
    if avg_intensity >= 4:
        return "📈 Your recent mood trend shows high intensity emotions. Consider wellness activities."
    elif avg_intensity >= 3:
        return "📊 Your mood has been moderate recently. You're doing well!"
    else:
        return "📉 Your recent moods show lower intensity. Let's work on some uplifting activities."

def generate_mood_response(mood: str, intensity: int) -> tuple:
    """Generate personalized response based on mood and intensity"""
    responses = {
        'happy': {
            'low': "😊 I'm glad you're feeling happy! Even small moments of joy are precious.",
            'high': "🌟 Wonderful! Your happiness is radiating. What's bringing you such joy today?"
        },
        'sad': {
            'low': "😢 It's okay to feel sad sometimes. Your emotions are valid. Would you like to talk about it?",
            'high': "💙 I can feel your sadness, and I want you to know you're not alone. Let's work through this together."
        },
        'anxious': {
            'low': "😰 A little anxiety is normal. Let's try some calming techniques.",
            'high': "🫂 Anxiety can be overwhelming. Let's focus on grounding techniques to help you feel safer."
        },
        'angry': {
            'low': "😡 It's natural to feel frustrated sometimes. What's bothering you?",
            'high': "🔥 I can sense your anger is intense. Let's find healthy ways to process these feelings."
        },
        'peaceful': {
            'low': "😌 A sense of peace is beautiful. Cherish this calm moment.",
            'high': "🕊️ What a wonderful state of peace! This is your inner strength shining through."
        },
        'tired': {
            'low': "😴 A little tiredness is normal. Make sure you're getting enough rest.",
            'high': "💤 You sound exhausted. Rest is not selfish - it's necessary for your wellbeing."
        },
        'overwhelmed': {
            'low': "😵‍💫 Feeling a bit overwhelmed? Let's break things down into smaller steps.",
            'high': "🌊 Overwhelm can feel like drowning. Let's find your life raft with some grounding techniques."
        },
        'grateful': {
            'low': "🙏 Gratitude is a beautiful feeling, even in small doses.",
            'high': "✨ Your gratitude is powerful! This positive energy will attract more good things."
        }
    }
    
    intensity_level = 'high' if intensity >= 4 else 'low'
    response = responses.get(mood.lower(), {}).get(intensity_level, "Thank you for sharing how you feel.")
    
    # Suggest activities based on mood
    suggested_activities = []
    if mood.lower() in ['anxious', 'overwhelmed']:
        suggested_activities = ['Breathing Exercise', 'Grounding Technique']
    elif mood.lower() in ['sad', 'angry']:
        suggested_activities = ['Gentle Movement', 'Gratitude Practice']
    elif mood.lower() == 'tired':
        suggested_activities = ['Gentle Movement', 'Positive Affirmations']
    else:
        suggested_activities = ['Gratitude Practice', 'Breathing Exercise']
    
    return response, suggested_activities

def generate_mood_history_text(user_id: int) -> str:
    """Generate mood history summary"""
    if user_id not in user_data or not user_data[user_id]['mood_history']:
        return "No mood entries yet. Start tracking to see your patterns!"
    
    history = user_data[user_id]['mood_history'][-10:]  # Last 10 entries
    history_text = ""
    
    for entry in reversed(history):
        date = datetime.fromisoformat(entry['date']).strftime("%m/%d %H:%M")
        history_text += f"• {date}: {entry['mood']} ({entry['intensity']}/5)\n"
    
    return history_text

def generate_activity_instructions(activity_key: str) -> str:
    """Generate detailed activity instructions"""
    if activity_key in WELLNESS_ACTIVITIES:
        activity = WELLNESS_ACTIVITIES[activity_key]
        instructions = "\n".join(activity['instructions'])
        return f"{activity['title']}\n\n{activity['description']}\n\n*Instructions:*\n{instructions}\n\nTake your time and be gentle with yourself. 💚"
    
    # Additional activities not in the main dict
    additional_activities = {
        'music': {
            'title': '🎵 Calming Music Therapy',
            'instructions': 'Listen to soft, calming music for 5-10 minutes. Focus on the melody and let it wash over you.'
        },
        'affirmations': {
            'title': '📖 Positive Affirmations',
            'instructions': 'Repeat these affirmations:\n• I am worthy of love and respect\n• I am stronger than my challenges\n• I choose peace over worry\n• I am enough, just as I am'
        }
    }
    
    if activity_key in additional_activities:
        activity = additional_activities[activity_key]
        return f"{activity['title']}\n\n{activity['instructions']}\n\nTake your time and be kind to yourself. 💚"
    
    return "🧘 Take a few deep breaths and focus on the present moment. You're doing great! 💚"

def generate_crisis_support_text() -> str:
    """Generate crisis support information"""
    return """
🆘 *Immediate Crisis Support*

**You are not alone. Your life has value.**

If you're having thoughts of self-harm or suicide, please reach out immediately:

🇺🇸 **US Crisis Lifeline:** 988
🇬🇧 **UK Samaritans:** 116 123
🇮🇳 **India AASRA:** 91-9820466726
🌍 **International:** befrienders.org

**Right now, you can:**
• Call a crisis hotline
• Go to your nearest emergency room
• Call emergency services (911, 999, 112)
• Reach out to a trusted friend or family member

**Remember:**
• This feeling is temporary
• You matter and are loved
• Professional help is available
• Recovery is possible

*Please don't hesitate to seek immediate professional help if you're in crisis.*
    """

# ✅ Enhanced message handler with crisis detection
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    user_id = update.effective_user.id
    
    # Initialize user data if not exists
    if user_id not in user_data:
        user_data[user_id] = {
            'active_module': None, 
            'language': 'english',
            'cycle_data': {}, 
            'mood_history': [], 
            'wellness_streak': 0,
            'notes': [],
            'crisis_support_shown': False
        }
    
    logger.info(f"User {user_id}: {user_message}")
    
    # Crisis detection
    if bot.detect_crisis_keywords(user_message):
        crisis_keyboard = [
            [InlineKeyboardButton("🆘 Get Immediate Help", callback_data='crisis_support')],
            [InlineKeyboardButton("🫂 Talk to Me", callback_data='mitra')],
            [InlineKeyboardButton("🧘 Coping Techniques", callback_data='immediate_coping')]
        ]
        reply_markup = InlineKeyboardMarkup(crisis_keyboard)
        
        await update.message.reply_text(
            "🚨 *I'm concerned about you*\n\n"
            "I noticed you might be going through a really difficult time. Please know that you're not alone and that help is available.\n\n"
            "**If you're in immediate danger, please contact emergency services or a crisis hotline right away.**\n\n"
            "I'm here to support you. What would help you most right now?",
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
        return
    
    # Build context based on active module and user history
    context_info = ""
    active_module = user_data[user_id].get('active_module')
    user_language = user_data[user_id].get('language', 'english')
    
    if active_module:
        context_info += f"Active module: {active_module}. "
        
    if user_data[user_id]['mood_history']:
        recent_mood = user_data[user_id]['mood_history'][-1]
        context_info += f"Recent mood: {recent_mood['mood']} (intensity: {recent_mood['intensity']}/5). "
    
    if user_data[user_id]['wellness_streak'] > 0:
        context_info += f"Wellness streak: {user_data[user_id]['wellness_streak']} activities. "
    
    # Get AI response with context and language preference
    reply = await bot.get_gemini_response(user_message, context_info, user_language)
    
    # Add typing indicator for more natural feel
    await update.message.reply_chat_action("typing")
    await asyncio.sleep(1)  # Brief pause for natural conversation flow
    
    # Add helpful buttons based on context
    keyboard = []
    if active_module == 'mitra':
        keyboard = [
            [InlineKeyboardButton("💭 Check Mood", callback_data='mood_checkin')],
            [InlineKeyboardButton("🧘 Wellness Activity", callback_data='wellness_menu')]
        ]
    elif not active_module:
        keyboard = [
            [InlineKeyboardButton("💚 Mitra Support", callback_data='mitra')],
            [InlineKeyboardButton("🌟 Main Menu", callback_data='main_menu')]
        ]
    
    reply_markup = InlineKeyboardMarkup(keyboard) if keyboard else None
    
    await update.message.reply_text(reply, reply_markup=reply_markup)

# ✅ Error handler
async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.error(f"Update {update} caused error {context.error}")
    if update and update.message:
        await update.message.reply_text(
            "🔧 I encountered an error. Please try again or contact support if the issue persists."
        )

# ✅ Main app setup
async def main():
    if not TELEGRAM_TOKEN or TELEGRAM_TOKEN == "YOUR_TELEGRAM_TOKEN_HERE":
        logger.error("❌ TELEGRAM_TOKEN not set!")
        return
        
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        logger.error("❌ GEMINI_API_KEY not set!")
        return
    
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    
    # Add handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button_handler))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))
    app.add_error_handler(error_handler)

    logger.info("🤖 Ykarb Bot is running... Press Ctrl+C to stop.")
    await app.run_polling(drop_pending_updates=True)

# ✅ Cross-platform safe launcher
def run():
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("🛑 Bot stopped by user")
    except RuntimeError as e:
        if "already running" in str(e):
            loop = asyncio.get_running_loop()
            loop.create_task(main())
        else:
            raise

if __name__ == "__main__":
    run()