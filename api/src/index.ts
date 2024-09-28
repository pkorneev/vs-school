import express from "express";

const main = async () => {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("dqwqwdqwddqwqwddqw");
  });
  app.listen(3003, () => {
    console.log("Listening on localhost:3003");
  });
};

main();
