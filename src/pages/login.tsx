import { Box, Button, Container, Input } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { fazerLogin } from "@/components/Api";

export default function Login() {
    const [SenhaVisivel, setSenhaVisivel] = useState('password')
    const [senha, setsenha] = useState('password')
    const [login, setlogin] = useState('password')
    const [erro, seterro] = useState('')
    const [loading, setLoading] = useState(false)

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
                <Input style={{ backgroundColor: 'white', padding: 10}} placeholder="Login" type="text" onChange={(e) => {setlogin(e.target.value)}}/>
                <Box display={'flex'} flexDirection={'row'} alignContent={'center'} alignItems={'center'}>
                    <Input style={{ backgroundColor: 'white', padding: 10 }} placeholder="Senha" type={SenhaVisivel} onChange={(e) => {setsenha(e.target.value)}}/>
                    <Box style={{ cursor: 'pointer' }} onClick={MostrarSenha}>
                        {SenhaVisivel === 'password' ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </Box>
                </Box>
                <Button variant="contained" style={{ marginTop: 20, backgroundColor: 'green' }} onClick={FazerLogin} disabled={loading}>Fazer Login</Button>
                <a style={{color:'red'}}>{erro}</a>
            </Box>
        </Container>
    );
}
