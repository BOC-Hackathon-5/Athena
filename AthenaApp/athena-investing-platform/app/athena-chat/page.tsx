// app/athena-chat/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const AthenaChat: React.FC = () => {
  const [messages, setMessages] = useState<(string | JSX.Element)[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, `You: ${input}`]);
      setIsLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: input })
        });

        const data = await response.json();

        // Format the response to add better readability with line breaks
        const formattedResponse = data.response.split('\n').map((line, index) => (
          <span key={index} style={line.includes("**") ? styles.boldText : {}}>
            {line}
            <br />
          </span>
        ));

        setMessages((prevMessages) => [...prevMessages, (
          <div style={styles.athenaMessageContainer}>
            <p style={styles.messageText}>
              {formattedResponse}
            </p>
          </div>
        )]);
      } catch (error) {
        console.error('Error communicating with the chat API:', error);
        setMessages((prevMessages) => [...prevMessages, "Athena: Sorry, there was an error."]);
      } finally {
        setIsLoading(false);
      }

      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <h1 style={styles.title}>ATHENA CHAT</h1>
        <Link href="/" passHref>
          <button style={styles.backButton} title="Go back to Portfolio">
            &lt;
          </button>
        </Link>
      </div>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => {
          const isUserMessage = typeof msg === 'string' && msg.startsWith("You:");
          return (
            <div
              key={index}
              style={isUserMessage ? styles.userMessageContainer : styles.athenaMessageContainer}
            >
              <strong style={isUserMessage ? styles.userLabel : styles.athenaLabel}>
                {isUserMessage ? "You" : "Athena"}
              </strong>
              <p style={styles.messageText}>
                {typeof msg === 'string' ? msg.replace("You: ", "").replace("Athena: ", "") : msg}
              </p>
            </div>
          );
        })}
        {isLoading && (
          <div style={styles.loadingContainer}>
            <span style={styles.typingDot}></span>
            <span style={styles.typingDot}></span>
            <span style={styles.typingDot}></span>
          </div>
        )}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100vh',
    padding: '10px 20px',
    backgroundColor: '#f4f4f9',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundImage: 'linear-gradient(to bottom right, #ffffff, #d4e4fc)',
  },
  chatHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.1)',
    marginBottom: '15px',
    height: '80px',
    position: 'relative',
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold' as const,
    color: '#5468ff',
    textShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    letterSpacing: '1px',
    backgroundImage: 'linear-gradient(to right, #5adaff, #5468ff)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  backButton: {
    padding: '5px 10px',
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'box-shadow .15s, transform .15s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
  },
  chatBox: {
    width: '100%',
    maxWidth: '550px',
    height: '700px',
    overflowY: 'auto' as const,
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
  },
  userMessageContainer: {
    backgroundColor: '#e6f7ff',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  athenaMessageContainer: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '10px',
    margin: '5px 0',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userLabel: {
    color: '#0056b3',
    fontWeight: 'bold' as const,
    marginBottom: '5px',
  },
  athenaLabel: {
    color: '#333',
    fontWeight: 'bold' as const,
    marginBottom: '5px',
  },
  messageText: {
    fontSize: '1em',
    color: '#333',
    margin: 0,
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '550px',
    marginTop: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px 0 0 5px',
    fontSize: '1em',
    color: '#333',
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'box-shadow .15s, transform .15s',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    margin: '0.3px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    display: 'inline-block',
  },
  boldText: {
    fontWeight: 'bold' as const,
    color: '#007bff',
  },
};

export default AthenaChat;

