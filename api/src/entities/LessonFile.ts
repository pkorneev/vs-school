import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Lesson } from "./Lesson";

@Entity()
export class LessonFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column("text")
  content: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.files, { onDelete: "CASCADE" })
  lesson: Lesson;
}
