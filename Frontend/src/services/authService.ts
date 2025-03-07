export interface LoginResponse {
  message: string;
  token: string;
  user: { username: string; email: string };
}

const URL = import.meta.env.VITE_API_URL as string;

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: { username: string; email: string };
}

export async function registerUser(username: string, email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}
