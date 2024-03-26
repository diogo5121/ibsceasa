import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { ConsultarProduto, ConsultarTabelaCeasa, ConsultarTabelaFornecedor, ConsultarTabelaLancamentos, ConsultarTabelaPedidos, FazerLancamento, JogarPedido, Json, Lancamento, Message10, Root3 } from '@/components/Api';
import '@/app/globals.css'
import dayjs from 'dayjs';
import Image from 'next/image';
import { gerarTodasLojas } from '@/utils/Relatorios';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import { EnviarMsg, WebSocketExample } from '@/components/Soket';

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
        //handleClose();

        const consultaFornecedores = async () => {
            const fornecedores = await ConsultarTabelaFornecedor('fornecedor')
            setFornecedores(fornecedores.message)
        }
        consultaFornecedores();
    }, [atualizar]);

    const FazerLancamentoNoBanco = async () => {
        console.log('FazerLancamento');
        const index: number = LancamentoHoje?.findIndex(lancamento => lancamento.titulo === produtoEditando?.titulo) ?? -1;



        if (aVistaSelecionado === false && aPrazoSelecionado === false) {
            setError('Não foi selecionado o tipo de pagamento')
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
                        quantidade: parseInt(QuantidadeEditado),
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

    const removeZerosEsquerda = (value: string) => {
        return value.replace(/^0+/, '') || '0';
    };

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
                        <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, }}>
                            <Box display={'flex'} flexDirection={'row'} mb={2}>
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
                                    <Box style={{ width: 450, height: 150, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                        <Typography m={1} textAlign={'center'}>Selecione o fornecedor:</Typography>
                                        <Box display={'flex'} flexDirection={'row'} >
                                            <FormGroup>
                                                <Select style={{ width: 400, margin: 2 }} value={fornecedor} onChange={(e) => setFornecedor(e.target.value)}>
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

                {loading && (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </ProtectedRouts>
    );
}
