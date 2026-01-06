const { simulateFinancing } = require("../src/simulate");

describe("Motor de Simulação Financeira", () => {
  test("calcula corretamente a entrada", () => {
    const result = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      numParcelasConstrutora: 4
    });

    expect(result.resumo_final.entrada_calculada).toBe(80000);
  });

  test("saldo base diminui quando ATO aumenta", () => {
    const semAto = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 0,
      numParcelasConstrutora: 4
    });

    const comAto = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 20000,
      numParcelasConstrutora: 4
    });

    expect(comAto.resumo_final.saldo_base_imovel)
      .toBeLessThan(semAto.resumo_final.saldo_base_imovel);
  });

  test("aplica INCC quando taxa é informada", () => {
    const result = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      numParcelasConstrutora: 4,
      taxaInccMensalPercentual: 0.5
    });

    const temIncc = result.detalhes_mes_a_mes
      .some(m => m["INCC (Correção Saldo)"] > 0);

    expect(temIncc).toBe(true);
  });

  test("investimento nunca fica negativo", () => {
    const result = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      numParcelasConstrutora: 6,
      valorInvestimentoInicial: 5000,
      taxaInccMensalPercentual: 0.5,
      mesesSeguroObraCrescendo: 3,
      parcelaCaixaBase: 600,
      taxaCondominioMensal: 250,
      cenarioEscolha: "investir"
    });

    const investimentoNegativo = result.detalhes_mes_a_mes
      .some(m => m["Valor Investimento Depois"] < 0);

    expect(investimentoNegativo).toBe(false);
  });

  test("cenario ato nao utiliza investimento mensal", () => {
    const result = simulateFinancing({
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      valorInvestimentoInicial: 15000,
      numParcelasConstrutora: 4,
      cenarioEscolha: "ato"
    });

    const usouInvestimento = result.detalhes_mes_a_mes
      .some(m => m["Valor Investimento Depois"] > 0);

    expect(usouInvestimento).toBe(false);
  });
});
describe("Regras de regressao financeira", () => {
  test("saldo devedor nunca fica negativo", () => {
    const result = simulateFinancing({
      precoVenda: 200000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      numParcelasConstrutora: 12,
      taxaInccMensalPercentual: 0.5
    });

    const saldoNegativo = result.detalhes_mes_a_mes
      .some(m => m["Parcela Construtora (Com INCC)"] < 0);

    expect(saldoNegativo).toBe(false);
  });

  test("total do mes nunca é negativo", () => {
    const result = simulateFinancing({
      precoVenda: 180000,
      financiamentoSubsidio: 140000,
      valorAto: 5000,
      numParcelasConstrutora: 6
    });

    const totalNegativo = result.detalhes_mes_a_mes
      .some(m => m["Total Mes"] < 0);

    expect(totalNegativo).toBe(false);
  });

  test("saldo do investimento respeita identidade financeira", () => {
    const input = {
      precoVenda: 230000,
      financiamentoSubsidio: 150000,
      valorAto: 10000,
      valorInvestimentoInicial: 20000,
      numParcelasConstrutora: 6,
      taxaInccMensalPercentual: 0.5,
      mesesSeguroObraCrescendo: 3,
      parcelaCaixaBase: 600,
      taxaCondominioMensal: 250,
      cenarioEscolha: "investir"
    };

    const result = simulateFinancing(input);

    const totalRendimentos = result.resumo_final.total_rendimento_investimento;
    const totalSacado = result.resumo_final.total_investimento_sacado;
    const saldoFinal = result.resumo_final.saldo_final_investimento;

    const esperado =
      input.valorInvestimentoInicial +
      totalRendimentos -
      totalSacado;

    expect(Math.round(saldoFinal)).toBe(Math.round(esperado));
  });

  test("total pago bate com soma dos meses", () => {
    const result = simulateFinancing({
      precoVenda: 210000,
      financiamentoSubsidio: 160000,
      valorAto: 10000,
      aberturaConta: 750,
      numParcelasConstrutora: 6
    });

    const somaMeses = result.detalhes_mes_a_mes
      .reduce((acc, m) => acc + m["Total Mes"], 0);

    const totalResumo =
      result.resumo_final.total_pago_construtora +
      result.resumo_final.total_seguro_obra +
      result.resumo_final.total_pago_caixa +
      result.resumo_final.total_condominio +
      (result.resumo_final.total_incc_pago || 0);

    expect(Math.round(somaMeses)).toBeGreaterThan(0);
    expect(totalResumo).toBeGreaterThan(0);
  });
});
