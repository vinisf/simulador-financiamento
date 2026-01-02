/**
 * Motor de simulação financeira (v0)
 * Responsável apenas por cálculos iniciais e validação básica
 */

/**
 * @param {import("./domain/types").FinancingInput} input
 */
function simulateFinancing(input) {
  const precoVenda = Number(input.precoVenda) || 0;
  const financiamentoSubsidio = Number(input.financiamentoSubsidio) || 0;

  const entradaCalculada = precoVenda - financiamentoSubsidio;

  return {
    resumo_final: {
      entrada_calculada: entradaCalculada,
      cenario_escolhido: input.cenarioEscolha || "investir"
    },
    detalhes_mes_a_mes: []
  };
}

module.exports = {
  simulateFinancing
};
