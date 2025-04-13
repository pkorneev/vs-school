import { atom } from "jotai";
import { notification } from "antd";

export type User = {
  id: number;
  name: string;
  googleId: string;
};
export type File = {
  name: string;
  path: string;
  content: string;
};
export type Status = "TO_DO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";
export type Lesson = {
  id: number;
  deadline: string;
  title: string;
  files: File[];
  status?: Status;
  points?: number;
  comment?: string;
};
export const userAtom = atom<User | null>(null);
export const nameAtom = atom((get) => {
  const user = get(userAtom);
  return user?.name ?? null;
});
export const lessonsAtom = atom<Lesson[]>([]);
export const lessonAtom = atom<Lesson | null>(null);
export const lessonLoadingAtom = atom<boolean>(false);
export const tokenAtom = atom<string | null>(localStorage.getItem("authToken"));

export const setTokenAtom = atom(null, (get, set, newToken: string | null) => {
  set(tokenAtom, newToken);
  if (newToken) {
    localStorage.setItem("authToken", newToken);
  } else {
    localStorage.removeItem("authToken");
  }
});

type NotificationType = "success" | "info" | "warning" | "error";

export const notificationApiAtom = atom<
  ReturnType<typeof notification.useNotification>[0] | null
>(null);

export const notifyAtom = atom(
  null,
  (
    get,
    _set,
    { type, description }: { type: NotificationType; description: string }
  ) => {
    const api = get(notificationApiAtom);
    if (api) {
      api[type]({
        message: "Notification Title",
        duration: 2.5,
        description,
      });
    }
  }
);
