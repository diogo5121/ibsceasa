'use client'
import { use, useEffect, useState } from 'react';
import { ConsultarProduto, ObterFaturamento } from "@/components/Api";
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import { AutoGraphSharp, GraphicEqOutlined, MoneySharp, StoreSharp } from '@mui/icons-material';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import NavBarPages from '@/components/NavBarPages';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import "../app/globals.css";


interface Faturamento {
    somaValores: string
}
interface Data {
    date?: Date
}

export default function Precos() {

    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));


    useEffect(() => {
        const fetchData = async () => {
            const produto = await ConsultarProduto('15995')
            console.log(produto.preco.info.custonotafiscal)
        };
        fetchData();
    }, [selectedDate]);


    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        CONSULTA PREÇO:
                    </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box m={3} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                        <TextField id="codigo" label="Codigo interno ou de barras" variant="outlined" />
                    </Box>
                </LocalizationProvider>
                <Box padding={2} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} border={2} m={3}>
                    <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                        Produto:
                    </Typography>
                    <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                        VINHO QUINTA DO MORGADO 1L
                    </Typography>
                    <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                        Codigo de Barras:
                    </Typography>
                    <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                        789789789789
                    </Typography>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                Preço Custo
                            </Typography>
                            <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                                R$ 15,50
                            </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                Preço Venda
                            </Typography>
                            <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                                R$ 25,30
                            </Typography>
                        </Box>

                    </Box>
                    <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                        Margem:
                    </Typography>
                    <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                        30%
                    </Typography>
                </Box>
            </Box>
        </ProtectedRouts>
    );
}