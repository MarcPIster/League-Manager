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
import { Link as RouterLink } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  // State for email input and feedback messages
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError(null);
    // Simulate password reset process
    setMessage('Password reset instructions have been sent to your email.');
    // In a real application, perform an API call here.
  };

  return (
      <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
  <Typography component="h1" variant="h5" textAlign="center" mb={2}>
      Forgot Password
  </Typography>

  {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
    {error}
    </Alert>
  )}

  {message && (
      <Alert severity="success" sx={{ mb: 2 }}>
    {message}
    </Alert>
  )}

  <Stack spacing={2}>
      <TextField
          required
  fullWidth
  id="email"
  label="Email Address"
  name="email"
  type="email"
  autoComplete="email"
  autoFocus
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  />

  <Button type="submit" fullWidth variant="contained" color="primary" sx={{ py: 1.5 }}>
  Reset Password
  </Button>

  <Stack direction="row" justifyContent="center">
  <Link component={RouterLink} to="/" variant="body2">
      Back to Sign In
  </Link>
  </Stack>
  </Stack>
  </Box>
  </Paper>
  </Container>
);
};

export default ForgotPasswordPage;
