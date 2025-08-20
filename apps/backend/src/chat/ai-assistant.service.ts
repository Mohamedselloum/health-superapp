import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_calls?: any[];
}

export interface SymptomIntake {
  age?: number;
  sex?: string;
  symptoms: string[];
  onset?: string;
  severity?: number;
  medications?: string[];
  conditions?: string[];
  emergency_signs?: boolean;
}

export interface TriageResult {
  level: 'self_care' | 'see_doctor' | 'urgent';
  reasoning: string;
  recommendations: string[];
  recommended_guides?: number[];
  recommended_products?: number[];
}

@Injectable()
export class AiAssistantService {
  constructor(private configService: ConfigService) {}

  async processSymptomIntake(intake: SymptomIntake): Promise<TriageResult> {
    // Mock triage logic - in production, this would use a real AI model
    const { symptoms, severity = 1, emergency_signs = false } = intake;

    // Emergency detection
    if (emergency_signs || this.detectEmergencySymptoms(symptoms)) {
      return {
        level: 'urgent',
        reasoning: 'Emergency symptoms detected that require immediate medical attention.',
        recommendations: [
          'Call emergency services immediately (911 or local emergency number)',
          'Do not delay seeking immediate medical care',
          'If possible, have someone accompany you to the hospital'
        ],
        recommended_guides: [],
        recommended_products: []
      };
    }

    // Severe symptoms
    if (severity >= 8 || this.detectSevereSymptoms(symptoms)) {
      return {
        level: 'see_doctor',
        reasoning: 'Your symptoms are concerning and should be evaluated by a healthcare professional.',
        recommendations: [
          'Schedule an appointment with your doctor within 24-48 hours',
          'Monitor symptoms and seek immediate care if they worsen',
          'Consider urgent care if your doctor is not available'
        ],
        recommended_guides: [1, 2], // Mock guide IDs
        recommended_products: [1, 4] // Mock product IDs (thermometer, first aid kit)
      };
    }

    // Mild to moderate symptoms
    return {
      level: 'self_care',
      reasoning: 'Your symptoms appear to be mild and may be managed with self-care measures.',
      recommendations: [
        'Rest and stay hydrated',
        'Monitor symptoms for any changes',
        'Consider over-the-counter remedies as appropriate',
        'Seek medical care if symptoms persist or worsen'
      ],
      recommended_guides: [1, 3], // Mock guide IDs
      recommended_products: [2, 5] // Mock product IDs (vitamins, supplements)
    };
  }

  async generateChatResponse(
    messages: ChatMessage[],
    userProfile?: any,
    triageResult?: TriageResult
  ): Promise<ChatMessage> {
    // Mock AI response - in production, this would call OpenAI or another LLM
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== 'user') {
      return {
        role: 'assistant',
        content: 'Hello! I\'m your AI Health Assistant. I\'m here to provide general health information and guidance. Please note that I cannot diagnose medical conditions or replace professional medical advice. How can I help you today?'
      };
    }

    // Crisis detection
    if (this.detectCrisisKeywords(lastMessage.content)) {
      return {
        role: 'assistant',
        content: '🚨 **IMPORTANT**: If you are experiencing a medical emergency or having thoughts of self-harm, please contact emergency services immediately:\n\n• **Emergency**: 911 (US) or your local emergency number\n• **Crisis Hotline**: 988 (US Suicide & Crisis Lifeline)\n\nI\'m here to provide general health information, but I cannot replace professional medical care in emergency situations. Please reach out to qualified professionals who can provide immediate assistance.'
      };
    }

    // Generate contextual response based on message content
    const response = this.generateMockResponse(lastMessage.content, triageResult);
    
