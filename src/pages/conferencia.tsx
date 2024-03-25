'use client'
import { use, useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import { ConsultarTabelaConferencia, Root7 } from '@/components/Api';
import dayjs from 'dayjs';

export default function Conferencia() {
    const route = useRouter()
    const [conferencia, setconferencia] = useState<Root7>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const Puxatconferencia = async () => {
            setLoading(true)
            try {
                const conferencia = await ConsultarTabelaConferencia('conferencia')
                setconferencia(conferencia)
            } catch {
                console.log('SEM conferencia')
                setLoading(false)
            }
            setLoading(false)

        }
        Puxatconferencia()
    }, [])

    const dataHoje = dayjs().format('YYYY-MM-DD');
    const conferenciaHoje = conferencia?.message.filter(conferencia => {
        return dayjs(conferencia.data).format('YYYY-MM-DD') === dataHoje;
    });

    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '130vh', md: '100vh' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700} textAlign={'center'}>
                        Escolha uma loja para realizar a conferencia:
                    </Typography>
                </Box>
                {loading ? (
                    <>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <CircularProgress size={20} />
                        </Box>

                    </>
                ) : (
                    <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {conferenciaHoje?.filter(conferencia => conferencia.loja === 1).length === 1 ? (
                            <>
                            </>
                        ) : (
                            <>
                                <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/conferenciaceasa/loja1')}>
                                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                        <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                            LOJA 1 - MATRIZ
                                        </Typography>
                                    </Box>
                                </Button>
                            </>
                        )}
                        {conferenciaHoje?.filter(conferencia => conferencia.loja === 2).length === 1 ? (
                            <></>
                        ) : (
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/conferenciaceasa/loja2')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Loja 2 - Catamarã
                                    </Typography>
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(conferencia => conferencia.loja === 3).length === 1 ? (
                            <></>
                        ) : (
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/conferenciaceasa/loja3')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Loja 3 - Cabo
                                    </Typography>
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(conferencia => conferencia.loja === 4).length === 1 ? (
                            <></>
                        ) : (
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/conferenciaceasa/loja4')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Loja 5 - Vila Social
                                    </Typography>
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(conferencia => conferencia.loja === 5).length === 1 ? (
                            <></>
                        ) : (
                            <Button variant="contained" style={{ width: 300, height: 50, margin: 10, padding: 2, backgroundColor: 'green' }} onClick={() => route.push('/conferenciaceasa/loja5')}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Loja 7 - Mega Verde
                                    </Typography>
                                </Box>
                            </Button>
                        )}

                    </Grid>
                )}

            </Box>
        </ProtectedRouts>
    );
}