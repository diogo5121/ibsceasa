import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { BiPlus, BiSearch } from 'react-icons/bi';
import { RiSubtractFill } from "react-icons/ri";
import { ConsultarProduto, ConsultarTabelaCeasa, JogarPedido, Root3 } from '@/components/Api';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import '@/app/globals.css'
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import Image from 'next/image';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Loja5() {
    const [loading, setLoading] = useState(true);
    const [produtosceasaTotal, setProdutosCeasaTotal] = useState<Root3>();
    const [botaoloading, setBotaoloading] = useState(false);
    const [custosProdutos, setCustosProdutos] = useState<{ titulo: string; custo: string; quantidade: number, status: string }[]>([]);
    const route = useRouter()
    const [search, setSearch] = useState('');

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
                const custos: { titulo: string; custo: string; quantidade: number, status: string }[] = [];
                for (const anuncio of produtosceasaTotal.message.filter(produto => produto.status === 'ativo')) {
                    try {
                        const custo = await consultarCusto(anuncio.codigo);
                        custos.push({ titulo: anuncio.titulo, custo, quantidade: 0, status: anuncio.status });
                    } catch {
                        console.log('PRODUTO NÃO ENCONTRADO', anuncio.titulo);
                    }
                }
                setCustosProdutos(custos);
                setLoading(false);
            }
        };
        consultarTodosCustos();
    }, [produtosceasaTotal]);

    const consultarCusto = async (codigo: string): Promise<string> => {
        const produto = await ConsultarProduto(codigo);
        const ValorMonetario = formatarValorMonetario(produto?.preco.info.custonotafiscal.toString());
        return ValorMonetario;
    };

    const handleSubtractQuantity = (titulo: string) => {
        const updatedProdutos = [...custosProdutos];
        const index = updatedProdutos.findIndex(produto => produto.titulo === titulo);
        if (index !== -1 && updatedProdutos[index].quantidade > 0) {
            updatedProdutos[index].quantidade -= 1;
            setCustosProdutos(updatedProdutos);
        }
    };

    const handleQuantityChange = (e: string, titulo: string) => {
        const updatedProdutos = [...custosProdutos];
        const index = updatedProdutos.findIndex(produto => produto.titulo === titulo);
        if (index !== -1) {
            const newQuantity = parseInt(e, 10);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                updatedProdutos[index].quantidade = newQuantity;
                setCustosProdutos(updatedProdutos);
            }
        }
    };


    const handleAddQuantity = (titulo: string) => {
        const updatedProdutos = [...custosProdutos];
        const index = updatedProdutos.findIndex(produto => produto.titulo === titulo);
        if (index !== -1) {
            updatedProdutos[index].quantidade += 1;
            setCustosProdutos(updatedProdutos);
        }
    };
    const totalPedido = custosProdutos.reduce((total, produto) => {
        return total + parseFloat(produto.custo.replace("R$", "").replace(",", ".")) * produto.quantidade;
    }, 0).toFixed(2);

    const totalPedidoFormatado = formatarValorMonetario(totalPedido)

    const LançarPedido = async () => {
        try{
            await JogarPedido(5, JSON.stringify(custosProdutos))
            toast.success('Pedido enviado com sucesso ')
            route.push('/')
        }catch(err) {
            toast.error('Não foi possível enviar o pedido')
        }

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
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <FormControl variant="outlined">
                        <OutlinedInput
                            onChange={(e) => { setSearch(e.target.value) }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton color="inherit">
                                        <BiSearch />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {custosProdutos
                        .filter(produto =>
                            produto.titulo.toLowerCase().includes(search.toLowerCase())
                        )
                        .sort((a, b) => a.titulo.localeCompare(b.titulo))
                        .filter(produto => produto.status === 'ativo')
                        .map((produto, index) => (
                            <Box key={index} style={{ width: 160, height: 250, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Image src={`/images/${produto.titulo}.png`} alt="Ibs-Logo" width={50} height={50} style={{ marginBottom: '10px', margin: 20 }} />
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} textAlign='center' style={{ fontSize: 15, fontWeight: 700 }}>{produto.titulo}</Typography>
                                </Box>
                                <Typography>Custo: {produto.custo}</Typography>
                                <Box style={{ margin: 1 }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                                    <IconButton color="inherit" aria-label="subtract" onClick={() => handleSubtractQuantity(produto.titulo)}>
                                        <RiSubtractFill />
                                    </IconButton>
                                    <TextField size='small' type='number' value={produto.quantidade.toString()} onChange={(e) => { handleQuantityChange(e.target.value, produto.titulo); console.log() }} style={{ padding: 0 }} />
                                    <IconButton color="inherit" aria-label="add" onClick={() => handleAddQuantity(produto.titulo)}>
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
                    <Button variant="contained" style={{ margin: 15, padding: 2, backgroundColor: 'green' }} onClick={() => LançarPedido()} disabled={loading}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Realizar pedido
                            </Typography>
                        </Box>
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </ProtectedRouts>
    );
}
