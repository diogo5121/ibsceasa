import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { BiPlus } from 'react-icons/bi';
import { RiSubtractFill } from "react-icons/ri";
import { ConsultarProduto, ConsultarTabelaCeasa, ConsultarTabelaPedidos, JogarPedido, Root3 } from '@/components/Api';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import '@/app/globals.css'
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function EditLoja5() {
    const [loading, setLoading] = useState(true);
    const [produtosceasaTotal, setProdutosCeasaTotal] = useState<Root3>();
    const [botaoloading, setBotaoloading] = useState(false);
    const [custosProdutos, setCustosProdutos] = useState<{ titulo: string; custo: string; quantidade: number, status: string }[]>([]);
    const route = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const produtosceasa = await ConsultarTabelaCeasa('produtosceasa');
            setProdutosCeasaTotal(produtosceasa);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const consultarTodosCustos = async () => {
            if (produtosceasaTotal) {
                setLoading(true);
                const pedidos = await ConsultarTabelaPedidos('pedidos')
                const dataHoje = dayjs().format('YYYY-MM-DD');
                const pedidosHoje = pedidos?.message.filter(pedido => {
                    return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
                });
                const pedidoDigitado = pedidosHoje?.filter(pedids => pedids.loja === 5)[0].json

                setCustosProdutos(pedidoDigitado);
                setLoading(false);
            }
        };
        consultarTodosCustos();
    }, [produtosceasaTotal]);

    const handleSubtractQuantity = (index: number) => {
        const updatedProdutos = [...custosProdutos];
        if (updatedProdutos[index].quantidade > 0) {
            updatedProdutos[index].quantidade -= 1;
            setCustosProdutos(updatedProdutos);
        }
    };

    const handleQuantityChange = (e: string, index: number) => {
        const updatedProdutos = [...custosProdutos];
        const newQuantity = parseInt(e);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updatedProdutos[index].quantidade = newQuantity;
            setCustosProdutos(updatedProdutos);
        }
    };

    const handleAddQuantity = (index: number) => {
        const updatedProdutos = [...custosProdutos];
        updatedProdutos[index].quantidade += 1;
        setCustosProdutos(updatedProdutos);
    };
    const totalPedido = custosProdutos.reduce((total, produto) => {
        return total + parseFloat(produto.custo.replace("R$", "").replace(",", ".")) * produto.quantidade;
    }, 0).toFixed(2);

    const totalPedidoFormatado = formatarValorMonetario(totalPedido)

    const LançarPedido = async () => {
        setBotaoloading(true)
        await JogarPedido(5, JSON.stringify(custosProdutos))
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
                        Loja 7
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography>Pedido do dia: {dayjs().format('DD/MM/YYYY').toString()}</Typography>
                </Box>

                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {custosProdutos
                        .sort((a, b) => a.titulo.localeCompare(b.titulo))
                        .filter(produto => produto.status === 'ativo')
                        .map((produto, index) => (
                            <Box key={index} style={{ width: 150, height: 200, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <img src='/images/ibs.png' alt="Ibs-Logo" style={{ width: '50px', marginBottom: '10px', margin: 20 }} />
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>{produto.titulo}</Typography>
                                </Box>
                                <Typography>Custo: {produto.custo}</Typography>
                                <Box style={{ margin: 1 }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                                    <IconButton color="inherit" aria-label="subtract" onClick={() => handleSubtractQuantity(index)}>
                                        <RiSubtractFill />
                                    </IconButton>
                                    <TextField size='small' type='number' value={produto.quantidade} onChange={(e) => { handleQuantityChange(e.target.value, index); console.log() }} style={{ padding: 0 }} />
                                    <IconButton color="inherit" aria-label="add" onClick={() => handleAddQuantity(index)}>
                                        <BiPlus />
                                    </IconButton>
                                </Box>
                                <Typography>Total: R$ {(parseFloat(produto.custo.replace("R$", "").replace(",", ".")) * produto.quantidade).toFixed(2)}</Typography>
                            </Box>
                        ))}
                </Grid>

                {loading && (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                )}

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant='body1' component="h1" mt={2} fontWeight={700} style={{ textAlign: 'center' }}>
                        Total do pedido:
                    </Typography>
                    <Typography variant='body1' component="h1" fontWeight={700} style={{ color: 'green', fontSize: 30 }}>
                        {totalPedidoFormatado}
                    </Typography>
                    <Button variant="contained" style={{ margin: 15, padding: 2, backgroundColor: 'green' }} onClick={() => LançarPedido()}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                EDITAR PEDIDO
                            </Typography>
                        </Box>
                    </Button>
                </Box>
            </Box>
        </ProtectedRouts>
    );
}