    return {
      role: 'assistant',
      content: response
    };
  }

  private detectEmergencySymptoms(symptoms: string[]): boolean {
    const emergencyKeywords = [
      'chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious',
      'stroke', 'heart attack', 'severe allergic reaction', 'poisoning',
      'severe burns', 'broken bone', 'head injury'
    ];
    
    return symptoms.some(symptom => 
      emergencyKeywords.some(keyword => 
        symptom.toLowerCase().includes(keyword)
      )
    );
  }

  private detectSevereSymptoms(symptoms: string[]): boolean {
    const severeKeywords = [
      'high fever', 'persistent vomiting', 'severe pain', 'blood in stool',
      'blood in urine', 'severe headache', 'vision problems', 'confusion'
    ];
    
    return symptoms.some(symptom => 
      severeKeywords.some(keyword => 
        symptom.toLowerCase().includes(keyword)
      )
    );
  }

  private detectCrisisKeywords(content: string): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'self harm',
      'hurt myself', 'emergency', 'can\'t breathe', 'chest pain', 'overdose'
    ];
    
    const lowerContent = content.toLowerCase();
    return crisisKeywords.some(keyword => lowerContent.includes(keyword));
  }

  private generateMockResponse(userMessage: string, triageResult?: TriageResult): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common health topics
    if (lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      return `I understand you're asking about cold or flu symptoms. Here are some general self-care tips:

• **Rest**: Get plenty of sleep to help your body recover
• **Hydration**: Drink lots of fluids like water, herbal tea, and warm broth
• **Symptom relief**: Consider over-the-counter medications for comfort

**When to see a doctor:**
- Fever above 101.5°F (38.6°C)
- Symptoms lasting more than 10 days
- Difficulty breathing
- Severe headache or sinus pain

Would you like me to suggest some products that might help with symptom relief?

*Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice.*`;
    }

    if (lowerMessage.includes('headache')) {
      return `Headaches can have various causes. Here are some general relief strategies:

• **Rest**: Try lying down in a dark, quiet room
• **Hydration**: Dehydration is a common headache trigger
• **Temperature therapy**: Apply a cold or warm compress to your head or neck
• **Gentle massage**: Massage your temples and neck area

**When to seek medical help:**
- Sudden, severe headache unlike any before
- Headache with fever, stiff neck, or confusion
- Headache after a head injury
- Chronic headaches interfering with daily life

Would you like recommendations for headache relief products or more information about headache types?

*Remember: Never ignore severe or persistent headaches. Always consult a healthcare professional for proper diagnosis.*`;
    }

    if (lowerMessage.includes('pain')) {
      return `I understand you're experiencing pain. Pain management depends on the type and severity:

• **Mild pain**: Rest, ice/heat therapy, over-the-counter pain relievers
• **Chronic pain**: Requires professional medical evaluation
• **Severe pain**: Should be evaluated by a healthcare provider

**Red flags that need immediate attention:**
- Severe, sudden onset pain
- Pain with fever or other concerning symptoms
- Pain that interferes with daily activities

I'd recommend speaking with a healthcare professional for proper pain assessment and management strategies.

*This is general information only. For persistent or severe pain, please consult a medical professional.*`;
    }

    // Default empathetic response
    return `Thank you for sharing your health concern with me. I'm here to provide general health information and support.

Based on what you've told me, I'd recommend:

• **Monitor your symptoms** and note any changes
• **Stay hydrated** and get adequate rest
• **Consider gentle self-care measures** as appropriate
• **Seek professional medical advice** if symptoms persist or worsen

I can help you find relevant health guides or suggest products that might be helpful for general wellness. Would you like me to provide some recommendations?

**Important reminder**: I provide general health information only and cannot diagnose medical conditions. For specific medical concerns, please consult with a qualified healthcare professional.

Is there anything specific about your symptoms or health concerns you'd like to discuss further?`;
  }

  async detectMentalHealthConcerns(message: string): Promise<boolean> {
    const mentalHealthKeywords = [
      'depression', 'anxiety', 'panic', 'suicide', 'self harm', 'mental health',
      'therapy', 'counseling', 'psychiatrist', 'medication', 'mood'
    ];
    
    const lowerMessage = message.toLowerCase();
    return mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async getMentalHealthResources(): Promise<string[]> {
    return [
      'National Suicide Prevention Lifeline: 988',
      'Crisis Text Line: Text HOME to 741741',
      'NAMI (National Alliance on Mental Illness): 1-800-950-NAMI',
      'SAMHSA National Helpline: 1-800-662-4357'
    ];
  }
}

