import axios from 'axios';
import { GROQ_API_KEY, GROQ_API_URL } from '../utils/config';

// Create an axios instance for the Groq API
const groqApi = axios.create({
  baseURL: GROQ_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GROQ_API_KEY}`
  },
  timeout: 30000 // 30 second timeout
});

/**
 * Process the response from Groq API to enhance or filter content
 * @param {string} content - The content returned from API
 * @returns {string} - The processed content
 */
const processResponseContent = (content) => {
  // Remove redundant identifiers that Groq sometimes adds
  let processed = content.replace(/^(Assistant:|ChatBot:|AI:|PetCarePal:)\s*/i, '');
  
  // Ensure we're not duplicating information from the prompt
  processed = processed.replace(/^I am a veterinary assistant for PetCarePal[,.]\s*/i, '');
  
  // Remove overly verbose acknowledgments
  processed = processed.replace(/^(I'd be happy to help|I would be happy to help|I'm happy to help)[,.]\s*/i, '');
  
  return processed.trim();
};

/**
 * Send a message to the Groq AI API with improved error handling
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise} - Response from the API
 */
export const sendChatMessage = async (messages) => {
  try {
    // Set temperature based on message count for more consistent responses
    // Lower temperature for more factual responses
    const temperature = 0.5;
    
    const response = await groqApi.post('', {
      model: 'llama3-8b-8192', // Using Llama 3 model through Groq
      messages,
      temperature,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.2, // Reduce repetition
      presence_penalty: 0.1,   // Encourage new topics slightly
    });
    
    const content = processResponseContent(response.data.choices[0].message.content);
    
    return {
      ...response.data.choices[0].message,
      content
    };
  } catch (error) {
    console.error('Error sending message to Groq AI:', error);
    
    // Provide more specific error information for debugging
    if (error.response) {
      // The request was made and the server responded with a non-2xx status
      console.error('API response error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    // Fallback to a simple response
    return {
      role: 'assistant',
      content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
    };
  }
};

/**
 * Generate a response about a specific pet disease
 * @param {string} petType - Type of pet (dog or cat)
 * @param {string} diseaseId - ID of the disease
 * @returns {Promise} - AI-generated response about the disease
 */
export const getDiseaseInformation = async (petType, diseaseId) => {
  const messages = [
    { 
      role: 'system', 
      content: `You are a veterinary assistant for PetCarePal specializing in pet skin conditions. 
      Focus on providing accurate, concise information about ${diseaseId.replace('_', ' ')} in ${petType}s.
      Your response should be structured as follows:
      1. Brief description of the condition
      2. Common symptoms to look for
      3. Typical causes
      4. General care advice
      5. When to consult a veterinarian
      Keep your entire response under 250 words for clarity.`
    },
    { role: 'user', content: `Please provide information about ${diseaseId.replace('_', ' ')} in ${petType}s.` }
  ];
  
  return sendChatMessage(messages);
};

/**
 * Generate personalized medicine recommendations
 * @param {string} petType - Type of pet (dog or cat)
 * @param {string} diseaseId - ID of the disease
 * @param {Array} availableMedications - Available medications for the disease
 * @returns {Promise} - AI-generated personalized recommendation
 */
export const getMedicineRecommendation = async (petType, diseaseId, availableMedications) => {
  const medicationNames = availableMedications.map(med => med.name).join(', ');
  
  const messages = [
    { 
      role: 'system', 
      content: `You are a veterinary medicine expert for PetCarePal. 
      Provide specific, actionable advice about medications for ${petType} skin conditions.
      Be precise about dosages, application methods, and potential side effects.
      Focus only on the medications mentioned, and suggest when a vet should be consulted.`
    },
    { 
      role: 'user', 
      content: `My ${petType} has been diagnosed with ${diseaseId.replace('_', ' ')}. 
      These medications are available: ${medicationNames}. 
      Which would you recommend and why? Please include specific information about how to use them.` 
    }
  ];
  
  return sendChatMessage(messages);
}; 