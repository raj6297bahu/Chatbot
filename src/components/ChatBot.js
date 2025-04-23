import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { sendChatMessage } from '../api/chatbotApi';
import { CHAT_STATES, getDiseaseSelectionMessage, getWelcomeMessage, processUserMessage } from '../utils/chatLogic';
import { PET_TYPES } from '../utils/config';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  margin: 0 auto;
`;

const ChatHeader = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const HeaderLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #4CAF50;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const UserMessage = styled(Message)`
  align-self: flex-end;
  background-color: #DCF8C6;
  border-bottom-right-radius: 5px;
`;

const BotMessage = styled(Message)`
  align-self: flex-start;
  background-color: white;
  border-bottom-left-radius: 5px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  padding: 5px 0;
`;

const OptionButton = styled.button`
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 8px 15px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ChatInput = styled.div`
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
  }
`;

const SendButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3e8e41;
  }
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  
  .dot {
    width: 5px;
    height: 5px;
    background-color: #888;
    border-radius: 50%;
    margin: 0 2px;
    animation: pulse 1.5s infinite;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
`;

const ChatBot = ({ onMedicineSelect }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState(CHAT_STATES.INITIAL);
  const [chatContext, setChatContext] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage();
    setMessages([welcomeMessage]);
    setChatState(CHAT_STATES.PET_SELECTION);
  }, []);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Process the user message based on current state
      const response = await processUserMessage(input, chatState, chatContext);
      
      // Update chat context if needed
      if (response.petType) {
        setChatContext(prev => ({ ...prev, petType: response.petType }));
        setChatState(CHAT_STATES.DISEASE_SELECTION);
      } else if (response.diseaseId) {
        setChatContext(prev => ({ 
          ...prev, 
          diseaseId: response.diseaseId,
          medications: response.medications 
        }));
        setChatState(CHAT_STATES.MEDICINE_RECOMMENDATION);
      } else if (response.switchToFreeChat) {
        setChatState(CHAT_STATES.FREE_CHAT);
      } else if (response.exitFreeChat) {
        setChatState(CHAT_STATES.PET_SELECTION);
      }
      
      // Add bot response to chat and conversation history
      setMessages(prev => [...prev, response]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response.content }]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      setConversationHistory(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };
  
  const handleFreeTextMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Check if user wants to exit free chat mode
      if (input.toLowerCase().includes('exit') || 
          input.toLowerCase().includes('go back') || 
          input.toLowerCase().includes('start over')) {
        
        setChatState(CHAT_STATES.PET_SELECTION);
        const welcomeMessage = getWelcomeMessage();
        setMessages(prev => [...prev, welcomeMessage]);
        setConversationHistory(prev => [...prev, { 
          role: 'assistant',
          content: welcomeMessage.content 
        }]);
        setIsLoading(false);
        return;
      }
      
      // Use Groq AI with context from recent conversation history for better context awareness
      const recentMessages = conversationHistory.slice(-6); // Use last 6 messages for context
      
      let aiResponse;
      try {
        aiResponse = await sendChatMessage([
          { 
            role: 'system', 
            content: 'You are a veterinary assistant for PetCarePal, a service that helps pet owners identify and treat skin conditions in their pets. Provide helpful, accurate, and concise information. Your responses should be friendly and focused on pet health, particularly skin conditions. If asked about medication, you can recommend appropriate treatments but should suggest consulting a veterinarian for serious conditions. Keep responses under 3 paragraphs to be concise but informative.' 
          },
          ...recentMessages,
          { role: 'user', content: input }
        ]);
      } catch (apiError) {
        console.error('API call failed:', apiError);
        // Create a fallback response if the API call fails
        aiResponse = {
          role: 'assistant',
          content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment or exit free chat mode to use the structured assistance."
        };
      }
      
      const assistantMessage = { 
        role: 'assistant', 
        content: aiResponse.content,
        options: [
          { value: 'exit_free_chat', label: 'Exit free chat' }
        ]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in free text message handling:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. You might want to exit free chat mode and try the structured assistance instead.',
        options: [
          { value: 'exit_free_chat', label: 'Exit free chat' }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
      setConversationHistory(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };
  
  const handleOptionClick = (option) => {
    setInput(option.label);
    
    // If user selected medicine store option
    if (option.value === 'yes' && chatState === CHAT_STATES.MEDICINE_RECOMMENDATION) {
      onMedicineSelect(chatContext.medications);
    } else if (option.value === 'chat_freely') {
      setChatState(CHAT_STATES.FREE_CHAT);
      const message = { 
        role: 'assistant', 
        content: "I'm now in free chat mode. Feel free to ask me anything about pet skin conditions or treatments!",
        options: [
          { value: 'exit_free_chat', label: 'Exit free chat' }
        ]
      };
      setMessages(prev => [...prev, message]);
      setConversationHistory(prev => [...prev, message]);
      return;
    } else if (option.value === 'exit_free_chat') {
      // Reset to pet selection when exiting free chat
      setChatState(CHAT_STATES.PET_SELECTION);
      const welcomeMessage = getWelcomeMessage();
      setMessages(prev => [...prev, welcomeMessage]);
      setConversationHistory(prev => [...prev, { 
        role: 'assistant',
        content: welcomeMessage.content 
      }]);
      return;
    } else if (option.value === PET_TYPES.DOG || option.value === PET_TYPES.CAT) {
      // Handle direct pet type selection
      setChatContext(prev => ({ ...prev, petType: option.value }));
      setChatState(CHAT_STATES.DISEASE_SELECTION);
      
      // Get disease selection message for selected pet type
      const diseaseMessage = getDiseaseSelectionMessage(option.value);
      setMessages(prev => [...prev, { ...diseaseMessage, petType: option.value }]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: diseaseMessage.content }]);
      return;
    }
    
    handleSendMessage();
  };
  
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (chatState === CHAT_STATES.FREE_CHAT) {
        handleFreeTextMessage();
      } else {
        handleSendMessage();
      }
    }
  };
  
  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderLogo>🐾</HeaderLogo>
        PetCarePal Support
      </ChatHeader>
      
      <ChatMessages>
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <BotMessage>
                {message.content}
                {message.options && (
                  <OptionsContainer>
                    {message.options.map((option, i) => (
                      <OptionButton 
                        key={i} 
                        onClick={() => handleOptionClick(option)}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                )}
              </BotMessage>
            )}
          </div>
        ))}
        
        {isLoading && (
          <BotMessage>
            <LoadingDots>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </LoadingDots>
          </BotMessage>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <ChatInput>
        <Input 
          type="text" 
          placeholder={chatState === CHAT_STATES.FREE_CHAT ? "Ask me anything about pet health..." : "Type your message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        <SendButton onClick={chatState === CHAT_STATES.FREE_CHAT ? handleFreeTextMessage : handleSendMessage}>
          →
        </SendButton>
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatBot; 