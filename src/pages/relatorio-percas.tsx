import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedRoutes from "@/components/ProtectedRoutes";
import { Box, FormControl, FormControlLabel, Checkbox, Typography, TextField, Table, TableCell, TableRow, TableHead, TableContainer, TableBody, Paper, Grid } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import dayjs from 'dayjs';
import "../app/globals.css";
import { ConsultarTabelaPercas, Message15 } from '@/components/Api';

export default function Produtos() {
    const [lojas, setLojas] = useState([
        { id: 1, nome: "Loja 1 - Matriz" },
        { id: 2, nome: "Loja 2 - Catamarã" },
        { id: 3, nome: "Loja 3 - Cabo" },
        { id: 4, nome: "Loja 5 - Vila Social" },
        { id: 5, nome: "Loja 7 - Mega Verde" }
    ]);
    const [valorInicialChecked, setValorInicialChecked] = useState([1, 2, 3, 4, 5]);
    const [dataInicial, setDataInicial] = useState(dayjs().format('YYYY-MM-DD'));
    const [dataFinal, setDataFinal] = useState(dayjs().format('YYYY-MM-DD'));
    const [percas, setPercas] = useState<Message15[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (id: number) => {
        if (valorInicialChecked.includes(id)) {
            setValorInicialChecked(valorInicialChecked.filter((item) => item !== id));
        } else {
            setValorInicialChecked([...valorInicialChecked, id]);
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await ConsultarTabelaPercas('percas');
                setPercas(response.message);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    const perdasNoPeriodo = percas
        .filter(item => valorInicialChecked.includes(item.lojaid))
        .filter((perca) => {
            const percaDate = dayjs(perca.data).format('YYYY-MM-DD');
            return percaDate >= dataInicial && percaDate <= dataFinal;
        });

    const valorTotalPerdas = perdasNoPeriodo.reduce((total, perca) => {
        return total + perca.percas.reduce((subtotal, item) => {
            return subtotal + parseFloat(item.custo.replace('R$', '').replace(',', '.')) * item.quantidade;
        }, 0);
    }, 0);

    return (
        <ProtectedRoutes>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '100%', md: '100%' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        RELATÓRIO DE PERDAS
                    </Typography>
                </Box>
                <Grid style={{border: '1px solid', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}} container>
                    <Grid item>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} m={5}>
                            <Typography variant="h5" component="h1" m={1} fontWeight={400} fontSize={20}>
                                Escolha as lojas:
                            </Typography>
                            <FormControl>
                                {lojas.map((loja) => (
                                    <FormControlLabel
                                        key={loja.id}
                                        control={
                                            <Checkbox
                                                checked={valorInicialChecked.includes(loja.id)}
                                                onChange={() => handleCheckboxChange(loja.id)}
                                            />
                                        }
                                        label={loja.nome}
                                    />
                                ))}
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <Typography variant="h5" component="h1" m={1} fontWeight={400} fontSize={20}>
                                Escolha o período:
                            </Typography>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                                <TextField
                                    id="dataInicial"
                                    label="Data Inicial"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={dataInicial}
                                    onChange={(e) => setDataInicial(e.target.value)}
                                />
                                <Typography variant="h5" component="h1" m={1} fontWeight={400} fontSize={20}>
                                    -
                                </Typography>
                                <TextField
                                    id="dataFinal"
                                    label="Data Final"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={dataFinal}
                                    onChange={(e) => setDataFinal(e.target.value)}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} mt={2}>
                    <Typography>Valor geral das perdas no período:</Typography>
                    <Typography style={{ fontSize: 25, color: 'red', fontWeight: 'bold' }}>{valorTotalPerdas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
                </Box>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} mt={2}>
                    <TableContainer component={Paper} style={{ maxWidth: 'calc(100vw - 30px)' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Custo</TableCell>
                                    <TableCell>Quantidade</TableCell>
                                    <TableCell>Valor Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {perdasNoPeriodo.map((perca, index) => (
                                    perca.percas
                                        .filter(perca => perca.quantidade != 0)
                                        .filter(perca => perca.quantidade != null)
                                        .map((item, i) => (
                                            <TableRow key={index + i}>
                                                <TableCell>{item.titulo}</TableCell>
                                                <TableCell>{item.custo}</TableCell>
                                                <TableCell>{item.quantidade}</TableCell>
                                                <TableCell>{(parseFloat(item.custo.replace('R$', '').replace(',', '.')) * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            </TableRow>
                                        ))
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

            </Box>
        </ProtectedRoutes>
    );
}

