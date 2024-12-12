import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [articles, setArticles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('/content.json')
      .then(response => response.json())
      .then(data => {
        setArticles(data);
        console.log('Articles loaded:', data.length);
      })
      .catch(error => console.error('Error loading content:', error));
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const question = inputValue.toLowerCase();
    setMessages(prev => [...prev, { type: 'user', content: question }]);
    setInputValue('');

    const relevantArticles = articles.filter(article => 
      article.content.toLowerCase().includes(question) ||
      article.title.toLowerCase().includes(question)
    );

    if (relevantArticles.length > 0) {
      const response = "I found these relevant articles:";
      const links = relevantArticles.map(article => ({ title: article.title, url: article.url }));
      setMessages(prev => [...prev, { type: 'bot', content: response, links: links }]);
    } else {
      setMessages(prev => [...prev, { type: 'bot', content: "I'm sorry, I couldn't find any articles related to your question." }]);
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return <p><strong>You:</strong> {message.content}</p>;
    } else {
      return (
        <div>
          <p><strong>Bot:</strong> {message.content}</p>
          {message.links && (
            <ul>
              {message.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <div className={styles.chatbotToggle} onClick={toggleChatbot}>
        Ask chatbot
      </div>
      {isOpen && (
        <div className={styles.chatbot}>
          <div className={styles.chatbotHeader}>
            <span>Chatbot</span>
            <button className={styles.chatbotClose} onClick={toggleChatbot}>×</button>
          </div>
          <div className={styles.chatMessages}>
            {messages.map((message, index) => (
              <div key={index}>{renderMessage(message)}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.chatInputArea} onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              className={styles.userInput}
            />
            <button type="submit" className={styles.askButton}>Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;