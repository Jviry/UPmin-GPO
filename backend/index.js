import express from "express";

const app = express();

//middleware
app.use(express.json);

//route
apiController(app);

//local tests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
