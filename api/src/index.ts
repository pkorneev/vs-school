require("dotenv-safe").config();
import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { __prod__ } from "./const";
import { join } from "path";
import OAuth2Strategy from "passport-oauth2";
import passport from "passport";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Lesson } from "./entities/Lesson";

const AUTH_BASE_URL = process.env.AUTH_BASE_URL!;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const CALLBACK_URL = process.env.CALLBACK_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

const main = async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    database: "vsschool",
    username: "postgres",
    password: "postgress",
    entities: [join(__dirname, "./entities/*.*")],
    logging: !__prod__,
    synchronize: !__prod__,
  });

  await AppDataSource.initialize();

  const app = express();

  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });

  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());

  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: `${AUTH_BASE_URL}/authorize/`,
        tokenURL: `${AUTH_BASE_URL}/token/`,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (accessToken, _refreshToken, profile, cb) => {
        try {
          const userInfo = {
            sub: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
          };

          let user = await User.findOne({
            where: { universityId: userInfo.sub },
          });

          if (user) {
            user.name = profile.displayName;
            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName,
              googleId: profile.id,
            }).save();
          }

          cb(null, {
            accessToken: jwt.sign({ userId: user.id }, JWT_SECRET, {
              expiresIn: "1y",
            }),
          });
        } catch (error) {
          cb(error);
        }
      }
    )
  );

  app.get("/auth/university", passport.authenticate("oauth2"));

  app.get(
    "/auth/university/callback",
    passport.authenticate("oauth2", {
      session: false,
      failureRedirect: "http://localhost:55331/auth-cancel",
    }),
    (req: any, res) => {
      const redirectUrl = `http://localhost:55331/auth/${req.user.accessToken}`;
      res.redirect(redirectUrl);
    }
  );

  app.get("/auth/react", (req, res, next) => {
    passport.authenticate("oauth2", {
      callbackURL: "http://localhost:3003/auth/react/callback",
      state: "react",
      session: false,
    })(req, res, next);
  });

  app.get(
    "/auth/react/callback",
    passport.authenticate("oauth2", {
      callbackURL: "http://localhost:3003/auth/react/callback",
      session: false,
      failureRedirect: "http://127.0.0.1:5173/auth-cancel",
    }),
    (req: any, res) => {
      const redirectUrl = `http://127.0.0.1:5173/auth/${req.user.accessToken}`;
      res.redirect(redirectUrl);
    }
  );

  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.send({ user: null });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.send({ user: null });
      return;
    }

    let userId: number | undefined;

    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({ user: null });
      return;
    }

    if (!userId) {
      res.send({ user: null });
      return;
    }
    const user = await User.findOne({ where: { id: userId } });
    res.send({ user });
  });

  app.get("/allLessons", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({});

    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      const lessons = await AppDataSource.getRepository(Lesson).find();
      res.json(lessons);
    } catch (err) {
      res.status(500).send({});
    }
  });

  app.put("/lessons/:id", express.json(), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({});

    try {
      const payload: any = jwt.verify(token, JWT_SECRET);

      const lessonRepo = AppDataSource.getRepository(Lesson);
      const lesson = await lessonRepo.findOne({
        where: { id: parseInt(req.params.id) },
      });

      if (!lesson) return res.status(404).json({ message: "Lesson not found" });

      // Directly update the lesson with the provided request body
      const updatedLesson = Object.assign(lesson, req.body);

      // If the deadline is provided, keep it as a string (ISO format)
      if (updatedLesson.deadline) {
        updatedLesson.deadline = updatedLesson.deadline;
      }

      await lessonRepo.save(updatedLesson);
      res.json(updatedLesson);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error updating lesson" });
    }
  });

  app.post("/upload", express.json(), (req, res) => {
    console.log("Received /upload POST request with data:", req.body);
    res.status(200).send({ message: "Upload successful" });
  });

  app.get("/", (_req, res) => {
    res.send("localhost:3003 backend");
  });

  app.listen(3003, () => {
    console.log("Listening on localhost:3003");
  });
};

main();
