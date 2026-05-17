import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./module/users/user.route";

const app: Application = express();

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});


app.use('/api/users', userRoute)




export default app;