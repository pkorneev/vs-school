import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LessonFile } from "./LessonFile";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "timestamp" })
  deadline: Date;

  @Column({ type: "int", nullable: true })
  points: number | null;

  @Column({ type: "text", nullable: true })
  comment: string | null;

  @Column()
  status: string;

  @OneToMany(() => LessonFile, (file) => file.lesson, {
    cascade: true,
    eager: true,
  })
  files: LessonFile[];
}
