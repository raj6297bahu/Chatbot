import { sendChatMessage } from '../api/chatbotApi';
import { DISEASE_TYPES, MEDICATIONS, PET_TYPES } from './config';

// Define chatbot states
export const CHAT_STATES = {
  INITIAL: 'initial',
  PET_SELECTION: 'pet_selection',
  DISEASE_SELECTION: 'disease_selection',
  MEDICINE_RECOMMENDATION: 'medicine_recommendation',
  FREE_CHAT: 'free_chat'
};

/**
 * Get the initial welcome message
 * @returns {Object} - Message object
 */
export const getWelcomeMessage = () => {
  return {
    role: 'assistant',
    content: 'Welcome to PetCarePal Customer Support! I can help you with information about pet skin diseases and recommend treatments. First, please select the type of pet you have:',
    options: [
      { value: PET_TYPES.DOG, label: 'Dog' },
      { value: PET_TYPES.CAT, label: 'Cat' },
      { value: 'chat_freely', label: 'I just want to chat freely' }
    ]
  };
};

/**
 * Process text for NLP improvements
 * @param {string} text - The input text to process
 * @returns {string} - Processed text
 */
const processTextForNLP = (text) => {
  // Convert to lowercase for better matching
  let processed = text.toLowerCase();
  
  // Remove extra spaces
  processed = processed.replace(/\s+/g, ' ').trim();
  
  // Remove punctuation that might interfere with matching
  processed = processed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
  return processed;
};

/**
 * Check if text contains specific keywords
 * @param {string} text - The text to check
 * @param {Array} keywords - Keywords to check for
 * @returns {boolean} - Whether the text contains any of the keywords
 */
const containsKeywords = (text, keywords) => {
  const processedText = processTextForNLP(text);
  return keywords.some(keyword => 
    processedText.includes(processTextForNLP(keyword))
  );
};

/**
 * Get the disease selection message based on pet type
 * @param {string} petType - Type of pet
 * @returns {Object} - Message object
 */
export const getDiseaseSelectionMessage = (petType) => {
  const diseases = petType === PET_TYPES.DOG ? DISEASE_TYPES.DOG : DISEASE_TYPES.CAT;
  
  return {
    role: 'assistant',
    content: `Please select the skin condition for your ${petType}:`,
    options: [
      ...diseases.map(disease => ({
        value: disease.id,
        label: disease.name
      })),
      { value: 'chat_freely', label: 'I want to chat freely instead' }
    ]
  };
};

/**
 * Get recommended medications for a specific disease
 * @param {string} diseaseId - ID of the disease
 * @returns {Array} - List of recommended medications
 */
export const getRecommendedMedications = (diseaseId) => {
  return MEDICATIONS[diseaseId] || [];
};

/**
 * Format medication list for display
 * @param {Array} medications - List of medications
 * @returns {string} - Formatted medication list
 */
export const formatMedicationList = (medications) => {
  return medications.map(med => 
    `${med.name} ($${med.price.toFixed(2)}) - ${med.description}`
  ).join('\n\n');
};

/**
 * Generate a context-aware system prompt for better responses
 * @param {string} currentState - Current chat state
 * @param {Object} context - Current context
 * @returns {string} - The enhanced system prompt
 */
const generateSystemPrompt = (currentState, context = {}) => {
  const basePrompt = 'You are a veterinary assistant for PetCarePal, a service that helps pet owners identify and treat skin conditions in their pets.';
  
  switch(currentState) {
    case CHAT_STATES.DISEASE_SELECTION:
      return `${basePrompt} You are currently helping a ${context.petType} owner diagnose a skin condition. Be detailed yet concise in your explanations. Focus on symptoms, treatment options, and home care advice when discussing specific conditions.`;
    
    case CHAT_STATES.MEDICINE_RECOMMENDATION:
      return `${basePrompt} You are currently discussing ${context.diseaseId?.replace('_', ' ')} treatment for a ${context.petType}. Provide specific information about medications, their usage, potential side effects, and how they help treat the condition. Be precise and educational in your responses.`;
      
    case CHAT_STATES.FREE_CHAT:
      return `${basePrompt} Provide helpful, accurate, and concise information. Your responses should be friendly and focused on pet health, particularly skin conditions. If asked about medication, you can recommend appropriate treatments but should suggest consulting a veterinarian for serious conditions. If the question is outside your expertise in pet health, politely refocus the conversation.`;
      
    default:
      return `${basePrompt} Be helpful, accurate, and concise. Focus on providing useful information about pet skin conditions and treatments.`;
  }
};

