export function calcularMargem(ValorCusto: number, ValorVenda: number) {

    const Divisao = ValorCusto / ValorVenda
    const Soma = Divisao - 1
    const Porcentagem = Soma * 100

    const PorcentagemFormulada = Porcentagem.toFixed(2).toString().replace('.', ',')

    return '% ' + PorcentagemFormulada
}