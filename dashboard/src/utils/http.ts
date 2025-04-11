import { API_BASE_URL } from "../consts/consts";

export const fetchUserData = async (token: string) => {
  if (!token) {
    throw new Error("Token not found");
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};

export const fetchLessons = async (token: string) => {
  if (!token) {
    throw new Error("Token not found");
  }

  const response = await fetch(`${API_BASE_URL}/allLessons`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};

export const fetchLessonById = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/allLessons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lesson");
  }
  const data = await response.json();
  return data;
};

export const handleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/react`;
};
