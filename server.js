const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/v1/simulations", (req, res) => {
  res.json({
    resumo_final: {
      cenario_escolhido: req.body.cenarioEscolha || "investir"
    },
    detalhes_mes_a_mes: []
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
