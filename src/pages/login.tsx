'use client'
import { useRouter } from 'next/router';
import { Box, Button, CircularProgress, Container, Input, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fazerLogin } from "@/components/Api";
import "../app/globals.css";

export default function Login() {
    const [senha, setsenha] = useState('');
    const [login, setlogin] = useState('');
    const [erro, seterro] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const KeyLocal = localStorage?.getItem('token');

        const VerificarLogado = () => {
            if (KeyLocal) {
                router.push('/');
            }
        }
        VerificarLogado()
    }, [])

    const FazerLogin = () => {
        setLoading(true)
        fazerLogin(login, senha, setLoading, seterro)

    }

    return (
        <main>
            <Box display='flex' flexDirection={'column'} alignItems={'center'} justifyContent={'center'} bgcolor={'#e3e1e1'} height={'100vh'}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} bgcolor={'white'} p={4} borderRadius={5} sx={{ boxShadow: 3 }}>
                    <img src='/images/ibs.png' alt="Ibs-Logo" style={{ width: '180px', marginBottom: '10px' }} />
                    <h1>Login</h1>
                    <TextField id="outlined-basic" label="Usuario" variant="outlined" style={{ backgroundColor: 'white', margin: 20 }} type="text" onChange={(e) => { setlogin(e.target.value) }} />
                    <TextField id="outlined-basic" label="Senha" variant="outlined" style={{ backgroundColor: 'white' }} type='password' onChange={(e) => { setsenha(e.target.value) }} />
                    <Button variant="contained" style={{ marginTop: 20, backgroundColor: 'green' }} onClick={FazerLogin} disabled={loading}>Fazer Login</Button>
                    {loading && (
                        <CircularProgress color="success" style={{marginTop: 20}} />
                    )}
                    {erro === '' ? (
                        <></>
                    ) : (
                        <a style={{ color: 'red', margin: 10 }}>{erro}</a>
                    )}
                </Box>
            </Box>
        </main>

    );
}
