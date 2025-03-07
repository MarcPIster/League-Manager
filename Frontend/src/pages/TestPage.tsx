// src/components/DashboardPage.tsx
import React from 'react';
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';

interface DashboardPageProps {
  // The username to display in the welcome message
  username: string;
  // Callback function to handle user logout
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ username, onLogout }) => {
  return (
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
      >
        <Container maxWidth="md">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Welcome, {username}!
            </Typography>
            <Typography variant="body1" textAlign="center" gutterBottom>
              You are now logged in.
            </Typography>
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={onLogout}>
                Logout
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
  );
};

export default DashboardPage;