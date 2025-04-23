import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Hero = styled.div`
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  text-align: center;
  padding: 100px 20px;
  border-radius: 10px;
  margin-bottom: 40px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ServiceCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

const ChatbotButton = styled(Link)`
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  padding: 12px 24px;
  font-size: 16px;
  margin-top: 20px;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  
  span {
    margin-right: 8px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #4CAF50;
  }
`;

function LandingPage() {
  return (
    <LandingContainer>
      <NavBar>
        <Logo>
          <span>🐾</span> PetCarePal
        </Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/chatbot" className="highlight">Pet Health Assistant</NavLink>
        </NavLinks>
      </NavBar>
      
      <Hero>
        <h1>Welcome to PetCarePal</h1>
        <p>Your one-stop solution for all your pet's healthcare needs</p>
        <ChatbotButton to="/chatbot">
          Try Our AI Pet Health Assistant
        </ChatbotButton>
      </Hero>
      
      <Section>
        <h2>Our Services</h2>
        <ServicesGrid>
          <ServiceCard>
            <h3>AI Skin Disease Detection</h3>
            <p>Upload a photo of your pet's skin condition and get an instant AI-powered diagnosis</p>
            <ChatbotButton to="/chatbot">
              Start Diagnosis
            </ChatbotButton>
          </ServiceCard>
          
          <ServiceCard>
            <h3>Medication Delivery</h3>
            <p>Get pet medications delivered right to your doorstep with our easy ordering system</p>
            <Button>Learn More</Button>
          </ServiceCard>
          
          <ServiceCard>
            <h3>Vet Consultations</h3>
            <p>Connect with licensed veterinarians for professional advice on your pet's health</p>
            <Button>Book Now</Button>
          </ServiceCard>
        </ServicesGrid>
      </Section>
      
      <Section>
        <h2>Why Choose PetCarePal?</h2>
        <p>PetCarePal combines cutting-edge AI technology with veterinary expertise to provide the best care for your furry friends. Our AI assistant can help identify common skin conditions and recommend appropriate treatments, saving you time and worry.</p>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <ChatbotButton to="/chatbot">
            Chat with Our Pet Health Assistant Now
          </ChatbotButton>
        </div>
      </Section>
    </LandingContainer>
  );
}

export default LandingPage; 