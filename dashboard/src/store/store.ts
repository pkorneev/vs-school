// src/store.ts
import { atom } from "jotai";

type User = {
  id: number;
  name: string;
  googleId: string;
};
export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);
