const express = require("express");
const path = require("path");
const { simulateFinancing } = require("./src/simulate");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/v1/simulations", (req, res) => {
  const result = simulateFinancing(req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
