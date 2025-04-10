import "reflect-metadata";
import { DataSource } from "typeorm";
import { Lesson } from "./entities/Lesson";
import { LessonFile as File } from "./entities/LessonFile";
import { getLessonsResponse } from "./mock/getAllLessons";
import { join } from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  database: "vsschool",
  username: "postgres",
  password: "postgress",
  synchronize: true,
  logging: false,
  entities: [join(__dirname, "./entities/*.*")],
});

const seed = async () => {
  await AppDataSource.initialize();

  // Truncate both tables using CASCADE
  await AppDataSource.getRepository(File).query(
    'TRUNCATE TABLE "lesson_file" CASCADE'
  );
  await AppDataSource.getRepository(Lesson).query(
    'TRUNCATE TABLE "lesson" CASCADE'
  );

  for (const lesson of getLessonsResponse) {
    const newLesson = new Lesson();
    newLesson.title = lesson.title;
    newLesson.deadline = new Date(lesson.deadline);
    newLesson.points = lesson.points;
    newLesson.comment = lesson.comment;
    newLesson.status = lesson.status;
    newLesson.files = lesson.files.map((f) => {
      const file = new File();
      file.name = f.name;
      file.path = f.path;
      file.content = f.content;
      return file;
    });

    await AppDataSource.getRepository(Lesson).save(newLesson);
  }

  console.log("Mock data seeded to the DB");
  process.exit();
};

seed();
