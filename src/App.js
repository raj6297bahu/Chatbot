import React, { useState } from 'react';
import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import ChatBot from './components/ChatBot';
import FooterChatWidget from './components/FooterChatWidget';
import MedicineStore from './components/MedicineStore';
import LandingPage from './LandingPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const Header = styled.header`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin: 20px;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  
  span {
    margin-right: 8px;
  }
`;

const MainTitle = styled.h1`
  color: #333;
  margin: 10px 0 5px;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 20px;
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

// ChatBot Page Component
const ChatBotPage = ({ onMedicineSelect }) => {
  return (
    <AppContainer>
      <Header>
        <Logo>
          <span>🐾</span> PetCarePal
        </Logo>
        <MainTitle>Pet Health Assistant</MainTitle>
        <Subtitle>AI-Powered Skin Disease Recognition & Treatment System</Subtitle>
      </Header>
      
      <MainContent>
        <ChatBot onMedicineSelect={onMedicineSelect} />
      </MainContent>
      
      <Footer>
        <FooterLinks>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
        <FooterText>© 2023 PetCarePal. All rights reserved.</FooterText>
      </Footer>
    </AppContainer>
  );
};

function App() {
  const [showMedicineStore, setShowMedicineStore] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);
  
  const handleMedicineSelect = (medications) => {
    setSelectedMedications(medications);
    setShowMedicineStore(true);
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/chatbot" 
          element={
            showMedicineStore ? (
              <MedicineStore 
                medications={selectedMedications}
                onBackToChat={() => setShowMedicineStore(false)}
              />
            ) : (
              <ChatBotPage onMedicineSelect={handleMedicineSelect} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FooterChatWidget onOpenFullChat={() => window.location.href = '/chatbot'} />
    </Router>
  );
}

export default App; 