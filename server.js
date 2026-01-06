const express = require("express");
const path = require("path");
const cors = require("cors");
const { simulateFinancing } = require("./src/simulate");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/v1/simulations", (req, res) => {
  const result = simulateFinancing(req.body);
  res.json(result);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
