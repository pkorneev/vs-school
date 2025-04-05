export type User = {
  name: string;
  id: string;
  googleId: string;
};

export type File = {
  name: string;
  path: string;
  content: string;
};

export type Lesson = {
  id: number;
  deadline: "string";
  title: string;
  files: File[];
};

export type Status = "TO_DO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";

export type MyLesson = Lesson & {
  status?: Status;
  points?: number;
  comment?: string;
};

export type Lessons = Lesson[];

export type MyLessons = MyLesson[];
