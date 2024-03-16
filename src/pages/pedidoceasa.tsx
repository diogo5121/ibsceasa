'use client'
import { use, useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import { ConsultarTabelaPedidos, Root4 } from '@/components/Api';
import dayjs from 'dayjs';

export default function PedidoCeasa() {
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
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });

    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        Escolha uma loja:
                    </Typography>
                </Box>
                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pedidosHoje?.filter(pedido => pedido.loja === 1).length === 1 ? (
                        <>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/pedidoceasa/loja1')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        LOJA 1 - MATRIZ
                                    </Typography>
                                </Box>
                            </Button>
                        </>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 2).length === 1 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 2 - Catamarã
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 3).length === 1 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 3 - Cabo
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 4).length === 1 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 5 - Vila Social
                                </Typography>
                            </Box>
                        </Button>
                    )}
                    {pedidosHoje?.filter(pedido => pedido.loja === 5).length === 1 ? (
                        <></>
                    ) : (
                        <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }}>
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                    Loja 7 - Mega Verde
                                </Typography>
                            </Box>
                        </Button>
                    )}

                </Grid>
            </Box>
        </ProtectedRouts>
    );
}