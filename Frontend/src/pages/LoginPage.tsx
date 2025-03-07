import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

interface LoginPageProps {
  // Optional: Falls du den Login-Callback auch von oben erhältst
  onLogin?: (token: string, user: { username: string; email: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // State for input fields and error messages
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Input validation
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setError(null);

    try {
      const result = await loginUser(username, password);
      localStorage.setItem('token', result.token);
      if (onLogin) {
        onLogin(result.token, result.user);
      }

      navigate('/dashboard', );
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
      >
        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Typography component="h1" variant="h5" textAlign="center" mb={2}>
                Sign In
              </Typography>

              {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ py: 1.5 }}>
                  Sign In
                </Button>


                <Stack direction="column" justifyContent="center">
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                  <Link component={RouterLink} to="/register" variant="body2">
                    Create an account
                  </Link>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
  );
};

export default LoginPage;
