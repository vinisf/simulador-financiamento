/**
 * Motor de simulação financeira (v2)
 * Inclui o Mês 0 na simulação
 */

/**
 * @param {import("./domain/types").FinancingInput} input
 */
function simulateFinancing(input) {
  const precoVenda = Number(input.precoVenda) || 0;
  const financiamentoSubsidio = Number(input.financiamentoSubsidio) || 0;
  const valorAto = Number(input.valorAto) || 0;
  const aberturaConta = Number(input.aberturaConta) || 0;

  const entradaCalculada = precoVenda - financiamentoSubsidio;
  const saldoBaseImovel = entradaCalculada - valorAto;

  const mesZero = {
    Mes: 0,
    "Despesas Mês 0": valorAto + aberturaConta,
    "Parcela Imovel (Base)": 0,
    "Parcela ITBI/Cartorio (Base)": 0,
    "INCC (Correção Saldo)": 0,
    "Parcela Construtora (Com INCC)": 0,
    "Seguro de Obra": 0,
    Anuais: 0,
    Chave: 0,
    "Parcela Caixa": 0,
    Condominio: 0,
    "Total Mes": valorAto + aberturaConta,
    "Valor Investimento Antes": 0,
    "Rendimento Investimento": 0,
    "Valor Sacado Investimento": 0,
    "Valor Investimento Depois": 0,
    Observacao: "Despesas iniciais (ATO + Abertura de Conta)"
  };

  return {
    resumo_final: {
      entrada_calculada: entradaCalculada,
      saldo_base_imovel: saldoBaseImovel,
      total_financiado: financiamentoSubsidio,
      cenario_escolhido: input.cenarioEscolha || "investir"
    },
    detalhes_mes_a_mes: [mesZero]
  };
}

module.exports = {
  simulateFinancing
};