/**
 * Process a user message based on the current chat state
 * @param {string} message - User message content
 * @param {string} currentState - Current chat state
 * @param {Object} context - Chat context
 * @returns {Promise<Object>} - Response object
 */
export const processUserMessage = async (message, currentState, context = {}) => {
  // Check if user wants to switch to free chat mode
  if (containsKeywords(message, ['chat freely', 'just want to chat', 'talk freely', 'free chat'])) {
    return {
      role: 'assistant',
      content: "I'm now in free chat mode. Feel free to ask me anything about pet skin conditions or treatments!",
      switchToFreeChat: true
    };
  }
  
  switch (currentState) {
    case CHAT_STATES.INITIAL:
      return getWelcomeMessage();
      
    case CHAT_STATES.PET_SELECTION:
      if (containsKeywords(message, ['dog'])) {
        return {
          ...getDiseaseSelectionMessage('dog'),
          petType: 'dog'
        };
      } else if (containsKeywords(message, ['cat'])) {
        return {
          ...getDiseaseSelectionMessage('cat'),
          petType: 'cat'
        };
      } else {
        return {
          role: 'assistant',
          content: 'Please select either "Dog" or "Cat", or choose to chat freely.',
          options: [
            { value: PET_TYPES.DOG, label: 'Dog' },
            { value: PET_TYPES.CAT, label: 'Cat' },
            { value: 'chat_freely', label: 'I just want to chat freely' }
          ]
        };
      }
      
    case CHAT_STATES.DISEASE_SELECTION:
      const { petType } = context;
      const diseases = petType === PET_TYPES.DOG ? DISEASE_TYPES.DOG : DISEASE_TYPES.CAT;
      
      // Find disease by ID or name (with fuzzy matching)
      const disease = diseases.find(d => 
        d.id === message || 
        processTextForNLP(d.name) === processTextForNLP(message) ||
        processTextForNLP(d.name).includes(processTextForNLP(message))
      );
      
      if (disease) {
        const medications = getRecommendedMedications(disease.id);
        const medicationText = formatMedicationList(medications);
        
        // Use Groq AI with enhanced system prompt
        const systemPrompt = generateSystemPrompt(CHAT_STATES.DISEASE_SELECTION, { petType, diseaseId: disease.id });
        const aiResponse = await sendChatMessage([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `My ${petType} has ${disease.name}. Can you tell me about this condition, its common symptoms, and recommend appropriate treatments?` }
        ]);
        
        return {
          role: 'assistant',
          content: `${aiResponse.content}\n\nRecommended medications:\n\n${medicationText}\n\nWould you like to purchase any of these medications?`,
          diseaseId: disease.id,
          medications,
          options: [
            { value: 'yes', label: 'Yes, show me the medicine store' },
            { value: 'no', label: 'No, thank you' },
            { value: 'more_info', label: 'Tell me more about this condition' },
            { value: 'chat_freely', label: 'I want to chat freely instead' }
          ]
        };
      } else {
        return {
          role: 'assistant',
          content: 'Please select a valid skin condition from the list:',
          options: [
            ...diseases.map(d => ({
              value: d.id,
              label: d.name
            })),
            { value: 'chat_freely', label: 'I want to chat freely instead' }
          ]
        };
      }
      
    case CHAT_STATES.FREE_CHAT:
    default:
      // Enhanced messaging with context maintenance
      const systemPrompt = generateSystemPrompt(CHAT_STATES.FREE_CHAT, context);
      
      const response = await sendChatMessage([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]);
      
      return {
        role: 'assistant',
        content: response.content
      };
  }
}; 