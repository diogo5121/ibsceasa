'use client'
import { use, useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Grid, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import { ConsultarTabelaPedidos, Root4 } from '@/components/Api';
import dayjs from 'dayjs';
import { BiPencil } from 'react-icons/bi';
import { formatarValorMonetario } from '@/utils/ReformularValor';

export default function editarpedido() {
    const route = useRouter()
    const [pedidos, setpedidos] = useState<Root4>()

    useEffect(() => {
        const PuxatPedidos = async () => {
            try {
                const pedidos = await ConsultarTabelaPedidos('pedidos')
                setpedidos(pedidos)
            } catch {
                console.log('SEM PEDIDOS')
            }

        }
        PuxatPedidos()
    }, [])

    const dataHoje = dayjs().format('YYYY-MM-DD');
    const dataHoje2 = dayjs().format('DD/MM/YYYY');
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });
    const calcularTotalPedido = (loja : number) => {
        let total = 0;
        const pedidoloja = pedidosHoje?.filter(pedido => pedido.loja === loja)[0].json
        pedidoloja?.forEach(pedido => {
            const custoNumerico = parseFloat(pedido.custo.replace('R$', '').replace(',', '.'));
            total += custoNumerico * pedido.quantidade;
        });
        return formatarValorMonetario(total.toFixed(2))
    };

    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        EDITAR PEDIDOS
                    </Typography>
                    <BiPencil size={30}/>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={400} fontSize={20}>
                        Pedidos do dia: {dataHoje2}
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'} mt={7}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={400} fontSize={20}>
                        Escolha um pedido:
                    </Typography>
                </Box>
                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pedidosHoje?.filter(pedido => pedido.loja === 1).length === 0 ? (
                        <>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/editarpedido/editloja1')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        LOJA 1 - MATRIZ - {calcularTotalPedido(1)}
                                    </Typography>
                                </Box>
                            </Button>
                        </>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 2).length === 0 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/editarpedido/loja2')}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 2 - Catamarã - {calcularTotalPedido(2)}
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 3).length === 0 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/editarpedido/loja3')}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 3 - Cabo - {calcularTotalPedido(3)}
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 4).length === 0 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/editarpedido/loja4')}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 5 - Vila Social- {calcularTotalPedido(4)}
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 5).length === 0 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/editarpedido/loja5')}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 7 - Mega Verde- {calcularTotalPedido(5)}
                                </Typography>
                            </Box>
                        </Button>
                    )}

                </Grid>
            </Box>
        </ProtectedRouts>
    );
}