import { LoginResponse, User, UserCreatePayload } from "@/types/auth";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:18080";

const TOKEN_KEY = "sepsis_cdss_access_token";
const USER_KEY = "sepsis_cdss_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem(USER_KEY);

  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function saveAuthSession(loginResponse: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, loginResponse.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function loginUser(payload: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  return response.json();
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Current user request failed: ${errorText}`);
  }

  return response.json();
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Users request failed: ${errorText}`);
  }

  return response.json();
}

export async function createUser(
  payload: UserCreatePayload
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Create user request failed: ${errorText}`);
  }

  return response.json();
}