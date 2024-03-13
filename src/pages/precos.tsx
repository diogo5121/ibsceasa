'use client'
import { use, useEffect, useState } from 'react';
import { ObterFaturamento } from "@/components/Api";
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
            </Box>
        </ProtectedRouts>
    );
}