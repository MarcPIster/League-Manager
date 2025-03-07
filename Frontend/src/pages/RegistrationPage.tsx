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
import { registerUser } from '../services/authService';

const RegistrationPage: React.FC = () => {
  // States for input fields and messages
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const result = await registerUser(username, email, password);

      setSuccess(result.message);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5" textAlign="center" mb={2}>
              Register
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
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
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ py: 1.5 }}>
                Register
              </Button>

              <Stack direction="column" justifyContent="center">
                <Link component={RouterLink} to="/" variant="body2">
                  Already have an account? Sign in here!
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
  );
};

export default RegistrationPage;
