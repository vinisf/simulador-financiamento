/**
 * Motor de simulação financeira (v3)
 * Adiciona loop mensal simples (sem INCC)
 */

/**
 * @param {import("./domain/types").FinancingInput} input
 */
function simulateFinancing(input) {
    const precoVenda = Number(input.precoVenda) || 0;
    const financiamentoSubsidio = Number(input.financiamentoSubsidio) || 0;
    const valorAto = Number(input.valorAto) || 0;
    const aberturaConta = Number(input.aberturaConta) || 0;
    const numParcelasConstrutora = Number(input.numParcelasConstrutora) || 0;

    const entradaCalculada = precoVenda - financiamentoSubsidio;
    const saldoBaseImovel = entradaCalculada - valorAto;

    const detalhes = [];

    // Mês 0
    detalhes.push({
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
    });

    // Parcela fixa da construtora (versão simples)
    const parcelaConstrutoraBase =
        numParcelasConstrutora > 0 ? saldoBaseImovel / numParcelasConstrutora : 0;

    let saldoDevedor = saldoBaseImovel;

    // Loop mensal (mês 1 em diante)
    for (let mes = 1; mes <= numParcelasConstrutora; mes++) {
        const parcelasRestantes = numParcelasConstrutora - (mes - 1);
        const parcelaAtual =
            parcelasRestantes > 0 ? saldoDevedor / parcelasRestantes : saldoDevedor;

        saldoDevedor -= parcelaAtual;

        detalhes.push({
            Mes: mes,
            "Despesas Mês 0": 0,
            "Parcela Imovel (Base)": parcelaAtual,
            "Parcela ITBI/Cartorio (Base)": 0,
            "INCC (Correção Saldo)": 0,
            "Parcela Construtora (Com INCC)": parcelaAtual,
            "Seguro de Obra": 0,
            Anuais: 0,
            Chave: 0,
            "Parcela Caixa": 0,
            Condominio: 0,
            "Total Mes": parcelaAtual,
            "Valor Investimento Antes": 0,
            "Rendimento Investimento": 0,
            "Valor Sacado Investimento": 0,
            "Valor Investimento Depois": 0,
            Observacao: "Parcela construtora (saldo dinâmico)"
        });
    }


    return {
        resumo_final: {
            entrada_calculada: entradaCalculada,
            saldo_base_imovel: saldoBaseImovel,
            total_financiado: financiamentoSubsidio,
            total_meses_simulados: detalhes.length - 1,
            cenario_escolhido: input.cenarioEscolha || "investir"
        },
        detalhes_mes_a_mes: detalhes
    };
}

module.exports = {
    simulateFinancing
};
