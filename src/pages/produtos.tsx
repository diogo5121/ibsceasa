import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import { ConsultarProduto, ConsultarTabelaCeasa, ConsultarTabelaPedidos, JogarPedido, MudarStatus, Root3 } from '@/components/Api';
import '@/app/globals.css'
import Image from 'next/image';

export default function Produtos() {
    const [produtosceasaTotal, setProdutosCeasaTotal] = useState<Root3>();
    const [atualizar, setatualizar] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const produtosceasa = await ConsultarTabelaCeasa('produtosceasa');
            setProdutosCeasaTotal(produtosceasa);
        };
        fetchData();
    }, [atualizar]);

    const MudarStatusProduto = async (codigo: string) => {
        console.log(codigo)
        await MudarStatus(codigo)

        setatualizar(atualizar + 1)
    }


    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '100%', md: '100%' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        GERENCIAMENTO DE PRODUTOS
                    </Typography>
                </Box>

                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {produtosceasaTotal?.message
                        .sort((a, b) => a.titulo.localeCompare(b.titulo))
                        .map((produto, index) => (
                            <Box key={index} style={{ width: 150, height: 200, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                                <Image src='/images/ibs.png' alt="Ibs-Logo" width={50} height={50} style={{ marginBottom: '10px', margin: 20 }} />

                                <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700, textAlign: 'center' }}>{produto.titulo}</Typography>
                                </Box>
                                {produto.status === 'ativo' ? (
                                    <>
                                        <Button variant="contained" style={{ backgroundColor: 'green', margin: 5 }} onClick={() => { MudarStatusProduto(produto.codigo) }}>
                                            ATIVO
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="contained" style={{ backgroundColor: 'orange', margin: 5 }} onClick={() => { MudarStatusProduto(produto.codigo) }}>
                                            INATIVO
                                        </Button>
                                    </>
                                )}
                            </Box>
                        ))}
                </Grid>
            </Box>
        </ProtectedRouts>
    );
}
