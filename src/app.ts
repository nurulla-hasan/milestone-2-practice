import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./module/users/user.route";
import { profileRoute } from "./module/profile/profile.route";
import { authRoute } from "./module/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);



export default app;
