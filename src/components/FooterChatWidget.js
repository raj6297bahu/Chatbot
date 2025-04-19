import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ChatWidget = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: ${props => props.expanded ? '300px' : '60px'};
  height: ${props => props.expanded ? '400px' : '60px'};
  background-color: white;
  border-radius: ${props => props.expanded ? '10px' : '50%'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
`;

const ChatIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  position: ${props => props.expanded ? 'absolute' : 'relative'};
  bottom: ${props => props.expanded ? '15px' : '0'};
  right: ${props => props.expanded ? '15px' : '0'};
`;

const ChatHeader = styled.div`
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.div`
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;
  line-height: 1.4;
  font-size: 14px;
`;

const BotMessage = styled(Message)`
  background-color: #f1f0f0;
  align-self: flex-start;
`;

const UserMessage = styled(Message)`
  background-color: #e7f7e8;
  color: #333;
  align-self: flex-end;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const SendButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #3e8e41;
  }
`;

// Pre-defined bot responses
const RESPONSES = {
  greeting: "Hi there! How can I help with your pet's skin health today?",
  about: "PetCarePal is an AI-powered platform that helps diagnose pet skin conditions and recommend treatments.",
  help: "I can help diagnose skin issues, recommend treatments, and guide you through our store. What does your pet need help with?",
  fallback: "I'm still learning. For more detailed assistance, please use our main chat feature or contact our support team."
};

// Keywords to match in user input
const KEYWORDS = {
  greeting: ['hi', 'hello', 'hey', 'howdy'],
  about: ['about', 'what is', 'who are'],
  help: ['help', 'support', 'assist', 'guide'],
  skin: ['skin', 'rash', 'itch', 'allergy', 'condition']
};

const FooterChatWidget = ({ onOpenFullChat }) => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Initialize with a welcome message when first expanded
  useEffect(() => {
    if (expanded && messages.length === 0) {
      setMessages([
        { 
          type: 'bot', 
          text: "👋 Welcome to PetCarePal! I'm a simple assistant that can answer basic questions. How can I help you today?" 
        }
      ]);
    }
  }, [expanded, messages.length]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const toggleWidget = () => {
    setExpanded(!expanded);
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response based on keywords
    setTimeout(() => {
      let response;
      const lowercaseInput = input.toLowerCase();
      
      if (KEYWORDS.greeting.some(word => lowercaseInput.includes(word))) {
        response = RESPONSES.greeting;
      } else if (KEYWORDS.about.some(word => lowercaseInput.includes(word))) {
        response = RESPONSES.about;
      } else if (KEYWORDS.help.some(word => lowercaseInput.includes(word))) {
        response = RESPONSES.help;
      } else if (KEYWORDS.skin.some(word => lowercaseInput.includes(word))) {
        response = "It sounds like your pet might have a skin condition. For a proper diagnosis, I'd recommend using our main chat feature.";
      } else {
        response = RESPONSES.fallback;
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      
      // If the response includes suggesting the main chat, add a follow-up option
      if (response === RESPONSES.fallback || response.includes("main chat")) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "Would you like to open our full chat assistant for more detailed help?",
            action: true
          }]);
        }, 500);
      }
    }, 600);
    
    setInput('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <>
      {!expanded && (
        <ChatIcon expanded={false} onClick={toggleWidget}>
          💬
        </ChatIcon>
      )}
      
      {expanded && (
        <ChatWidget expanded={true}>
          <ChatHeader>
            <ChatTitle>PetCarePal Assistant</ChatTitle>
            <CloseButton onClick={toggleWidget}>×</CloseButton>
          </ChatHeader>
          
          <ChatBody>
            <ChatMessages>
              {messages.map((msg, index) => (
                <React.Fragment key={index}>
                  {msg.type === 'bot' ? (
                    <BotMessage>
                      {msg.text}
                      {msg.action && (
                        <div style={{ marginTop: '8px' }}>
                          <button 
                            onClick={onOpenFullChat}
                            style={{
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            Open Full Assistant
                          </button>
                        </div>
                      )}
                    </BotMessage>
                  ) : (
                    <UserMessage>{msg.text}</UserMessage>
                  )}
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </ChatMessages>
          </ChatBody>
          
          <ChatInputContainer>
            <ChatInput 
              type="text" 
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendButton onClick={handleSendMessage}>
              ➤
            </SendButton>
          </ChatInputContainer>
        </ChatWidget>
      )}
    </>
  );
};

export default FooterChatWidget; 