/**
 * Motor de simulação financeira (v3)
 * Adiciona loop mensal simples (sem INCC)
 */

/**
 * @param {import("./domain/types").FinancingInput} input
 */
function simulateFinancing(input) {
    const valorAtoOriginal = Number(input.valorAto) || 0;
    const valorInvestimentoInicial =
        Number(input.valorInvestimentoInicial) || 0;

    const cenarioEscolha = input.cenarioEscolha || "investir";


    // taxa fixa inicial (depois pode virar configurável)
    const taxaRendimentoMensal = 0.009; // 0.9% a.m.

    const taxaCondominioMensal = Number(input.taxaCondominioMensal) || 0;

    const precoVenda = Number(input.precoVenda) || 0;
    const financiamentoSubsidio = Number(input.financiamentoSubsidio) || 0;
    const valorAto =
        cenarioEscolha === "ato"
            ? valorAtoOriginal + valorInvestimentoInicial
            : valorAtoOriginal;
    const aberturaConta = Number(input.aberturaConta) || 0;
    const numParcelasConstrutora = Number(input.numParcelasConstrutora) || 0;
    const taxaInccMensal = Number(input.taxaInccMensalPercentual) || 0;
    const taxaIncc = taxaInccMensal / 100;
    const mesesSeguroObra = Number(input.mesesSeguroObraCrescendo) || 0;
    const parcelaCaixaBase = Number(input.parcelaCaixaBase) || 0;

    const incrementoSeguroObra =
        mesesSeguroObra > 0 ? parcelaCaixaBase / mesesSeguroObra : 0;



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
        Observacao:
            cenarioEscolha === "ato"
                ? "ATO com uso do investimento como entrada"
                : "Despesas iniciais (ATO + Abertura de Conta)"
    });

    // Parcela fixa da construtora (versão simples)
    const parcelaConstrutoraBase =
        numParcelasConstrutora > 0 ? saldoBaseImovel / numParcelasConstrutora : 0;

    let saldoDevedor = saldoBaseImovel;
    let saldoInvestimento =
        cenarioEscolha === "investir" ? valorInvestimentoInicial : 0;



    // Loop mensal (mês 1 em diante)
    for (let mes = 1; mes <= numParcelasConstrutora; mes++) {
        const correcaoIncc = saldoDevedor * taxaIncc;
        saldoDevedor += correcaoIncc;

        const parcelasRestantes = numParcelasConstrutora - (mes - 1);
        const parcelaAtual =
            parcelasRestantes > 0 ? saldoDevedor / parcelasRestantes : saldoDevedor;

        saldoDevedor -= parcelaAtual;
        let seguroObraMes = 0;

        if (mes <= mesesSeguroObra) {
            seguroObraMes = incrementoSeguroObra * mes;
        }
        let parcelaCaixaMes = 0;
        let condominioMes = 0;

        if (mes > mesesSeguroObra) {
            parcelaCaixaMes = parcelaCaixaBase;
            condominioMes = taxaCondominioMensal;
        }
        let investimentoAntes = saldoInvestimento;
        let rendimentoMes = 0;

        if (cenarioEscolha === "investir" && saldoInvestimento > 0) {
            rendimentoMes = saldoInvestimento * taxaRendimentoMensal;
            saldoInvestimento += rendimentoMes;
        }
        const totalMes =
            parcelaAtual +
            seguroObraMes +
            parcelaCaixaMes +
            condominioMes;
        let valorSacado = 0;

        if (cenarioEscolha === "investir" && saldoInvestimento > 0) {
            valorSacado = Math.min(saldoInvestimento, totalMes);
            saldoInvestimento -= valorSacado;
        }

        detalhes.push({
            Mes: mes,
            "Despesas Mês 0": 0,
            "Parcela Imovel (Base)": parcelaAtual,
            "Parcela ITBI/Cartorio (Base)": 0,
            "INCC (Correção Saldo)": correcaoIncc,
            "Parcela Construtora (Com INCC)": parcelaAtual,
            "Seguro de Obra": seguroObraMes,
            Anuais: 0,
            Chave: 0,
            "Parcela Caixa": parcelaCaixaMes,
            Condominio: condominioMes,
            "Total Mes": totalMes,
            "Valor Investimento Antes": investimentoAntes,
            "Rendimento Investimento": rendimentoMes,
            "Valor Sacado Investimento": valorSacado,
            "Valor Investimento Depois": saldoInvestimento,


            Observacao:
                cenarioEscolha === "investir" && valorSacado > 0
                    ? "Despesas cobertas com investimento"
                    : "Pós-obra (Construtora + Caixa + Condomínio)"
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
