import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { ConsultarProduto, ConsultarTabelaCeasa, ConsultarTabelaFinanceiro, ConsultarTabelaFornecedor, ConsultarTabelaLancamentos, ConsultarTabelaPedidos, FazerLancamento, InserirFinanceiro, JogarPedido, Json, Json11, Lancamento, Message10, Root3 } from '@/components/Api';
import '@/app/globals.css'
import dayjs from 'dayjs';
import Image from 'next/image';
import { gerarTodasLojas } from '@/utils/Relatorios';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import { EnviarMsg, WebSocketExample } from '@/components/Soket';
import { RxValue } from 'react-icons/rx';

export default function Lancamentos() {
    const [loading, setLoading] = useState(true);
    const [QuantidadeEditado, setQuantidadeEditado] = useState('0');
    const [precoEditado, setprecoEditado] = useState('0');
    const [error, setError] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [produtosPedido, setProdutosPedidos] = useState<Json[]>();
    const [produtoEditando, setProdutoEditando] = useState<Json>();
    const [fornecedores, setFornecedores] = useState<Message10[]>();
    const [LancamentoHoje, setLancamentosHoje] = useState<Lancamento[]>();
    const [open, setOpen] = useState(false);
    const [atualizar, setAtualizar] = useState(0);
    const [valorInicial, setValorInicial] = useState('0');
    const [lanche, setLanche] = useState('0');
    const [combustivel, setCombustivel] = useState('0');
    const [troco, setTroco] = useState('0');
    const [descrcaoOutros1, setDescrcaoOutros1] = useState('');
    const [outros1, setoutros1] = useState('0');
    const [descrcaoOutros2, setDescrcaoOutros2] = useState('');
    const [outros2, setoutros2] = useState('0');
    const [descrcaoOutros3, setDescrcaoOutros3] = useState('');
    const [outros3, setoutros3] = useState('0');
    const [aVistaSelecionado, setAVistaSelecionado] = useState(false);
    const [aPrazoSelecionado, setAPrazoSelecionado] = useState(false);
    const [carregamentoMobal, setCarregamentoMobal] = useState(false);

    const handleSelecionarPagamento = (tipoPagamento: 'avista' | 'aprazo') => {
        if (tipoPagamento === 'avista') {
            setAVistaSelecionado(true);
            setAPrazoSelecionado(false);
        }
        else if (tipoPagamento === 'aprazo') {
            setAVistaSelecionado(false);
            setAPrazoSelecionado(true);
        }
    };


    const handleOpen = (produtoo: Json) => {
        setCarregamentoMobal(true)
        setOpen(true);
        const lancamentoProduto = LancamentoHoje?.find(produto => produto.titulo === produtoo.titulo);
        if (lancamentoProduto && !lancamentoProduto.lancado) {
            console.log('olaola');
        } else if (lancamentoProduto) {
            console.log(lancamentoProduto.fornecedor);

            setFornecedor(lancamentoProduto.fornecedor);
            setprecoEditado(lancamentoProduto.total.toString());
            setQuantidadeEditado(lancamentoProduto.quantidade.toString());
            if (lancamentoProduto.pagamento === 'avista') {
                setAVistaSelecionado(true);
                setAPrazoSelecionado(false);
            }
            if (lancamentoProduto.pagamento === 'aprazo') {
                setAVistaSelecionado(false);
                setAPrazoSelecionado(true);
            }
            setCarregamentoMobal(false)

        } else {
            setCarregamentoMobal(false)
            setprecoEditado('0');
            setQuantidadeEditado('0');
        }
    };
    const handleClose = () => {
        setOpen(false);
        setProdutoEditando(undefined);
        setFornecedor('');
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log('aualizou')
            WebSocketExample(atualizar, setAtualizar)
            try {
                setLoading(true);
                const produtosceasa = await gerarTodasLojas(1);
                const produtosPedidoFormulado = produtosceasa.filter(produto => produto.quantidade > 0)
                setProdutosPedidos(produtosPedidoFormulado);
                try {
                    setLoading(true);
                    const lancamentos = await ConsultarTabelaLancamentos('lancamento')
                    const dataHoje = dayjs().format('YYYY-MM-DD');
                    const lancamentoHoje = lancamentos?.message.filter(
                        lancamento => dayjs(lancamento.data).format('YYYY-MM-DD') === dataHoje
                    )

                    console.log('lacamento hoje:', lancamentoHoje)

                    if (lancamentoHoje.length >= 1) {
                        console.log('JA FOI CRIADO O LANCAMENTO')
                        setLancamentosHoje(lancamentoHoje[0].lancamento)
                    } else {
                        console.log('Não foi criado')
                        const TabelaReformulada: Lancamento[] = produtosPedidoFormulado.map(fruta => ({
                            custo: "R$ 0",
                            status: fruta.status,
                            titulo: fruta.titulo,
                            quantidade: 0,
                            lancado: false,
                            pagamento: '',
                            total: 0,
                            fornecedor: ''
                        }))

                        await FazerLancamento(TabelaReformulada)
                        setLancamentosHoje(TabelaReformulada)
                    }

                } catch (error) {
                    console.error('Ocorreu um erro ao carregar os lancamentos:', error);
                    console.log('Não foi criado')
                    const TabelaReformulada: Lancamento[] = produtosPedidoFormulado.map(fruta => ({
                        custo: "R$ 0",
                        status: fruta.status,
                        titulo: fruta.titulo,
                        quantidade: 0,
                        lancado: false,
                        pagamento: '',
                        total: 0,
                        fornecedor: ''

                    }))

                    await FazerLancamento(TabelaReformulada)
                    setLancamentosHoje(TabelaReformulada)

                } finally {
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        handleClose();

        const consultaFornecedores = async () => {
            const fornecedores = await ConsultarTabelaFornecedor('fornecedor')
            setFornecedores(fornecedores.message)
        }
        consultaFornecedores();

        const ConsultarFinanceiro = async () => {
            setLoading(true)
            try {
                const financeiro = await ConsultarTabelaFinanceiro('financeiro')
                const dataHoje = dayjs().format('YYYY-MM-DD');
                const financeiroHoje = financeiro?.message.filter(
                    financeiro => dayjs(financeiro.data).format('YYYY-MM-DD') === dataHoje
                )
                console.log(financeiroHoje)
                if (financeiroHoje) {
                    setLoading(false)
                    setValorInicial(financeiroHoje[0].json.valorInicial)
                    setLanche(financeiroHoje[0].json.lanche)
                    setCombustivel(financeiroHoje[0].json.combustivel)
                    setTroco(financeiroHoje[0].json.troco)
                    setDescrcaoOutros1(financeiroHoje[0].json.descrcaoOutros1)
                    setoutros1(financeiroHoje[0].json.outros1)
                    setDescrcaoOutros2(financeiroHoje[0].json.descrcaoOutros2)
                    setoutros2(financeiroHoje[0].json.outros2)
                    setDescrcaoOutros3(financeiroHoje[0].json.descrcaoOutros3)
                    setoutros3(financeiroHoje[0].json.outros3)
                } else {
                    setLoading(false)
                    console.log('NÃO TEM LANÇAMENTO DE FINANCEIRO HOJE')
                }
                console.log(financeiroHoje)
            } catch (e) {
                console.log('NÃO TEM LANÇAMENTO DE FINANCEIRO HOJE')
            }
        }
        ConsultarFinanceiro()
    }, [atualizar]);

    const FazerLancamentoNoBanco = async () => {
        console.log('FazerLancamento');
        const index: number = LancamentoHoje?.findIndex(lancamento => lancamento.titulo === produtoEditando?.titulo) ?? -1;


        if (aVistaSelecionado === false && aPrazoSelecionado === false) {
            if (parseFloat(QuantidadeEditado) > 0 && parseFloat(precoEditado) > 0) {
                setError('Não foi selecionado o tipo de pagamento')

            } else {
                setError('Se você não comprou esse prouto selecione o pagamento como "A vista" para lançar zerado')
            }
        } else {
            if (aPrazoSelecionado === true && fornecedor === '') {
                setError('Nenhum fornecedor foi selecionado')
            } else {
                if (index !== -1 && produtoEditando) {
                    const novoLancamentoHoje = [...(LancamentoHoje || [])];

                    novoLancamentoHoje[index] = {
                        ...novoLancamentoHoje[index],
                        lancado: true,
                        pagamento: aVistaSelecionado ? 'avista' : 'aprazo',
                        quantidade: parseFloat(QuantidadeEditado),
                        custo: CalcularTotal(),
                        total: parseFloat(precoEditado),
                        fornecedor: fornecedor
                    };

                    console.log(novoLancamentoHoje)
                    await FazerLancamento(novoLancamentoHoje)
                    EnviarMsg();
                    handleClose();
                    setFornecedor('');

                } else {
                    console.error('Produto não encontrado no array JSON.');
                }
            }
        }




    };

    const CalcularTotal = () => {
        const quantidade = parseFloat(QuantidadeEditado)
        const preco = parseFloat(precoEditado)

        const total = preco / quantidade

        return formatarValorMonetario(total.toFixed(2).toString())
    };

    const LancarFinanceiro = async () => {
        const financeiro: Json11 = {
            valorInicial: valorInicial,
            lanche: lanche,
            combustivel: combustivel,
            troco: troco,
            descrcaoOutros1: descrcaoOutros1,
            outros1: outros1,
            descrcaoOutros2: descrcaoOutros2,
            outros2: outros2,
            descrcaoOutros3: descrcaoOutros3,
            outros3: outros3,
        }
        await InserirFinanceiro(financeiro)
        EnviarMsg();
        console.log(financeiro)
    }

    const removeZerosEsquerda = (value: string) => {
        return value.replace(/^0+/, '') || '0';
    };
    const sanitizeString = (inputString: string) => {
        const dangerousChars = /[\0\x08\x09\x1a\n\r"'\\\%]/g;

        const sanitizedString = inputString.replace(dangerousChars, '');

        return sanitizedString;
    }

    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '100%', md: '100%' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        LANÇAMENTO CEASA
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography>Lançamento dia: {dayjs().format('DD/MM/YYYY').toString()}</Typography>
                </Box>
                {produtoEditando !== undefined && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: 350, md: 500 }, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, }}>
                            <Box display={'flex'} sx={{ flexDirection: { xs: 'column', md: 'row' } }} alignItems={'center'} justifyContent={'center'} mb={2}>
                                <Box style={{ width: 150, height: 250, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'} mr={1}>
                                    <Image src={`/images/${produtoEditando.titulo}.png`} alt="Ibs-Logo" width={50} height={50} style={{ marginBottom: '10px', margin: 20 }} />
                                    <Box style={{ margin: 0, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                        <Typography textAlign={'center'} variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>{produtoEditando.titulo}</Typography>
                                    </Box>
                                    <Typography m={1} textAlign={'center'}>Quantidade Pedida:</Typography>
                                    <Typography fontSize={30} color={'green'} fontWeight={700}>{produtoEditando.quantidade}</Typography>
                                </Box>
                                <Box style={{ width: 320, height: 250, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'}>

                                    <TextField id="outlined-basic" label="Quantidade" variant="outlined" value={QuantidadeEditado} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => setQuantidadeEditado(removeZerosEsquerda(e.target.value))} />
                                    <TextField id="outlined-basic" label="Valor Total" variant="outlined" value={precoEditado} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setprecoEditado(removeZerosEsquerda(e.target.value)); console.log(fornecedor) }} />
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                        <Box display={'flex'} flexDirection={'column'}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={aVistaSelecionado} onChange={() => handleSelecionarPagamento('avista')} />}
                                                    label="A vista"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox checked={aPrazoSelecionado} onChange={() => handleSelecionarPagamento('aprazo')} />}
                                                    label="A prazo"
                                                />
                                            </FormGroup>
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                            <Typography m={1} textAlign={'center'}>Custo Un:</Typography>
                                            <Typography fontSize={20} color={'green'} fontWeight={700}>{CalcularTotal()}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {aPrazoSelecionado && (
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'} mb={2}>
                                    <Box sx={{ width: { xs: 300, md: 450 }, height: 150, padding: { xs: 1, md: 1 }, backgroundColor: 'white' }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                        <Typography m={1} textAlign={'center'}>Selecione o fornecedor:</Typography>
                                        <Box display={'flex'} flexDirection={'row'} >
                                            <FormGroup>
                                                <Select sx={{ width: { xs: 250, md: 400 }, margin: { xs: 1, md: 1 } }} value={fornecedor} onChange={(e) => setFornecedor(e.target.value)}>
                                                    <MenuItem
                                                        value=""
                                                    >OUTROS FORNECEDORES</MenuItem>
                                                    {fornecedores?.sort((a, b) => a.nome.localeCompare(b.nome))
                                                        .map((fornecedor, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={fornecedor.nome}
                                                            >{fornecedor.nome}</MenuItem>
                                                        ))}
                                                </Select>
                                            </FormGroup>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Typography textAlign={'center'} color={'red'}>{error}</Typography>
                            <Button variant="contained" style={{ backgroundColor: 'red', margin: 5 }} onClick={() => handleClose()}>
                                Sair
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }} onClick={() => FazerLancamentoNoBanco()}>
                                Salvar
                            </Button>

                        </Box>
                    </Modal>
                )}


                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {produtosPedido
                        ?.map(produto => (
                            <>
                                <Box style={{ width: 160, height: 250, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                    <Image src={`/images/${produto.titulo}.png`} alt="Ibs-Logo" width={50} height={50} style={{ marginBottom: '10px', margin: 20 }} />
                                    <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                        <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>{produto.titulo}</Typography>
                                    </Box>
                                    <Typography m={1}>Quantidade: {produto.quantidade}</Typography>
                                    {LancamentoHoje && LancamentoHoje.find(item => item.titulo === produto.titulo)?.lancado === true ? (
                                        <Button variant="contained" style={{ backgroundColor: 'orange', margin: 5 }} onClick={() => { setProdutoEditando(produto); setError(''); handleOpen(produto); }}>
                                            Editar
                                        </Button>
                                    ) : (
                                        <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }} onClick={() => { setProdutoEditando(produto); setQuantidadeEditado('0'); setprecoEditado('0'); setAPrazoSelecionado(false); setAVistaSelecionado(false); setError(''); handleOpen(produto); }}>
                                            Lançar
                                        </Button>
                                    )}
                                </Box>
                            </>
                        ))}
                </Grid>

                {!loading && (
                    <>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} mb={2}>
                            <Box style={{ padding: 5, backgroundColor: 'white', width: 350 }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Typography m={1} textAlign={'center'}>Financeiro:</Typography>
                                <Box style={{ padding: 5, backgroundColor: 'white', width: 310, margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                    <Typography m={1} textAlign={'center'}>Valor inicial(Dinheiro):</Typography>
                                    <TextField id="outlined-basic" label="Valor Inicial" variant="outlined" value={valorInicial} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setValorInicial(removeZerosEsquerda(e.target.value)) }} />
                                </Box>
                                <Box style={{ padding: 5, backgroundColor: 'white', width: 310, margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'} alignItems={'flex-start'}>
                                    <Typography m={1} textAlign={'center'}>Lanche:</Typography>
                                    <TextField id="outlined-basic" label="Lanche" variant="outlined" value={lanche} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setLanche(removeZerosEsquerda(e.target.value)) }} />
                                    <Typography m={1} textAlign={'center'}>Combustivel:</Typography>
                                    <TextField id="outlined-basic" label="Combustivel" variant="outlined" value={combustivel} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setCombustivel(removeZerosEsquerda(e.target.value)) }} />
                                    <Typography m={1} textAlign={'center'}>Troco:</Typography>
                                    <TextField id="outlined-basic" label="Troco" variant="outlined" value={troco} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setTroco(removeZerosEsquerda(e.target.value)) }} />
                                </Box>
                                <Box style={{ padding: 5, backgroundColor: 'white', width: 310, margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                    <Typography m={1} textAlign={'center'}>Outros:</Typography>

                                    <Box display={'flex'} flexDirection={'row'}>
                                        <TextField id="outlined-basic" label="Descrição" variant="outlined" value={descrcaoOutros1} style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { setDescrcaoOutros1(sanitizeString(e.target.value)) }} />
                                        <TextField id="outlined-basic" label="Valor" variant="outlined" value={outros1} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setoutros1(removeZerosEsquerda(e.target.value)) }} />
                                    </Box>
                                    <Box display={'flex'} flexDirection={'row'}>
                                        <TextField id="outlined-basic" label="Descrição" variant="outlined" value={descrcaoOutros2} style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { setDescrcaoOutros2(sanitizeString(e.target.value)) }} />
                                        <TextField id="outlined-basic" label="Valor" variant="outlined" value={outros2} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setoutros2(removeZerosEsquerda(e.target.value)) }} />
                                    </Box>
                                    <Box display={'flex'} flexDirection={'row'}>
                                        <TextField id="outlined-basic" label="Descrição" variant="outlined" value={descrcaoOutros3} style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { setDescrcaoOutros3(sanitizeString(e.target.value)) }} />
                                        <TextField id="outlined-basic" label="Valor" variant="outlined" value={outros3} style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { setoutros3(removeZerosEsquerda(e.target.value)) }} />
                                    </Box>
                                </Box>
                                <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }} onClick={() => { LancarFinanceiro() }}>
                                    Salvar
                                </Button>
                            </Box>

                        </Box>

                    </>
                )}

                {loading && (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </ProtectedRouts>
    );
}
