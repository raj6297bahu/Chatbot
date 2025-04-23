// API Configuration
export const GROQ_API_KEY = "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";
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Pet Types
export const PET_TYPES = {
  DOG: "dog",
  CAT: "cat"
};

// Disease Types
export const DISEASE_TYPES = {
  DOG: [
    { id: "flea_allergy_dog", name: "Flea Allergy" },
    { id: "hotspot", name: "Hotspot" },
    { id: "mange", name: "Mange" },
    { id: "ringworm_dog", name: "Ringworm" },
    { id: "healthy_dog", name: "Healthy" },
    { id: "bacterial_dermatosis", name: "Bacterial Dermatosis" },
    { id: "fungal_infection", name: "Fungal Infection" },
    { id: "hypersensivity_allergic_dermatosis", name: "Hypersensivity Allergic Dermatosis" }
  ],
  CAT: [
    { id: "flea_allergy_cat", name: "Flea Allergy" },
    { id: "ringworm_cat", name: "Ringworm" },
    { id: "healthy_cat", name: "Healthy" },
    { id: "scabies", name: "Scabies" }
  ]
};

// Medication Recommendations
export const MEDICATIONS = {
  flea_allergy_dog: [
    { id: "med1", name: "Flea Away Plus", description: "Topical flea treatment for dogs", price: 25.99 },
    { id: "med2", name: "AllergiVet-D", description: "Antihistamine for canine allergies", price: 19.99 }
  ],
  hotspot: [
    { id: "med3", name: "Hotspot Relief Spray", description: "Fast-acting hotspot treatment", price: 15.99 },
    { id: "med4", name: "Dermacool Gel", description: "Cooling gel for irritated skin", price: 12.50 }
  ],
  mange: [
    { id: "med5", name: "MangeX Shampoo", description: "Medicated shampoo for mange", price: 18.99 },
    { id: "med6", name: "MiteClear Solution", description: "Treatment for sarcoptic and demodectic mange", price: 29.99 }
  ],
  ringworm_dog: [
    { id: "med7", name: "FungiDerm", description: "Antifungal cream for ringworm", price: 22.99 },
    { id: "med8", name: "RingAway Spray", description: "Topical spray for ringworm", price: 17.99 }
  ],
  healthy_dog: [
    { id: "med9", name: "VitaSkin", description: "Skin and coat supplement", price: 24.99 },
    { id: "med10", name: "DermaCare Shampoo", description: "Moisturizing shampoo for healthy coat", price: 14.99 }
  ],
  bacterial_dermatosis: [
    { id: "med11", name: "BactiVet Cream", description: "Antibacterial treatment for dermatosis", price: 27.99 },
    { id: "med12", name: "DermaClean Solution", description: "Cleansing solution for bacterial infections", price: 21.50 }
  ],
  fungal_infection: [
    { id: "med13", name: "FungoCure", description: "Broad spectrum antifungal treatment", price: 23.99 },
    { id: "med14", name: "DermaFungi Drops", description: "Powerful antifungal medication", price: 31.99 }
  ],
  hypersensivity_allergic_dermatosis: [
    { id: "med15", name: "AllerShield", description: "Advanced allergy treatment for dogs", price: 28.99 },
    { id: "med16", name: "DermaCool Antihistamine", description: "Powerful anti-allergy medication", price: 32.50 }
  ],
  flea_allergy_cat: [
    { id: "med17", name: "FeliGuard Flea Treatment", description: "Gentle flea treatment for cats", price: 23.99 },
    { id: "med18", name: "AllergiVet-C", description: "Feline antihistamine for allergies", price: 18.99 }
  ],
  ringworm_cat: [
    { id: "med19", name: "FelineFungi Cream", description: "Cat-safe antifungal treatment", price: 21.99 },
    { id: "med20", name: "RingClear Mousse", description: "Easy application ringworm treatment", price: 16.99 }
  ],
  healthy_cat: [
    { id: "med21", name: "ShinyCoat Supplement", description: "Nutritional supplement for cat skin health", price: 22.99 },
    { id: "med22", name: "FelineSilk Shampoo", description: "Gentle shampoo for healthy coat", price: 13.99 }
  ],
  scabies: [
    { id: "med23", name: "ScabiesClear", description: "Fast-acting treatment for cat scabies", price: 26.99 },
    { id: "med24", name: "MiteAway Drops", description: "Topical mite treatment", price: 19.99 }
  ]
}; 