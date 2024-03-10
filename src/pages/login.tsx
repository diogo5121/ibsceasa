'use client'
import { useRouter } from 'next/router';
import { Box, Button, Container, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { fazerLogin } from "@/components/Api";

export default function Login() {
    const [SenhaVisivel, setSenhaVisivel] = useState('password');
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

    const MostrarSenha = () => {
        if (SenhaVisivel === 'password') {
            setSenhaVisivel('text')
        } else {
            setSenhaVisivel('password')
        }
    }

    const FazerLogin = () => {
        setLoading(true)
        fazerLogin(login, senha, setLoading, seterro)

    }

    return (
        <Container>

            <Box display='flex' flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={{ xs: '100vh', md: '100vh' }}>
                <h1>Login</h1>
                <Input style={{ backgroundColor: 'white', padding: 10 }} placeholder="Login" type="text" onChange={(e) => { setlogin(e.target.value) }} />
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} alignItems={'center'}>
                    <Input style={{ backgroundColor: 'white', padding: 10 }} placeholder="Senha" type={SenhaVisivel} onChange={(e) => { setsenha(e.target.value) }} />
                </Box>
                <Button variant="contained" style={{ marginTop: 20, backgroundColor: 'green' }} onClick={FazerLogin} disabled={loading}>Fazer Login</Button>
                <a style={{ color: 'red' }}>{erro}</a>
            </Box>
        </Container>
    );
}
