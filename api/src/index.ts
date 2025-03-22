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
import { getLessonsResponse } from "./mock/getAllLessons";
import { getUserLessonsResponse } from "./mock/getUserLessons";

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
    passport.authenticate("oauth2", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:55331/auth/${req.user.accessToken}`);
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
