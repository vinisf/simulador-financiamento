/**
 * @typedef FinancingInput
 * @property {number} precoVenda
 * @property {number} financiamentoSubsidio
 * @property {number} valorAto
 * @property {number} valorAnuais
 * @property {number} valorChave
 * @property {number} numParcelasConstrutora
 * @property {number} itbiCartorio
 * @property {number} aberturaConta
 * @property {number} parcelaCaixaBase
 * @property {number} mesesSeguroObraCrescendo
 * @property {number} taxaInccMensalPercentual
 * @property {number} taxaCondominioMensal
 * @property {number} valorInvestimentoInicial
 * @property {"investir"|"ato"} cenarioEscolha
 */

/**
 * @typedef MesSimulacao
 * @property {number} Mes
 * @property {number} ["Despesas Mês 0"]
 * @property {number} ["Parcela Imovel (Base)"]
 * @property {number} ["Parcela ITBI/Cartorio (Base)"]
 * @property {number} ["INCC (Correção Saldo)"]
 * @property {number} ["Parcela Construtora (Com INCC)"]
 * @property {number} ["Seguro de Obra"]
 * @property {number} Anuais
 * @property {number} Chave
 * @property {number} ["Parcela Caixa"]
 * @property {number} Condominio
 * @property {number} ["Total Mes"]
 * @property {number} ["Valor Investimento Antes"]
 * @property {number} ["Rendimento Investimento"]
 * @property {number} ["Valor Sacado Investimento"]
 * @property {number} ["Valor Investimento Depois"]
 * @property {string} Observacao
 */

/**
 * @typedef SimulationResult
 * @property {Object} resumo_final
 * @property {MesSimulacao[]} detalhes_mes_a_mes
 */
