import React from 'react';
import styled from 'styled-components';
import ChatBot from './components/ChatBot';

const PageContainer = styled.div`
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

const Footer = styled.footer`
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  margin: 30px 20px 20px;
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

const BackButton = styled.a`
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

const ChatbotPage = ({ mainSiteUrl = "/" }) => {
  
  const handleMedicineSelect = (medications) => {
    // You can handle medication selection here
    console.log("Selected medications:", medications);
  };
  
  return (
    <PageContainer>
      <Header>
        <Logo>
          <span>🐾</span> PetCarePal
        </Logo>
        <MainTitle>Pet Health Assistant</MainTitle>
        <Subtitle>AI-Powered Skin Disease Recognition & Treatment System</Subtitle>
        <BackButton href={mainSiteUrl}>Back to Main Site</BackButton>
      </Header>
      
      <MainContent>
        <ChatBot onMedicineSelect={handleMedicineSelect} />
      </MainContent>
      
      <Footer>
        <FooterText>© 2023 PetCarePal. All rights reserved.</FooterText>
      </Footer>
    </PageContainer>
  );
};

export default ChatbotPage; 