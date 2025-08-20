import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Health Assistant. I'm here to provide general health information and guidance. Please note that I cannot diagnose medical conditions or replace professional medical advice. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    "I have a headache",
    "Cold symptoms",
    "Feeling tired",
    "Need health tips",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('headache')) {
      return `I understand you're experiencing a headache. Here are some general self-care tips:

• Rest in a quiet, dark room
• Stay hydrated with water
• Apply a cold or warm compress to your head or neck
• Consider gentle neck and shoulder stretches

**When to seek medical help:**
- Sudden, severe headache unlike any before
- Headache with fever, stiff neck, or confusion
- Headache after a head injury

*Remember: This is general information only. For persistent or severe headaches, please consult a healthcare professional.*`;
    }
    
    if (lowerText.includes('cold') || lowerText.includes('flu')) {
      return `For cold or flu-like symptoms, here are some general self-care measures:

• **Rest**: Get plenty of sleep to help your body recover
• **Hydration**: Drink lots of fluids like water, herbal tea, and warm broth
• **Symptom relief**: Consider over-the-counter medications for comfort

**When to see a doctor:**
- Fever above 101.5°F (38.6°C)
- Symptoms lasting more than 10 days
- Difficulty breathing
- Severe headache or sinus pain

*This information is for educational purposes only and is not a substitute for professional medical advice.*`;
    }
    
    if (lowerText.includes('tired') || lowerText.includes('fatigue')) {
      return `Feeling tired can have many causes. Here are some general tips:

• **Sleep hygiene**: Aim for 7-9 hours of quality sleep
• **Regular exercise**: Even light activity can boost energy
• **Balanced nutrition**: Eat regular, nutritious meals
• **Stay hydrated**: Dehydration can cause fatigue
• **Manage stress**: Practice relaxation techniques

**Consider seeing a healthcare provider if:**
- Fatigue persists despite adequate rest
- Accompanied by other concerning symptoms
- Interfering with daily activities

*For persistent fatigue, it's best to consult with a healthcare professional for proper evaluation.*`;
    }
    
    return `Thank you for your question. I'm here to provide general health information and support.

Based on what you've shared, I'd recommend:

• **Monitor your symptoms** and note any changes
• **Stay hydrated** and get adequate rest
• **Consider gentle self-care measures** as appropriate
• **Seek professional medical advice** if symptoms persist or worsen

**Important reminder**: I provide general health information only and cannot diagnose medical conditions. For specific medical concerns, please consult with a qualified healthcare professional.

Is there anything specific about your symptoms you'd like to discuss further?`;
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="medical" size={16} color="#ffffff" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatar}>
                <Ionicons name="medical" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Health Assistant</Text>
                <Text style={styles.headerSubtitle}>Always here to help</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="medical" size={16} color="#ffffff" />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <Text style={styles.typingText}>AI is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => sendMessage(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your health..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#ffffff' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#bfdbfe',
  },
  headerButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#bfdbfe',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9ca3af',
  },
  typingText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#374151',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});

export default ChatScreen;

