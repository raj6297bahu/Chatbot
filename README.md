# PetCarePal - AI-Powered Pet Skin Condition Assistant

PetCarePal is an AI-powered application designed to help pet owners identify and understand skin conditions in their pets. The application provides information, treatment recommendations, and medication options.

## Features

### 1. Interactive Chat Assistant
- Guided conversation to identify pet skin conditions
- Personalized recommendations based on your pet's symptoms
- AI-powered responses using Groq's LLaMA 3 model
- Option to purchase recommended medications

### 2. Knowledge Search
- Search for specific information about pet skin conditions
- Get detailed, accurate information about symptoms, causes, and treatments
- Quick question suggestions for common queries
- Related questions to explore the topic further

### 3. Medicine Store
- Browse recommended medications for specific conditions
- Add items to cart and checkout
- Properly formatted payment form for secure transactions

### 4. Mini Chat Widget
- Quick access to chat assistance from any page
- Expandable interface for convenience

## Pet Skin Diseases Supported

### Dogs
- Flea Allergy
- Hotspot
- Mange
- Ringworm
- Healthy
- Bacterial Dermatosis
- Fungal Infection
- Hypersensivity Allergic Dermatosis

### Cats
- Flea Allergy
- Ringworm
- Healthy
- Scabies

## Installation and Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd petcarepal-chatbot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Groq AI API key:
   - Sign up for a Groq AI account and get your API key
   - Open `src/utils/config.js` and replace `your_groq_api_key_here` with your actual API key

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## How to Use

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

### Using the Chat Assistant

1. Click on "Chat with Assistant" from the home page or "Chat Assistant" in the navigation
2. Select your pet type (dog or cat)
3. Choose the skin condition from the available options
4. The AI will provide information and recommend medications
5. You can choose to view the medicine store or ask more questions

### Using the Knowledge Search

1. Click on "Search Pet Health Knowledge" from the home page or "Knowledge Search" in the navigation
2. Type your question in the search bar or select one of the quick questions
3. Review the detailed information provided
4. Explore related questions to learn more about the topic

### Using the Medicine Store

1. Access the store via the chat assistant's recommendations
2. Browse available medications for your pet's condition
3. Add items to your cart
4. Complete the checkout process with the payment form

## Technologies Used

- React.js
- Groq AI API
- Styled Components
- Axios for API requests
- React Router for navigation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 