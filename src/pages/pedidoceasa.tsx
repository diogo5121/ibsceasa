'use client'
import { use, useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import "../app/globals.css";

export default function PedidoCeasa() {



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
                        Pedido Ceasa:
                    </Typography>
                </Box>
                <Box m={3} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Selecione uma loja:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Selecione uma loja:"
                        >
                            <MenuItem value={1}>Loja 1 - Matriz</MenuItem>
                            <MenuItem value={2}>Loja 2 - Catamarã</MenuItem>
                            <MenuItem value={3}>Loja 3 - Cabo</MenuItem>
                            <MenuItem value={5}>Loja 5 - Vila Social</MenuItem>
                            <MenuItem value={7}>Loja 7 - Mega Verde</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </ProtectedRouts>
    );
}