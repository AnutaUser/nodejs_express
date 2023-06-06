import express, { Request, Response } from "express";

import { configs } from "./configs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req: Request, res: Response) => {
  // const users = await fileService.reader();
  res.json("users");
});

app.listen(configs.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`started on PORT: ${configs.PORT} 😉`);
});
