import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { sendChatMessage } from '../api/chatbotApi';

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 15px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SearchHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const SearchTitle = styled.h3`
  color: #4CAF50;
  margin-bottom: 8px;
`;

const SearchSubtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const SearchForm = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const SearchButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3d8b40;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ResultTitle = styled.h4`
  color: #4CAF50;
  margin-top: 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
`;

const ResultContent = styled.div`
  font-size: 14px;
  color: #333;
  
  h1, h2, h3, h4, h5, h6 {
    color: #4CAF50;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 15px;
    line-height: 1.5;
  }
  
  ul, ol {
    margin-bottom: 15px;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 5px;
  }
  
  strong, b {
    color: #3d8b40;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  
  .dots {
    display: inline-flex;
    align-items: center;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
    margin: 0 3px;
    animation: pulse 1.5s infinite;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.3s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.6s;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
`;

const QuickQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const QuickQuestion = styled.button`
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #666;
  font-style: italic;
`;

const RelatedQuestions = styled.div`
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
`;

const RelatedQuestionsTitle = styled.h5`
  color: #4CAF50;
  margin-bottom: 10px;
`;

const RelatedQuestion = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  text-align: left;
  padding: 5px 0;
  cursor: pointer;
  font-size: 14px;
  display: block;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MarkdownRenderer = ({ content }) => {
  // Simple markdown parser for our needs
  const formatMarkdown = (text) => {
    if (!text) return '';
    
    // Convert markdown headings to HTML
    let html = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold/strong
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
    
    // Convert italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
    
    // Convert lists
    html = html.replace(/^\s*\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\s*- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\s*\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    
    // Fix multiple ul tags
    html = html.replace(/<\/ul>\s*<ul>/gim, '');
    
    // Convert line breaks
    html = html.replace(/\n/gim, '<br />');
    
    return html;
  };
  
  return <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />;
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const quickQuestions = [
    "What are common symptoms of dog allergies?",
    "How to treat ringworm in cats?",
    "Is mange contagious to humans?",
    "Best home remedies for hotspots",
    "When to see a vet for skin issues?"
  ];
  
  // Generate related questions when search result changes
  useEffect(() => {
    if (searchResult && query) {
      generateRelatedQuestions(query);
    }
  }, [searchResult]);
  
  const generateRelatedQuestions = async (originalQuery) => {
    try {
      const response = await sendChatMessage([
        { 
          role: 'system', 
          content: `You are an AI assistant that generates related questions based on a user's original question about pet skin conditions. Generate 3-5 related follow-up questions that users might want to know about. Return ONLY the questions, one per line, with no additional text or formatting.` 
        },
        { role: 'user', content: `Original question: "${originalQuery}". Generate related questions about pet skin conditions.` }
      ]);
      
      // Split the content into an array of questions
      const questions = response.content
        .split('\n')
        .filter(q => q.trim())
        .slice(0, 5); // Limit to 5 questions
      
      setRelatedQuestions(questions);
    } catch (error) {
      console.error('Error generating related questions:', error);
      setRelatedQuestions([]);
    }
  };
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      const systemPrompt = `You are a veterinary knowledge assistant specializing in pet skin conditions. 
      Provide detailed, accurate information about pet skin diseases, symptoms, treatments, and care advice.
      Format your response using markdown with clear headings for each section (## for main sections).
      If the question is not related to pet skin health, politely redirect to pet skin topics.
      Include scientifically accurate information and mention when veterinary consultation is necessary.
      Structure your response with these sections when applicable:
      1. Brief explanation of the condition
      2. Common symptoms
      3. Causes and risk factors
      4. Treatment options
      5. Home care tips
      6. When to seek veterinary care`;
      
      const response = await sendChatMessage([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `I have a question about pet skin conditions: ${query}` }
      ]);
      
      setSearchResult(response.content);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResult('Sorry, I encountered an error retrieving information. Please try again later.');
    }
    
    setIsLoading(false);
  };
  
  const handleQuickQuestion = (question) => {
    setQuery(question);
    // Use setTimeout to ensure the state is updated before handleSearch executes
    setTimeout(() => handleSearch(), 0);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Pet Health Knowledge Search</SearchTitle>
        <SearchSubtitle>Ask any question about pet skin conditions and treatments</SearchSubtitle>
      </SearchHeader>
      
      <QuickQuestions>
        {quickQuestions.map((question, index) => (
          <QuickQuestion
            key={index}
            onClick={() => handleQuickQuestion(question)}
          >
            {question}
          </QuickQuestion>
        ))}
      </QuickQuestions>
      
      <SearchForm>
        <SearchInput
          type="text"
          placeholder="E.g., What causes hotspots in dogs?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
        >
          Search
        </SearchButton>
      </SearchForm>
      
      {isLoading && (
        <LoadingIndicator>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </LoadingIndicator>
      )}
      
      {searchPerformed && !isLoading && (
        searchResult ? (
          <ResultContainer>
            <ResultTitle>Search Results</ResultTitle>
            <ResultContent>
              <MarkdownRenderer content={searchResult} />
            </ResultContent>
            
            {relatedQuestions.length > 0 && (
              <RelatedQuestions>
                <RelatedQuestionsTitle>Related Questions</RelatedQuestionsTitle>
                {relatedQuestions.map((question, index) => (
                  <RelatedQuestion 
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </RelatedQuestion>
                ))}
              </RelatedQuestions>
            )}
          </ResultContainer>
        ) : (
          <NoResults>No information found. Please try a different search term.</NoResults>
        )
      )}
    </SearchContainer>
  );
};

export default SearchBar; 