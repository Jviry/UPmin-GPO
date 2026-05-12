import express from "express";
import cors from "cors";
import { apiController } from "./controller/api.router.js";
import { prisma } from "./db/db.js";

const app = express();
app.use(cors());

//middleware
app.use(express.json());

//serve
app.use('/seed-assets', express.static('public/seed-assets'));
app.use('/uploads', express.static('public/uploads'));
//route
apiController(app);

const PORT = 3001;
prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
