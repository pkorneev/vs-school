require("dotenv-safe").config();
import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { __prod__ } from "./const";
import { join } from "path";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";
import cors from "cors";
import { getLessonsResponse } from "./mock/getAllLessons";
import { getUserLessonsResponse } from "./mock/getUserLessons";

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
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3003/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        let user = await User.findOne({ where: { googleId: profile.id } });

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
          accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1y",
          }),
        });
      }
    )
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"], session: false })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req: any, res) => {
      // Successful authentication.
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
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

  app.get("/allLessons", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.send({});
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.send({});
      return;
    }
    let userId: number | undefined;

    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({});
      return;
    }

    res.json(getLessonsResponse);
  });

  app.get("/myLessons", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.send({});
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.send({});
      return;
    }
    let userId: number | undefined;

    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({});
      return;
    }

    res.json(getUserLessonsResponse);
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
