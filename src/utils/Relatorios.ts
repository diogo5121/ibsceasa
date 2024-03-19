'use client'
import { ConsultarTabelaPedidos, Json, Message4 } from "@/components/Api";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import { x } from "pdfkit";


const tamanhoFonte = 9; // Defina o tamanho da fonte

export function gerarRelatorioPDF(produtos: Message4[], numeroLoja: number): void {
    // Cria um novo documento PDF
    const doc = new jsPDF();
    const day = dayjs().format('DD-MM-YYYY')

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

export async function gerarRelatorioPDFTodas() {
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs().format('YYYY-MM-DD');
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
    const day = dayjs().format('DD-MM-YYYY')

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


export async function gerarRelatorioPDFDEL(pedidossss: Message4[]) {
    const pedidos = await ConsultarTabelaPedidos('pedidos');
    const dataHoje = dayjs().format('YYYY-MM-DD');
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
    pedidossss.sort((a, b) => a.loja - b.loja);
    const Pedidoloja1 = pedidossss[0].json ?? []
    const Pedidoloja2 = pedidossss[1].json ?? []
    const Pedidoloja3 = pedidossss[2].json ?? []
    const Pedidoloja4 = pedidossss[3].json ?? []
    const Pedidoloja5 = pedidossss[4].json ?? []

    const doc = new jsPDF('landscape');
    let y = 10;
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

    jsonGeral.forEach((pedido, index) => {
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
            const quantidadeLoja1 = Pedidoloja1.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0].quantidade
            const quantidadeLoja2 = Pedidoloja2.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0].quantidade
            const quantidadeLoja3 = Pedidoloja3.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0].quantidade
            const quantidadeLoja4 = Pedidoloja4.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0].quantidade
            const quantidadeLoja5 = Pedidoloja5.filter(pedidoo => pedidoo.titulo === pedido.titulo)[0].quantidade

            y += 1;
            doc.text(pedido.titulo, 20, y);
            doc.setFontSize(14);
            doc.text(quantidadeLoja1.toString(), 80, y);
            doc.text(quantidadeLoja2.toString(), 105, y);
            doc.text(quantidadeLoja3.toString(), 130, y);
            doc.text(quantidadeLoja4.toString(), 155, y);
            doc.text(quantidadeLoja5.toString(), 180, y);
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