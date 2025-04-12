import { API_BASE_URL } from "../consts/consts";
import { FormData } from "../pages/dashboard/form/FormContainer";
import { Lesson } from "../store/store";

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

export const updateLesson = async (
  id: number,
  updatedLesson: Lesson,
  token: string
) => {
  const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedLesson),
  });

  if (!res.ok) {
    throw new Error("Failed to update lesson");
  }

  return res.json();
};

export const createLesson = async (formData: FormData, token: string) => {
  const res = await fetch(`${API_BASE_URL}/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Failed to create lesson");
  }

  return res.json();
};

export const handleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/react`;
};
