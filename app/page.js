"use client"
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
const backgroundImage = '/Chatbox.jpg';



export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    setMessage('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);

        return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }];
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage();
    }
  };

  return (

    
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      sx={{
        background: 'linear-gradient(135deg, #d3cce3, #e9e4f0)',
        backgroundSize: '200% 200%',
        animation: 'gradientAnimation 10s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      }}
    >
      <Stack
        direction="column"
        width={{ xs: '90%', sm: '80%', md: '70%' }}
        height="80%"
        borderRadius={4}
        border="1px solid #ddd"
        boxShadow={3}
        overflow="hidden"
        sx={{
          backgroundColor: '#ffffffee', 
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          p={3}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0 0 16px 16px',
            boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
              borderRadius: '0 0 16px 16px',
              zIndex: 1,
            },
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            p={3}
            sx={{ position: 'relative', zIndex: 2 }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? "flex-start" : "flex-end"}
                p={1}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                  color="white"
                  borderRadius="16px"
                  p={2}
                  maxWidth="80%"
                  wordbreak="break-word"
                  sx={{
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      width: 0,
                      height: 0,
                      border: '10px solid transparent',
                      borderLeftColor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                      borderRight: 'none',
                      borderTop: 'none',
                      marginTop: '-10px',
                      marginLeft: '-10px',
                      transform: 'translateY(-50%)',
                      [message.role === 'assistant' ? 'left' : 'right']: '-10px',
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          p={2}
          borderTop="1px solid #ddd"
          bgcolor="#fff"
          alignItems="center"
        >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
            onKeyDown={handleKeyDown}
            sx={{ borderRadius: 2, marginRight: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={!message.trim()}
            sx={{ borderRadius: 2 }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
