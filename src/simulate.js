/**
 * Motor de simulação financeira (v1)
 * Calcula resumo financeiro inicial
 */

/**
 * @param {import("./domain/types").FinancingInput} input
 */
function simulateFinancing(input) {
  const precoVenda = Number(input.precoVenda) || 0;
  const financiamentoSubsidio = Number(input.financiamentoSubsidio) || 0;
  const valorAto = Number(input.valorAto) || 0;

  const entradaCalculada = precoVenda - financiamentoSubsidio;

  const saldoBaseImovel = entradaCalculada - valorAto;

  return {
    resumo_final: {
      entrada_calculada: entradaCalculada,
      saldo_base_imovel: saldoBaseImovel,
      total_financiado: financiamentoSubsidio,
      cenario_escolhido: input.cenarioEscolha || "investir"
    },
    detalhes_mes_a_mes: []
  };
}

module.exports = {
  simulateFinancing
};
