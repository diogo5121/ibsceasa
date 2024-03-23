import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { ConsultarProduto, ConsultarTabelaCeasa, ConsultarTabelaLancamentos, ConsultarTabelaPedidos, FazerLancamento, JogarPedido, Json, Lancamento, Root3 } from '@/components/Api';
import '@/app/globals.css'
import dayjs from 'dayjs';
import Image from 'next/image';
import { gerarTodasLojas } from '@/utils/Relatorios';

export default function Lancamentos() {
    const [loading, setLoading] = useState(true);
    const [produtosPedido, setProdutosPedidos] = useState<Json[]>();
    const [produtoEditando, setProdutoEditando] = useState<Json>();
    const [LancamentoHoje, setLancamentosHoje] = useState<Lancamento[]>();
    const [open, setOpen] = useState(false);


    const handleOpen = () => {
        console.log('aberto')
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setProdutoEditando(undefined);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const produtosceasa = await gerarTodasLojas(2);
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
                            lancado: false
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
                        lancado: false
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
    }, []);

    const FiltrarProduto = (titulo: string) => {
        const produto1 = LancamentoHoje?.filter(produto1 => produto1.titulo === titulo)

        return produto1
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
                                    <TextField id="outlined-basic" label="Quantidade" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="number" />
                                    <TextField id="outlined-basic" label="Valor Total" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="number" />
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                        <Box display={'flex'} flexDirection={'column'}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox />} label="A vista" />
                                                <FormControlLabel control={<Checkbox />} label="A prazo" />
                                            </FormGroup>
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                            <Typography m={1} textAlign={'center'}>Custo Un:</Typography>
                                            <Typography fontSize={20} color={'green'} fontWeight={700}>R$</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Button variant="contained" style={{ backgroundColor: 'red', margin: 5 }} onClick={() => handleClose()}>
                                Sair
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }}>
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
                                        <Button variant="contained" style={{ backgroundColor: 'orange', margin: 5 }} onClick={() => { handleOpen(); setProdutoEditando(produto) }}>
                                            LANÇADO
                                        </Button>
                                    ) : (
                                        <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }} onClick={() => { handleOpen(); setProdutoEditando(produto) }}>
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
