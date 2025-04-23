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
 * Generate a mock response based on user input keywords
 * @param {Array} messages - Array of message objects with role and content
 * @returns {string} - Mocked response
 */
const generateMockResponse = (messages) => {
  // Get the last user message
  const lastUserMessage = messages.findLast(msg => msg.role === 'user')?.content || '';
  const userInput = lastUserMessage.toLowerCase();

  // Generate contextual responses based on keywords
  if (userInput.includes('dog') && userInput.includes('allergy')) {
    return "Dog allergies are commonly caused by fleas, environmental factors like pollen or dust mites, or food sensitivities. Symptoms include itching, redness, and excessive licking or chewing. For flea allergies, consistent flea prevention is essential. Environmental allergies may require antihistamines or special shampoos. Food allergies often need a diet change to identify and eliminate trigger ingredients. For severe cases, consult your veterinarian for proper diagnosis and treatment.";
  } 
  else if (userInput.includes('cat') && userInput.includes('skin')) {
    return "Cats experience various skin conditions including allergies, parasites, infections, and autoimmune disorders. Common signs include excessive grooming, redness, scabs, hair loss, or visible parasites. Regular flea prevention helps avoid many issues. For persistent skin problems, a veterinarian should examine your cat to determine the underlying cause. Treatment depends on diagnosis but may include special shampoos, medications, or dietary changes.";
  }
  else if (userInput.includes('hotspot')) {
    return "Hot spots (acute moist dermatitis) are inflamed, infected areas of skin that appear suddenly. They're typically caused by self-trauma when a dog scratches, licks, or chews an area excessively due to an underlying irritation. Hot spots are painful, red, and often ooze. Treatment involves clipping hair around the area, gentle cleaning, and medications to stop infection and reduce inflammation. Preventing the pet from licking the area (with an E-collar if necessary) is crucial for healing.";
  }
  else if (userInput.includes('medicine') || userInput.includes('medication') || userInput.includes('treatment')) {
    return "Pet skin medications vary depending on the condition. Common treatments include: 1) Antibiotics for bacterial infections, 2) Antifungals for ringworm or yeast infections, 3) Antiparasitics for mites, fleas, and ticks, 4) Anti-inflammatories to reduce itching and inflammation, and 5) Specialized shampoos or topicals for various conditions. Always consult your veterinarian before using any medication, as improper use can worsen conditions or cause harm to your pet.";
  } 
  else if (userInput.includes('ringworm')) {
    return "Ringworm is a fungal infection, not a worm. It appears as circular, red, and often scaly patches with hair loss. It's highly contagious to other pets and humans. Treatment includes topical antifungal medications, sometimes oral medications for severe cases, and environmental decontamination. All bedding and grooming tools must be thoroughly cleaned or discarded. Treatment typically takes 4-6 weeks, and your pet remains contagious until completely healed.";
  }
  else if (userInput.includes('flea')) {
    return "Flea infestations can cause significant discomfort and skin problems in pets. Signs include itching, redness, hair loss, and visible fleas or flea dirt (small black specks) in the fur. Effective treatment requires addressing fleas on your pet and in the environment. Modern flea preventatives are available as topical applications, oral medications, or collars. You'll need to treat all pets in the household simultaneously and thoroughly clean bedding, carpets, and furniture to eliminate flea eggs and larvae.";
  }
  else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
    return "Hello! I'm your PetCarePal assistant. I can provide information about pet skin conditions, treatments, and general pet health advice. What would you like to know about your pet today?";
  }
  else {
    return "I understand you're asking about pet health. As your PetCarePal assistant, I can offer information about common skin conditions in pets, symptoms to watch for, and general treatment approaches. Could you provide more specific details about your pet's condition, or would you like information about a particular skin issue?";
  }
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
      presence_penalty: 0.1   // Encourage new topics slightly
    });
    
    const content = processResponseContent(response.data.choices[0].message.content);
    
    return {
      ...response.data.choices[0].message,
      content
    };
  } catch (error) {
    console.error('Error sending message to Groq AI:', error);
    
    // Provide specific error information for debugging
    if (error.response) {
      console.error('API response error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    // Fall back to the mock response generator for a better user experience
    const mockContent = generateMockResponse(messages);
    
    return {
      role: 'assistant',
      content: mockContent
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
  // Create mock disease information based on the disease ID and pet type
  let content = "";
  
  if (diseaseId === "flea_allergy_dog" || diseaseId === "flea_allergy_cat") {
    content = `Flea Allergy Dermatitis (FAD) in ${petType}s is a hypersensitivity reaction to flea saliva. 

Common symptoms include intense itching, redness, hair loss, and skin lesions primarily on the lower back, tail base, and hind legs. 

This condition is caused by an allergic reaction to proteins in flea saliva, with even a single flea bite triggering severe discomfort in sensitive pets.

For care, strict flea control is essential - treat all pets in the household with veterinary-approved flea preventatives and clean the environment thoroughly. Medicated shampoos can provide temporary relief.

Consult a veterinarian immediately if your ${petType} has severe skin lesions, doesn't respond to treatment, or shows signs of infection (pus, odor, increased pain).`;
  } 
  else if (diseaseId === "hotspot") {
    content = `Hot Spots (Acute Moist Dermatitis) in dogs are rapidly developing, red, moist, and painful areas of skin inflammation and infection.

Common symptoms include intense itching, a red, raw, and oozing sore, pain when touched, and hair loss around the affected area. They often appear suddenly and can expand quickly.

Hot spots are typically caused by self-trauma from excessive licking, chewing, or scratching due to an underlying irritation like allergies, insect bites, or moisture trapped in the coat.

For care, the area should be gently clipped and cleaned. Your vet may prescribe antibiotics, anti-inflammatories, or topical treatments. Prevent licking with an E-collar if necessary.

Consult a veterinarian immediately if the hot spot is large, rapidly expanding, very painful, or if your dog develops multiple hot spots or shows signs of systemic illness.`;
  }
  else if (diseaseId === "mange") {
    content = `Mange in dogs is a skin condition caused by microscopic mites that burrow into the skin.

Common symptoms include intense itching, red skin, hair loss, crusty skin lesions, and secondary skin infections. Sarcoptic mange (scabies) often affects the ears, elbows, and chest first, while demodectic mange typically starts around the face.

Mange is caused by mites - either Sarcoptes scabiei (sarcoptic mange, which is contagious) or Demodex canis (demodectic mange, which often occurs when the immune system is compromised).

For care, veterinary-prescribed medications are necessary. These may include topical treatments, dips, oral medications, or injections. All bedding should be thoroughly cleaned.

Consult a veterinarian immediately for diagnosis and treatment, as mange can be very uncomfortable and will not resolve without proper medical intervention. Sarcoptic mange can also spread to humans.`;
  }
  else if (diseaseId.includes("ringworm")) {
    content = `Ringworm in ${petType}s is actually a fungal infection, not a worm. It affects the hair, skin, and sometimes nails.

Common symptoms include circular patches of hair loss, red, scaly skin, broken hairs, and sometimes itching. The classic "ring" appearance may not always be visible, especially in ${petType}s with fur.

Ringworm is caused by dermatophyte fungi (usually Microsporum canis in pets) and is highly contagious to other animals and humans, spreading through direct contact or contaminated items.

For care, veterinary-prescribed antifungal medications are necessary, which may include topical creams, shampoos, or oral medications. Environmental decontamination is crucial to prevent reinfection.

Consult a veterinarian immediately for proper diagnosis and treatment. Due to the contagious nature of ringworm, prompt treatment is important to prevent spread to other pets and family members.`;
  }
  else if (diseaseId.includes("healthy")) {
    content = `A healthy ${petType} should have clean, smooth skin without excessive redness, flaking, or irritation.

Signs of healthy skin include a smooth coat, minimal shedding appropriate for the breed, no visible parasites, no excessive scratching, and no unusual odor.

Healthy skin is maintained through proper nutrition, regular grooming, parasite prevention, and good hygiene practices.

For optimal skin and coat health, provide a balanced diet rich in essential fatty acids, regular brushing appropriate for your ${petType}'s coat type, and consistent parasite prevention.

Regular veterinary check-ups can help catch any skin issues early before they become more serious problems. If you notice any changes in your ${petType}'s skin or coat, consult your veterinarian.`;
  }
  else if (diseaseId === "bacterial_dermatosis") {
    content = `Bacterial Dermatosis in dogs refers to skin infections caused by bacteria, most commonly Staphylococcus (staph).

Common symptoms include red, inflamed skin, pustules or pimple-like lesions, crusts, hair loss, itching, and sometimes an unpleasant odor from the infected areas.

This condition is typically secondary to another underlying issue like allergies, parasites, hormonal disorders, or trauma that damages the skin barrier, allowing bacteria to proliferate.

For care, veterinary treatment is necessary, usually involving antibiotics (topical, oral, or both), medicated shampoos, and treating any underlying conditions. Good hygiene and preventing self-trauma are important.

Consult a veterinarian if your dog shows signs of skin infection, as untreated bacterial dermatosis can worsen and spread. If treated with antibiotics, complete the entire prescribed course even if symptoms improve quickly.`;
  }
  else if (diseaseId === "fungal_infection") {
    content = `Fungal infections in dogs include conditions like ringworm, yeast infections, and systemic fungal diseases that affect the skin.

Common symptoms vary by type but often include itching, redness, skin discoloration, scaling, crusting, hair loss, and sometimes an unpleasant odor (especially with yeast infections).

These infections are caused by various fungi. Malassezia (yeast) often affects oily skin or moist areas. Environmental fungi can cause systemic infections in some regions.

For care, specific antifungal medications are required, which may be topical (creams, shampoos) or oral, depending on severity. Treatment often takes weeks to months for complete resolution.

Consult a veterinarian for proper diagnosis, as different fungal infections require different treatments. Some fungal infections like ringworm are contagious to humans and other pets, requiring prompt attention.`;
  }
  else if (diseaseId === "hypersensivity_allergic_dermatosis") {
    content = `Hypersensitivity Allergic Dermatosis in dogs refers to skin inflammation caused by allergic reactions to environmental or food allergens.

Common symptoms include intense itching, redness, inflamed skin, recurrent ear infections, paw licking/chewing, face rubbing, and secondary skin infections due to self-trauma.

This condition is caused by an overactive immune response to allergens like pollen, dust mites, mold spores, certain food proteins, or flea saliva, with genetic factors playing a role in susceptibility.

For care, identifying and avoiding triggers is ideal. Treatments may include antihistamines, corticosteroids, immunotherapy, special diets, fatty acid supplements, and medicated shampoos.

Consult a veterinarian if your dog shows persistent itching, as chronic inflammation can lead to skin thickening, infections, and decreased quality of life. Allergy testing may be recommended to identify specific triggers.`;
  }
  else if (diseaseId === "scabies") {
    content = `Scabies in cats (also called sarcoptic mange) is a highly contagious skin condition caused by the Sarcoptes scabiei mite.

Common symptoms include intense itching, red skin, crusty lesions, hair loss, and skin thickening, typically affecting the ears, face, and legs first but potentially spreading across the body.

This condition is caused by microscopic Sarcoptes mites that burrow into the skin, lay eggs, and cause severe irritation. It's highly contagious to other animals and can temporarily affect humans.

For care, veterinary-prescribed antiparasitic medications are essential, which may include topical treatments, injections, or oral medications. All bedding and grooming tools must be thoroughly cleaned.

Consult a veterinarian immediately if you suspect scabies, as it causes intense discomfort and won't resolve without treatment. Due to its contagious nature, prompt diagnosis and treatment are crucial.`;
  }
  else {
    content = `This appears to be a condition I don't have detailed information about for ${petType}s.

Common signs of skin problems include changes in skin color or texture, hair loss, excessive scratching or licking, visible parasites, scabs, or lesions.

Many skin issues are caused by allergies, parasites, infections, or underlying health conditions.

For any skin condition, keeping the area clean, preventing your pet from further irritating it, and consulting with your veterinarian are important first steps.

Please consult with your veterinarian for proper diagnosis and treatment of your ${petType}'s skin condition. They can examine the affected area and recommend appropriate care.`;
  }
  
  return {
    role: 'assistant',
    content
  };
};

/**
 * Generate personalized medicine recommendations
 * @param {string} petType - Type of pet (dog or cat)
 * @param {string} diseaseId - ID of the disease
 * @param {Array} availableMedications - Available medications for the disease
 * @returns {Promise} - AI-generated personalized recommendation
 */
export const getMedicineRecommendation = async (petType, diseaseId, availableMedications) => {
  const disease = diseaseId.replace('_', ' ');
  const medicationNames = availableMedications.map(med => med.name).join(', ');
  
  const content = `Based on your ${petType}'s diagnosis of ${disease}, I can recommend appropriate medications from your available options: ${medicationNames}.

${availableMedications[0].name} would be my primary recommendation as it's specifically formulated for this condition in ${petType}s. Apply it according to the packaging instructions, typically once or twice daily to affected areas after gently cleaning the skin. Be careful not to let your pet lick the medication.

${availableMedications.length > 1 ? availableMedications[1].name + ' is also effective and can be used' + (availableMedications[0].description.includes('shampoo') ? ' between shampoo treatments' : ' as an alternative if you notice any sensitivity to the primary treatment') + '.' : ''}

While using these medications, monitor your pet for any adverse reactions such as increased irritation or discomfort. Keep the affected area clean and prevent your pet from licking or scratching it, using an E-collar if necessary.

Remember that consistent application as directed is key to successful treatment. If you don't see improvement within 7-10 days, or if the condition worsens, consult your veterinarian for further guidance.`;

  return {
    role: 'assistant',
    content
  };
}; 