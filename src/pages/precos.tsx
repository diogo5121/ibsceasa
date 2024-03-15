'use client'
import { use, useEffect, useState } from 'react';
import { ConsultarProduto, ObterFaturamento, Root } from "@/components/Api";
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import { AutoGraphSharp, GraphicEqOutlined, MoneySharp, Search, StoreSharp } from '@mui/icons-material';
import { formatarValorMonetario } from '@/utils/ReformularValor';
import NavBarPages from '@/components/NavBarPages';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import "../app/globals.css";
import { calcularMargem } from '@/utils/CalcularMargem';



export default function Precos() {
    const [codigo, setcodigo] = useState('');
    const [codigoDigitado, setcodigoDigitado] = useState('');
    const [erro, seterro] = useState('');
    const [loading, setLoading] = useState(false);
    const [produto, setProduto] = useState<Root>()

    useEffect(() => {
        7
        setLoading(true)
        const fetchData = async () => {
            if (codigo === '') {
                setLoading(false)
            } else {
                try {
                    const produto = await ConsultarProduto(codigo)
                    setProduto(produto)
                    seterro('')
                    setLoading(false)
                } catch {
                    seterro('Digite um codigo valido!')
                    setLoading(false)
                }

            }
        };

        fetchData();
    }, [codigo]);

    const SetarCodigo = () => {
        setcodigo(codigoDigitado)
        setcodigoDigitado('')

    }


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
                        <TextField id="codigo" label="Codigo interno ou de barras" value={codigoDigitado} variant="outlined" onChange={(e) => setcodigoDigitado(e.target.value)} />
                        <Button variant="contained" style={{ backgroundColor: 'green', margin: 7 }} onClick={() => SetarCodigo()}><Search /></Button>
                    </Box>
                </LocalizationProvider>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} m={1}>
                    <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16, color: 'red' }}>
                        {erro}
                    </Typography>
                </Box>
                {loading ? (
                    <>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <CircularProgress />
                        </Box>
                    </>
                ) : (
                    <>
                        {erro === '' ? (
                            <>

                                {produto === undefined ? (
                                    <></>
                                ) : (
                                    <Box padding={2} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} border={2} m={3}>
                                        <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                            Produto:
                                        </Typography>
                                        <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                                            {produto?.produto.info.descrresproduto}
                                        </Typography>
                                        <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                            Codigo de Barras:
                                        </Typography>
                                        <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                                            {produto?.produto.info.nrcodbarprod}
                                        </Typography>
                                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                                <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                                    Preço Custo
                                                </Typography>
                                                <Typography variant="h6" component="h1" m={0} fontWeight={700} style={{ fontSize: 16, color: 'orange' }}>
                                                    {formatarValorMonetario(produto?.preco.info.custonotafiscal.toString())}
                                                </Typography>
                                            </Box>
                                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                                <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                                    Preço Venda
                                                </Typography>
                                                <Typography variant="h6" component="h1" m={0} fontWeight={700} style={{ fontSize: 16, color: 'green' }}>
                                                    {formatarValorMonetario(produto?.preco.info.valprecovarejo.toString())}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                            Margem:
                                        </Typography>
                                        <Typography variant="h6" component="h1" m={0} style={{ fontSize: 16 }}>
                                            {calcularMargem(produto?.preco.info.valprecovarejo, produto?.preco.info.custonotafiscal)}
                                        </Typography>
                                        {produto?.preco.info.valpromvarejo === 0 ? (
                                            <></>
                                        ) : (
                                            <>
                                                <Typography variant="h6" component="h1" mt={5} fontWeight={700}>
                                                    PROMOÇÃO:
                                                </Typography>
                                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} border={2} p={2}>
                                                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                                        <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                                            Margem Promoção
                                                        </Typography>
                                                        <Typography variant="h6" component="h1" m={0} fontWeight={700} style={{ fontSize: 16, color: 'orange' }}>
                                                            {calcularMargem(produto?.preco.info.valpromvarejo, produto?.preco.info.custonotafiscal)}
                                                        </Typography>
                                                    </Box>
                                                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                                        <Typography variant="h6" component="h1" m={1} fontWeight={700}>
                                                            Preço Venda
                                                        </Typography>
                                                        <Typography variant="h6" component="h1" m={0} fontWeight={700} style={{ fontSize: 16, color: 'green' }}>
                                                            {formatarValorMonetario(produto?.preco.info.valpromvarejo.toString())}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}


                                    </Box>
                                )}
                            </>
                        ) : (
                            <>


                            </>
                        )}



                    </>
                )}


            </Box>
        </ProtectedRouts>
    );
}