'use client'
import { use, useEffect, useState } from 'react';
import { ObterFaturamento } from "@/components/Api";
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
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

export default function Faturamento() {
    const [loja1, setLoja1] = useState('');
    const [loja2, setLoja2] = useState('');
    const [loja3, setLoja3] = useState('');
    const [loja4, setLoja4] = useState('');
    const [loja5, setLoja5] = useState('');
    const [total, setTotal] = useState('');

    const [valorProgresso, setValorProgresso] = useState(0);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dataFormulada, setDataFormulada] = useState<Dayjs>(dayjs());


    useEffect(() => {
        const fetchData = async () => {
            try {
                setValorProgresso(0)
                const formattedDate = selectedDate;
                setValorProgresso(10)
                const response: Faturamento = await ObterFaturamento(formattedDate, '1');
                const somaValoresString = response.somaValores;
                setLoja1(formatarValorMonetario(somaValoresString))
                setValorProgresso(20)
                const response2: Faturamento = await ObterFaturamento(formattedDate, '2');
                const somaValoresString2 = response2.somaValores;
                setLoja2(formatarValorMonetario(somaValoresString2))
                setValorProgresso(40)
                const response3: Faturamento = await ObterFaturamento(formattedDate, '3');
                const somaValoresString3 = response3.somaValores;
                setLoja3(formatarValorMonetario(somaValoresString3))
                setValorProgresso(60)
                const response4: Faturamento = await ObterFaturamento(formattedDate, '5');
                const somaValoresString4 = response4.somaValores;
                setLoja4(formatarValorMonetario(somaValoresString4))
                setValorProgresso(80)
                const response5: Faturamento = await ObterFaturamento(formattedDate, '7');
                const somaValoresString5 = response5.somaValores;
                setLoja5(formatarValorMonetario(somaValoresString5))
                const valorTotal = parseFloat(somaValoresString) + parseFloat(somaValoresString2) + parseFloat(somaValoresString3) + parseFloat(somaValoresString4) + parseFloat(somaValoresString5)
                const ValorString = valorTotal.toString()
                setTotal(formatarValorMonetario(ValorString))
                setValorProgresso(100)

            } catch (error) {
                console.error('Erro ao obter faturamento:', error);
            }
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
                        FATURAMENTO DAS LOJAS:
                    </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box m={3} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                        <DatePicker
                            label='Escolha uma data'
                            onChange={(date: string | number | Date | null | undefined | Dayjs) => {
                                setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
                            }}
                            defaultValue={dayjs()}
                        />
                    </Box>
                </LocalizationProvider>
                {valorProgresso === 100 ? (
                    <>
                        <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>



                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'gray' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <StoreSharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Loja 1</Typography>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>Matriz</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{loja1}</Typography>
                                </Box>
                            </Box>
                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'gray' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <StoreSharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Loja 2</Typography>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>Catamarã</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{loja2}</Typography>

                                </Box>
                            </Box>
                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'gray' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <StoreSharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Loja 3</Typography>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>Cabo</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{loja3}</Typography>

                                </Box>
                            </Box>
                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'gray' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <StoreSharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Loja 5</Typography>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>Vila Social</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{loja4}</Typography>

                                </Box>
                            </Box>
                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'gray' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <StoreSharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Loja 7</Typography>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>Mega</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{loja5}</Typography>
                                </Box>
                            </Box>
                            <Box style={{ width: 140, height: 160, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Box style={{ margin: 10, padding: 5, backgroundColor: 'orange' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <MoneySharp />
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700 }}>Total:</Typography>
                                </Box>
                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'green' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 20, fontWeight: 700, color:'white' }}>{total}</Typography>

                                </Box>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <Box m={10} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress variant="determinate" value={valorProgresso} />
                        <a style={{ margin: 5, fontWeight: 700 }}>{valorProgresso}%</a>
                    </Box>

                )}
            </Box>
        </ProtectedRouts>
    );
}