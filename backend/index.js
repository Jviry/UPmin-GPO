import express from "express";
import cors from "cors";
import { apiController } from "./controller/api.router.js";

const app = express();
app.use(cors());

//middleware
app.use(express.json());

//route
apiController(app);

//local tests
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
