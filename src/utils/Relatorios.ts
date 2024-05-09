'use client'
import { Conferencum, ConsultarTabelaFinanceiro, ConsultarTabelaFornecedor, ConsultarTabelaLancamentos, ConsultarTabelaPedidos, Json, Lancamento, Message4, Message5 } from "@/components/Api";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import { formatarValorMonetario } from "./ReformularValor";


const tamanhoFonte = 9;

export function gerarRelatorioPDF(produtos: Message4[], numeroLoja: number, days: string): void {
    // Cria um novo documento PDF
    const doc = new jsPDF();
    const day = dayjs(days).format('DD-MM-YYYY')

    doc.setFontSize(18);
    doc.text(`PEDIDO CEASA LOJA ${numeroLoja} - IBS - ${day}`, 10, 20);

    // Define a posição inicial da tabela
    let y = 30;
    // Define o tamanho da fonte para esta página
    doc.setFontSize(tamanhoFonte);
    let soma = 0;
    let ContaProdutos = 0;
    let numeroPorPagina = 25;
    doc.text('Descrição', 10, y);
    doc.text('Ultimo Custo', 80, y);
    doc.text('Quantidade'.toString(), 110, y);
    doc.text('Subtotal', 150, y);

    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 5, 200, y + 5);
    y += 10;
    // Itera sobre os produtos para esta página
    produtos[0].json
        .filter(produto => produto.quantidade != 0)
        .map(produto => {
            if (ContaProdutos === numeroPorPagina) {
                doc.addPage()
                doc.setFontSize(18);
                doc.text(`PEDIDO CEASA LOJA ${numeroLoja} - IBS - ${day}`, 10, 20);
                doc.setFontSize(tamanhoFonte);
                y = 30;
                numeroPorPagina += 25
            }
            const subtotal = parseFloat(produto.custo.replace("R$", "").replace(",", ".")) * produto.quantidade;
            doc.text(produto.titulo, 10, y);
            doc.text(produto.custo, 80, y);
            doc.text(produto.quantidade.toString(), 110, y);
            doc.text(`R$ ${subtotal.toFixed(2)}`, 150, y);
            soma += subtotal;
            ContaProdutos += 1;
            y += 10; // Incrementa a posição Y para a próxima linha

        })

    // Adiciona o total do pedido apenas na última página
    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 5, 200, y + 5);
    doc.text('Total do pedido:', 10, y + 10);
    doc.text('R$ ' + soma.toFixed(2), 150, y + 10);

    // Salva o PDF com um nome específico
    doc.save(`pedido_loja_${numeroLoja}_${day}.pdf`);

    // Exibe mensagem no console para verificar se a função foi chamada
    console.log('Relatório PDF gerado');
}
export async function gerarRelatorioPDFTodas(Pedido : Message4[], dia: string){
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs(dia).format('YYYY-MM-DD');
    const pedidosHoje = Pedido?.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });

    function combinarItens(jsonList: Json[]): Json[] {
        const combinedDict: { [key: string]: Json } = {};

        for (const item of jsonList) {
            const key = `${item.titulo}-${item.custo}`;

            if (key in combinedDict) {
                combinedDict[key].quantidade += item.quantidade;
            } else {
                combinedDict[key] = item;
            }
        }
        return Object.values(combinedDict);
    }

    const todasAsLojas: Json[] = [];
    for (const pedido of pedidosHoje) {
        todasAsLojas.push(...pedido.json);
    }

    const itensCombinados: Json[] = combinarItens(todasAsLojas);

    const jsonGeral = [];
    for (const item of itensCombinados) {
        jsonGeral.push({
            custo: item.custo,
            status: item.status,
            titulo: item.titulo,
            quantidade: item.quantidade
        });
    }
    console.log(jsonGeral)

    // Cria um novo documento PDF
    const doc = new jsPDF();
    const day = dayjs(dia).format('DD-MM-YYYY')

    doc.setFontSize(18);
    doc.text(`PEDIDO CEASA TODAS AS LOJAS - IBS - ${day}`, 10, 20);

    // Define a posição inicial da tabela
    let y = 30;
    // Define o tamanho da fonte para esta página
    doc.setFontSize(tamanhoFonte);
    let soma = 0;
    let ContaProdutos = 0;
    let numeroPorPagina = 60;
    doc.text('Descrição', 10, y);
    doc.text('Ultimo Custo', 80, y);
    doc.text('Quantidade'.toString(), 110, y);
    doc.text('Subtotal', 150, y);

    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 1, 200, y + 1);
    y += 5;
    // Itera sobre os produtos para esta página
    jsonGeral
        .filter(produto => produto.quantidade != 0)
        .map(produto => {
            if (ContaProdutos === numeroPorPagina) {
                doc.addPage()
                y = 30;
                doc.setFontSize(18);
                doc.text(`PEDIDO CEASA TODAS AS LOJAS - IBS - ${day}`, 10, 20);
                doc.setFontSize(tamanhoFonte);
                y += 4;
                numeroPorPagina += 60
            }
            const subtotal = parseFloat(produto.custo.replace("R$", "").replace(",", ".")) * produto.quantidade;
            doc.text(produto.titulo, 10, y);
            doc.text(produto.custo, 80, y);
            doc.text(produto.quantidade.toString(), 110, y);
            doc.text(`R$ ${subtotal.toFixed(2)}`, 150, y);
            soma += subtotal;
            ContaProdutos += 1;
            y += 4; // Incrementa a posição Y para a próxima linha

        })

    // Adiciona o total do pedido apenas na última página
    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 5, 200, y + 5);
    doc.text('Total do pedido:', 10, y + 10);
    doc.text('R$ ' + soma.toFixed(2), 150, y + 10);

    // Salva o PDF com um nome específico
    doc.save(`pedido_loja_todas_lojas_${day}.pdf`);

    // Exibe mensagem no console para verificar se a função foi chamada
    console.log('Relatório PDF gerado');
}
export async function gerarTodasLojas(days: number) {
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs().subtract(days, 'days').format('YYYY-MM-DD');
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });

    function combinarItens(jsonList: Json[]): Json[] {
        const combinedDict: { [key: string]: Json } = {};

        for (const item of jsonList) {
            const key = `${item.titulo}-${item.custo}`;

            if (key in combinedDict) {
                combinedDict[key].quantidade += item.quantidade;
            } else {
                combinedDict[key] = item;
            }
        }
        return Object.values(combinedDict);
    }

    const todasAsLojas: Json[] = [];
    for (const pedido of pedidosHoje) {
        todasAsLojas.push(...pedido.json);
    }

    const itensCombinados: Json[] = combinarItens(todasAsLojas);

    const jsonGeral: Json[] = [];
    for (const item of itensCombinados) {
        jsonGeral.push({
            custo: item.custo,
            status: item.status,
            titulo: item.titulo,
            quantidade: item.quantidade
        });
    }
    return jsonGeral;
}
export async function gerarTodasLojasAtualizado(days: number, DiaHoje: string) {
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs(DiaHoje).subtract(days, 'days').format('YYYY-MM-DD');
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });

    function combinarItens(jsonList: Json[]): Json[] {
        const combinedDict: { [key: string]: Json } = {};

        for (const item of jsonList) {
            const key = `${item.titulo}-${item.custo}`;

            if (key in combinedDict) {
                combinedDict[key].quantidade += item.quantidade;
            } else {
                combinedDict[key] = item;
            }
        }
        return Object.values(combinedDict);
    }

    const todasAsLojas: Json[] = [];
    for (const pedido of pedidosHoje) {
        todasAsLojas.push(...pedido.json);
    }

    const itensCombinados: Json[] = combinarItens(todasAsLojas);

    const jsonGeral: Json[] = [];
    for (const item of itensCombinados) {
        jsonGeral.push({
            custo: item.custo,
            status: item.status,
            titulo: item.titulo,
            quantidade: item.quantidade
        });
    }
    return jsonGeral;
}
export async function gerarRelatorioPDFDEL(pedidossss: Message4[], day: string){
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs(day).format('YYYY-MM-DD');
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });
    console.log(pedidosHoje)

    function combinarItens(jsonList: Json[]): Json[] {
        const combinedDict: { [key: string]: Json } = {};

        for (const item of jsonList) {
            const key = `${item.titulo}-${item.custo}`;

            if (key in combinedDict) {
                combinedDict[key].quantidade += item.quantidade;
            } else {
                combinedDict[key] = item;
            }
        }
        return Object.values(combinedDict);
    }

    const todasAsLojass: Json[] = [];
    for (const pedido of pedidosHoje) {
        todasAsLojass.push(...pedido.json);
    }

    const itensCombinados: Json[] = combinarItens(todasAsLojass);

    const jsonGeral = [];
    for (const item of itensCombinados) {
        jsonGeral.push({
            custo: item.custo,
            status: item.status,
            titulo: item.titulo,
            quantidade: item.quantidade
        });
    }

    const lojasOrganizadas = pedidossss.sort((a, b) => a.loja - b.loja);

    const Pedidoloja1 = lojasOrganizadas[0].json ?? []
    const Pedidoloja2 = lojasOrganizadas[1].json ?? []
    const Pedidoloja3 = lojasOrganizadas[2].json ?? []
    const Pedidoloja4 = lojasOrganizadas[3].json ?? []
    const Pedidoloja5 = lojasOrganizadas[4].json ?? []

    console.log(lojasOrganizadas)

    const doc = new jsPDF('landscape');
    let y = 4;
    doc.setFontSize(10);
    doc.text('Pedidos do dia: ' + dataHoje, 20, y);
    y = 10;
    doc.setFontSize(13);
    doc.text('Descrição', 20, y);
    doc.text('Loja 1', 80, y);
    doc.text('Loja 2', 105, y);
    doc.text('Loja 3', 130, y);
    doc.text('Loja 5', 155, y);
    doc.text('Loja 7', 180, y);
    doc.text('TOTAL', 210, y);
    doc.text('CUSTO', 235, y);
    doc.text('VALOR TOTAL', 260, y);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 290, y + 2);
    doc.setFontSize(10);

    const todasAsLojas = [...Pedidoloja1, ...Pedidoloja2, ...Pedidoloja3, ...Pedidoloja4, ...Pedidoloja5];

    console.log(todasAsLojas)

    let totalQuantidade = 0;
    let ContaProdutos = 0;
    let numeroPorPagina = 20;
    y += 10;

    jsonGeral
    .sort((a, b) => a.titulo.localeCompare(b.titulo))
    .forEach((pedido, index) => {
        if (pedido.quantidade === 0) {

        } else {
            if (ContaProdutos === numeroPorPagina) {
                y = 10
                doc.addPage()
                doc.setFontSize(13);
                doc.text('Descrição', 20, y);
                doc.text('Loja 1', 80, y);
                doc.text('Loja 2', 105, y);
                doc.text('Loja 3', 130, y);
                doc.text('Loja 5', 155, y);
                doc.text('Loja 7', 180, y);
                doc.text('TOTAL', 210, y);
                doc.text('CUSTO', 235, y);
                doc.text('VALOR TOTAL', 260, y);
                doc.setLineWidth(0.5);
                doc.line(20, y + 2, 290, y + 2);
                doc.setFontSize(10);
                numeroPorPagina += 20
                y += 10;
            }
            const quantidadeLoja1 = Pedidoloja1.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade
            console.log(Pedidoloja2.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade)
            const quantidadeLoja2 = Pedidoloja2.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade
            const quantidadeLoja3 = Pedidoloja3.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade
            const quantidadeLoja4 = Pedidoloja4.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade
            const quantidadeLoja5 = Pedidoloja5.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0]?.quantidade

            y += 1;
            doc.text(pedido.titulo, 20, y);
            doc.setFontSize(14);
            doc.text(quantidadeLoja1 ? quantidadeLoja1.toString() : '-', 80, y);
            doc.text(quantidadeLoja2 ? quantidadeLoja2.toString() : '-', 105, y);
            doc.text(quantidadeLoja3 ? quantidadeLoja3.toString() : '-', 130, y);
            doc.text(quantidadeLoja4 ? quantidadeLoja4.toString() : '-', 155, y);
            doc.text(quantidadeLoja5 ? quantidadeLoja5.toString() : '-', 180, y);
            doc.text(pedido.quantidade.toString(), 210, y);
            doc.line(20, y + 2, 290, y + 2);
            doc.setFontSize(10);
            y += 8;
            ContaProdutos += 1
        }



        totalQuantidade += pedido.quantidade;
    });



    doc.save(`pedido_loja_todas_lojas_${dataHoje}.pdf`);
}
export async function gerarRelatorioLancamento(lancamento: Lancamento[], day: string) {
    const pedidosontem = await gerarTodasLojasAtualizado(1, day)
    const fornecedores = await ConsultarTabelaFornecedor('fornecedor')
    const financeiro = await ConsultarTabelaFinanceiro('financeiro')
    const hoje = dayjs(day).format('DD-MM-YYYY')

    const financeirohoje = financeiro?.message.filter(pedido => {
        return dayjs(pedido.data).format('DD-MM-YYYY') === hoje;
    });
    console.log(financeirohoje);

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`LANÇAMENTO CEASA - IBS - ${day}`, 10, 20);

    // Define a posição inicial da tabela
    let y = 30;
    // Define o tamanho da fonte para esta página
    doc.setFontSize(tamanhoFonte);
    let soma = 0;
    let avista = 0;
    let aprazo = 0;
    let ContaProdutos = 0;
    let numeroPorPagina = 60;
    doc.text('Descrição', 10, y);
    doc.text('Quantidade pedida', 76, y);
    doc.text('Quantidade comprada'.toString(), 105, y);
    doc.text('Custo', 145, y);
    doc.text('Pagamento', 160, y);
    doc.text('Subtotal', 180, y);

    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 1, 200, y + 1);
    y += 4;
    // Itera sobre os produtos para esta página
    interface Fornecedor {
        nome: string;
        valorInicial: number;
    }
    let resultadoss: Fornecedor[] = fornecedores.message.map(fornec => {
        return {
            nome: fornec.nome,
            valorInicial: 0
        }
    })

    lancamento.map(produto => {
        if (ContaProdutos === numeroPorPagina) {
            doc.addPage()
            doc.setFontSize(18);
            doc.text(`LANÇAMENTO CEASA - IBS - ${day}`, 10, 20);
            doc.setFontSize(tamanhoFonte);
            y = 30;
            numeroPorPagina += 60
        }
        const subtotal = produto.total;
        const produtoPedido = pedidosontem.find(p => p.titulo === produto.titulo);

        doc.text(produto.titulo, 10, y);
        doc.text(produtoPedido ? produtoPedido.quantidade.toString() : '-', 76, y);
        doc.text(produto.quantidade.toString(), 105, y);
        if (produto.custo === 'Valor inválido') {
            doc.text("R$ -", 145, y);
            doc.text('-', 160, y);

        } else {
            doc.text(produto.custo, 145, y);
            doc.text(produto.pagamento, 160, y);

        }
        if (produto.pagamento === 'avista') {
            avista += subtotal
        } else {
            resultadoss.map(result => {
                if(result.nome === produto.fornecedor){
                    result.valorInicial += subtotal
                }
            })
            aprazo += subtotal
        }

        doc.text(formatarValorMonetario(produto.total.toString()), 180, y);

        soma += subtotal;
        ContaProdutos += 1;
        y += 4;
    })

    doc.setLineWidth(0.5);
    doc.line(10, y + 5, 200, y + 5);
    doc.text('Total do pedido:', 10, y + 10);
    doc.text(formatarValorMonetario(soma.toString()), 180, y + 10);
    y += 5;
    doc.text('Total a vista: ' + formatarValorMonetario(avista.toString()), 10, y + 10);
    y += 4;
    doc.text('Total a prazo: ' + formatarValorMonetario(aprazo.toString()), 10, y + 10);
    doc.addPage()
    doc.setFontSize(18);
    doc.text(`FINANCEIRO CEASA - IBS - ${day}`, 10, 20);


    y = 30;

    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 5;

    doc.setFontSize(tamanhoFonte);
    doc.text('Valor inicial (DINHEIRO):', 10, y);
    doc.text(formatarValorMonetario(financeirohoje[0].json.valorInicial), 55, y);
    y += 5;
    doc.text('Compras a vista: ', 10, y);
    doc.text("-" + formatarValorMonetario(avista.toString()), 55, y);
    y += 5;
    doc.text('Lanche: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.lanche), 55, y);
    y += 5;
    doc.text('Combustivel: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.combustivel), 55, y);
    y += 5;
    doc.text('Outros 1: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.outros1), 55, y);
    doc.text(financeirohoje[0].json.descrcaoOutros1, 80, y);
    y += 5;
    doc.text('Outros 2: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.outros2), 55, y);
    doc.text(financeirohoje[0].json.descrcaoOutros2, 80, y);
    y += 5;
    doc.text('Outros 3: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.outros3), 55, y);
    doc.text(financeirohoje[0].json.descrcaoOutros3, 80, y);
    y += 1;
    doc.setLineWidth(0.5);
    doc.line(10, y, 100, y);
    y += 5;
    doc.text('Resultado: ', 10, y);
    const Resultado = parseFloat(financeirohoje[0].json.valorInicial) - avista - parseFloat(financeirohoje[0].json.lanche) - parseFloat(financeirohoje[0].json.combustivel) - parseFloat(financeirohoje[0].json.outros1) - parseFloat(financeirohoje[0].json.outros2) - parseFloat(financeirohoje[0].json.outros3)
    doc.text(" " + formatarValorMonetario(Resultado.toString()), 55, y);
    y += 5;
    doc.text('Troco: ', 10, y);
    doc.text("-" + formatarValorMonetario(financeirohoje[0].json.troco), 55, y);
    y += 1;
    doc.setLineWidth(0.5);
    doc.line(10, y, 100, y);
    y += 5;
    const ResultadoFinal = Resultado - parseFloat(financeirohoje[0].json.troco)
    doc.text('Resultado Final: ', 10, y);
    doc.text(" " + formatarValorMonetario(ResultadoFinal.toString()), 55, y);
    y += 10;

    doc.setFontSize(13);
    doc.text(`COMPRAS A PRAZO - IBS - ${day}`, 10, y);
    y += 1;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    let somaFornecedores = 0
    doc.setFontSize(tamanhoFonte);
    resultadoss.map(result => {
        y += 5;
        doc.text(result.nome, 10, y);
        doc.text(formatarValorMonetario(result.valorInicial.toString()), 55, y);
        somaFornecedores += result.valorInicial
    })
    y += 1;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y)
    y += 5;
    doc.text('Total a prazo:: ', 10, y);
    doc.text(" " + formatarValorMonetario(somaFornecedores.toString()), 55, y);

    doc.save(`lancamento_ibs_${day}.pdf`);
    console.log('Relatório PDF gerado');
}
export async function gerarRelatorioConferencia(conferenciaa: Message5[], numeroLoja: number, days: string) {
    const doc = new jsPDF();
    const ontem = dayjs(days).subtract(1, 'days').format('DD-MM-YYYY')
    const hoje = dayjs(days).format('DD-MM-YYYY')
    const pedidos = await ConsultarTabelaPedidos('pedidos')

    const pedidosOntem = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('DD-MM-YYYY') === ontem;
    });

    const pedidosLoja = pedidosOntem?.filter(pedido => {
        return pedido.loja === numeroLoja;
    });

    const PedidoLojaInicial = pedidosLoja[0].json.filter(produto => produto.quantidade != 0)

    doc.setFontSize(18);
    doc.text(`CONFERENCIA CEASA - LOJA ${numeroLoja} - ${days}`, 10, 20);

    // Define a posição inicial da tabela
    let y = 30;
    // Define o tamanho da fonte para esta página
    doc.setFontSize(tamanhoFonte);
    let ContaProdutos = 0;
    let numeroPorPagina = 60;
    doc.text('Descrição', 10, y);
    doc.text('Pedida', 160, y);
    doc.text('Conferencia'.toString(), 180, y);

    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 1, 200, y + 1);
    y += 4;
    // Itera sobre os produtos para esta página
    PedidoLojaInicial.map(produto => {
        if (ContaProdutos === numeroPorPagina) {
            doc.addPage()
            doc.setFontSize(18);
            doc.text(`CONFERENCIA CEASA - LOJA ${numeroLoja} - ${days}`, 10, 20);
            doc.setFontSize(tamanhoFonte);
            y = 30;
            numeroPorPagina += 60
        }
        const QuantidadeConferida = conferenciaa[0].conferencia.find(c => c.titulo === produto.titulo)
        const quantidade = QuantidadeConferida ? QuantidadeConferida.quantidade.toString() : '';
        doc.text(produto.titulo, 10, y);
        doc.text(produto.quantidade.toString(), 160, y);
        doc.text(quantidade, 180, y);

        ContaProdutos += 1;
        y += 4;
    })
    doc.setLineWidth(0.5);
    doc.line(10, y + 5, 200, y + 5);
    doc.save(`conferencia_loja_${numeroLoja}_${days}.pdf`);

    console.log('Relatório PDF gerado');
}
export async function gerarRelatorioConferenciaGeral(conferenciaa: Message5[], days: string) {
    console.log(conferenciaa)

    function combinarItens(jsonList: Conferencum[]): Conferencum[] {
        const combinedDict: { [key: string]: Conferencum } = {};

        for (const item of jsonList) {
            const key = `${item.titulo}`;

            if (key in combinedDict) {
                combinedDict[key].quantidade += item.quantidade;
            } else {
                combinedDict[key] = item;
            }
        }
        return Object.values(combinedDict);
    }

    const todasAsLojas: Conferencum[] = [];
    for (const pedido of conferenciaa) {
        todasAsLojas.push(...pedido.conferencia);
    }

    const itensCombinados: Conferencum[] = combinarItens(todasAsLojas);

    const jsonGeral: Conferencum[] = [];
    for (const item of itensCombinados) {
        jsonGeral.push({
            titulo: item.titulo,
            quantidade: item.quantidade
        });
    }

    const todasAsLojass = await gerarTodasLojasAtualizado(1, days)
    console.log(jsonGeral)
    console.log(todasAsLojass.filter(item => item.quantidade != 0))

    const Lancamentos = await ConsultarTabelaLancamentos('lancamento')

    const lancamentosAtual = Lancamentos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === days;

    });



    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`CONFERENCIA CEASA GERAL - ${days}`, 10, 20);


    // Define a posição inicial da tabela
    let y = 30;
    // Define o tamanho da fonte para esta página
    doc.setFontSize(tamanhoFonte);
    let ContaProdutos = 0;
    let numeroPorPagina = 60;
    doc.text('Descrição', 10, y);
    doc.text('Pedida', 140, y);
    doc.text('Comprada', 160, y);
    doc.text('Conferencia'.toString(), 180, y);

    doc.setLineWidth(0.5); // Define a largura da linha
    doc.line(10, y + 1, 200, y + 1);
    y += 4;
    jsonGeral
    .sort((a, b) => a.titulo.localeCompare(b.titulo))
    .map(produto => {
        if (ContaProdutos === numeroPorPagina) {
            doc.addPage()
            doc.setFontSize(18);
            doc.text(`CONFERENCIA CEASA GERAL - ${days}`, 10, 20);
            doc.setFontSize(tamanhoFonte);
            y = 30;
            numeroPorPagina += 60
        }
        const QuantidadeConferida = todasAsLojass.find(c => c.titulo.trim() === produto.titulo.trim())?.quantidade;
        const QuantidadeLançada = lancamentosAtual && lancamentosAtual.length > 0 && lancamentosAtual[0].lancamento ?
            lancamentosAtual[0].lancamento.find(produtoo => produtoo.titulo === produto.titulo) : undefined;
        const quantidade = QuantidadeLançada ? QuantidadeLançada.quantidade.toString() : '';


        doc.text(produto.titulo, 10, y);
        doc.text(QuantidadeConferida?.toString() || 'Quantidade não disponível', 140, y);
        doc.text(quantidade, 160, y);
        doc.text(produto.quantidade.toString(), 180, y);

        ContaProdutos += 1;
        y += 4;
    })
    doc.setLineWidth(0.5);
    doc.line(10, y + 5, 200, y + 5);
    doc.save(`conferencia_geral_${days}.pdf`);

    console.log('Relatório PDF gerado');
}