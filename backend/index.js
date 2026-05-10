import express from "express";
import cors from "cors";
import { apiController } from "./controller/api.router.js";

const app = express();
app.use(cors());

//middleware
app.use(express.json());

//serve 
app.use('/seed-assets', express.static('public/seed-assets'));
app.use('/uploads', express.static('public/uploads'));
//route
apiController(app);

//local tests
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
