import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { ConsultarTabelaPedidos, InserirConferencia, Message4, conferencia } from '@/components/Api';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Image from 'next/image';
import '@/app/globals.css'

export default function Loja2() {
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState<Message4[]>([]);
    const [produtosConferidos, setProdutosConferidos] = useState<conferencia[]>([]);
    const [QuantidadeDeProdututos, setQuantdeprodutos] = useState(0);
    const route = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const pedidos = await ConsultarTabelaPedidos('pedidos');
            const dataHoje = dayjs().subtract(1, 'days').format('YYYY-MM-DD');
            const pedidosOntem = pedidos?.message.filter(pedido => {
                return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
            });
            const pedidoLoja = pedidosOntem.filter(pedido => pedido.loja === 2)
            setPedidos(pedidoLoja);
            setQuantdeprodutos(pedidoLoja[0].json.filter(produto => produto.quantidade != 0).length)
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleConferirProduto = (produtoId: string, quantidadee: string) => {
        const quantidade = parseFloat(quantidadee);
        const produtoIndex = produtosConferidos.findIndex(produto => produto.titulo === produtoId);
        if (produtoIndex !== -1) {
            const novosProdutosConferidos = [...produtosConferidos];
            novosProdutosConferidos[produtoIndex].quantidade = quantidade;
            setProdutosConferidos(novosProdutosConferidos);
        } else {
            const produtoConferido = {
                titulo: produtoId,
                quantidade: quantidade
            };
            setProdutosConferidos(prevState => [...prevState, produtoConferido]);
        }
    };


    const handleRealizarConferencia = () => {
        setLoading(true)
        InserirConferencia(2, produtosConferidos)
        route.push('/')
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
                        Loja 2
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography>Conferencia do dia: {dayjs().format('DD/MM/YYYY').toString()}</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mt={2}>
                    <Typography>Produtos Pedido:</Typography>
                </Box>

                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {pedidos[0]?.json
                        .sort((a, b) => a.titulo.localeCompare(b.titulo))
                        .filter(produto => produto.quantidade != 0)
                        .filter(produto => produto.status === 'ativo')
                        .map((produto, index) => (
                            <Box key={index} style={{ width: 160, height: 250, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Image src={`/images/${produto.titulo}.png`} alt="Ibs-Logo" width={50} height={50} style={{ marginBottom: '10px', margin: 20 }} />
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} textAlign='center' style={{ fontSize: 15, fontWeight: 700 }}>{produto.titulo}</Typography>
                                </Box>
                                <Box style={{ margin: 1 }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                                    <TextField id="outlined-basic" label="Quantidade" variant="outlined" size='small' type='number' placeholder='Quantidade' onChange={(e) => handleConferirProduto(produto.titulo, e.target.value)} style={{ padding: 0 }} />
                                </Box>
                            </Box>
                        ))}
                </Grid>

                {loading && (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                )}

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant='body1' component="h1" textAlign={'center'} color={'red'} m={2} fontWeight={500}>
                            CONFIRA TODOS OS PRODUTOS, SE NAO RECEBEU NENHUMA QUANTIDADE DIGITE 0
                        </Typography>
                    </Box>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Button variant="contained" style={{ margin: 15, padding: 2, backgroundColor: 'green' }} onClick={handleRealizarConferencia} disabled={loading || !(QuantidadeDeProdututos === produtosConferidos.length)}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Realizar conferencia
                            </Typography>
                        </Box>
                    </Button>
                </Box>
            </Box>
        </ProtectedRouts>
    );
}
