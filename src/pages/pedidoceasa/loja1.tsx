'use client'
import { use, useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import "@/app/globals.css"
import { ArrowRight } from '@mui/icons-material';
import { BiPlus, BiSave } from 'react-icons/bi';
import { RiSubtractFill } from "react-icons/ri";


export default function Loja1() {

    useEffect(() => {
        const fetchData = async () => {
        };
        fetchData();
    }, []);




    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        Loja 1
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography>Faça o pedido: 15/03/2024</Typography>

                </Box>

                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    <Box style={{ width: 150, height: 200, margin: 10, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} border={1} borderColor={'gray'}>
                        <img src='/images/ibs.png' alt="Ibs-Logo" style={{ width: '50px', marginBottom: '10px', margin: 20 }} />
                        <Box style={{ margin: 1, padding: 5, backgroundColor: 'white' }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <Typography variant="h1" component="h1" fontWeight={700} style={{ fontSize: 15, fontWeight: 700 }}>ABACATE KG</Typography>
                        </Box>
                        <Typography>Custo: R$ 25,99</Typography>

                        <Box style={{ margin: 1 }} borderRadius={2} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'}>
                            <IconButton color="inherit" aria-label="add an alarm">
                                <RiSubtractFill />
                            </IconButton>
                            <TextField size='small' type='number' />
                            <IconButton color="inherit" aria-label="add an alarm">
                                <BiPlus />
                            </IconButton>
                        </Box>
                        <Typography>Total: R$ 250,50</Typography>
                    </Box>
                </Grid>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant='body1' component="h1" mt={2} fontWeight={700}>
                        Total do pedido: 
                    </Typography>
                    <Typography variant='body1' component="h1" fontWeight={700} style={{color: 'green', fontSize: 30}}>
                        R$ 5854,00
                    </Typography>
                    <Button variant="contained" style={{ margin: 15, padding: 2, backgroundColor: 'green' }}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Realizar pedido
                            </Typography>
                        </Box>
                    </Button>

                </Box>

            </Box>
        </ProtectedRouts>
    );
}