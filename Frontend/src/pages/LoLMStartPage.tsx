// src/components/LolManagerPage.tsx
import React from 'react';
import {
  Typography,
  Container,
  Box,
} from '@mui/material';
import Header from '../components/Header';

interface LolManagerPageProps {
  username: string;
  onLogout: () => void;
}

const LolManagerPage: React.FC<LolManagerPageProps> = ({ username, onLogout }) => {

  return (
      <Box>
        {/* Header */}
       <Header onLogout={onLogout}></Header>

        {/* Main Content */}
        <Container sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {username}!
          </Typography>
          {/* Hier kannst du weitere Inhalte hinzufügen */}
        </Container>
      </Box>
  );
};

export default LolManagerPage;
