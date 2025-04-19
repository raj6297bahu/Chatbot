import React, { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import ChatBot from './components/ChatBot';
import FooterChatWidget from './components/FooterChatWidget';
import MedicineStore from './components/MedicineStore';
import SearchBar from './components/SearchBar';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 10px;
  
  span {
    background-color: #4CAF50;
    color: white;
    border-radius: 50%;
    padding: 5px 8px;
    margin-right: 5px;
  }
`;

const MainTitle = styled.h1`
  color: #4CAF50;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  color: #555;
  font-weight: 500;
  font-size: 18px;
  margin-top: 0;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  flex: 1;
`;

// Footer Component
const Footer = styled.footer`
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FooterText = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const FooterLink = styled.a`
  color: #4CAF50;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  const [showMedicineStore, setShowMedicineStore] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [showFullChat, setShowFullChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const handleMedicineSelect = (medications) => {
    setSelectedMedications(medications);
    setShowMedicineStore(true);
    setShowFullChat(false);
    setShowSearch(false);
  };
  
  const handleBackToChat = () => {
    setShowMedicineStore(false);
    setShowFullChat(true);
    setShowSearch(false);
  };
  
  const handleOpenFullChat = () => {
    setShowFullChat(true);
    setShowMedicineStore(false);
    setShowSearch(false);
  };
  
  const handleOpenSearch = () => {
    setShowSearch(true);
    setShowFullChat(false);
    setShowMedicineStore(false);
  };
  
  return (
    <AppContainer>
      <Header>
        <Logo>
          <span>🐾</span> PetCarePal
        </Logo>
        <MainTitle>Pet Health Assistant</MainTitle>
        <Subtitle>AI-Powered Skin Disease Recognition & Treatment System</Subtitle>
        
        <HeaderNav>
          <NavLink 
            active={!showFullChat && !showMedicineStore && !showSearch} 
            onClick={() => {
              setShowFullChat(false);
              setShowMedicineStore(false);
              setShowSearch(false);
            }}
          >
            Home
          </NavLink>
          <NavLink 
            active={showFullChat} 
            onClick={handleOpenFullChat}
          >
            Chat Assistant
          </NavLink>
          <NavLink 
            active={showSearch} 
            onClick={handleOpenSearch}
          >
            Knowledge Search
          </NavLink>
        </HeaderNav>
      </Header>
      
      <MainContent>
        {showMedicineStore ? (
          <MedicineStore 
            medications={selectedMedications}
            onBackToChat={handleBackToChat}
          />
        ) : showFullChat ? (
          <ChatBot onMedicineSelect={handleMedicineSelect} />
        ) : showSearch ? (
          <SearchBar />
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Welcome to PetCarePal</h2>
            <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px', color: '#555' }}>
              Get expert guidance for your pet's skin conditions and find the right medications with our AI assistant.
            </p>
            <ButtonGroup>
              <ActionButton onClick={handleOpenFullChat}>
                Chat with Assistant
              </ActionButton>
              <ActionButton onClick={handleOpenSearch}>
                Search Pet Health Knowledge
              </ActionButton>
            </ButtonGroup>
          </div>
        )}
      </MainContent>
      
      <Footer>
        <FooterLinks>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
        <FooterText>© 2023 PetCarePal. All rights reserved.</FooterText>
      </Footer>
      
      {!showFullChat && !showSearch && <FooterChatWidget onOpenFullChat={handleOpenFullChat} />}
    </AppContainer>
  );
}

// New styled components for updated UI
const HeaderNav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 20px;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#4CAF50' : '#777'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#4CAF50' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: #4CAF50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  font-size: 16px;
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  }
`;

export default App; 