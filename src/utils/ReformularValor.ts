export function formatarValorMonetario(valor: string): string {
    const numero = parseFloat(valor.replace(',', '.')); 

    if (isNaN(numero)) {
        return 'Valor inválido';
    }

    const formatoBrasileiro = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    return formatoBrasileiro.format(numero);
}