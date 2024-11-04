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
  title: string;
  files: File[];
};

export type MyLesson = Lesson & {
  points: number;
  comment: string;
};

export type Lessons = Lesson[];

export type MyLessons = MyLessons[];
