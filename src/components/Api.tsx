import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface LoginResponse {
    access_token: string;
}

export async function fazerLogin(
    usuario: string,
    senha: string,
    setLoading: (loading: boolean) => void,
    seterro: (erro: string) => void
): Promise<string | null> {
    const ipApi = process.env.NODE_ENV

    
    try {
        const response = await axios.post<LoginResponse>('http://45.164.8.122:30492/api/ciss/login', {
            usuario: usuario,
            senha: senha,
        });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token)

            const currentTime = new Date().toISOString();



            localStorage.setItem('lastLoginTime', currentTime);



            window.location.reload()
            return response.data.access_token;
        } else {
            setLoading(false)
            seterro('Ocorreu algum erro, entre em contato com o suporte')
            return null;
        }
    } catch (error) {
        setLoading(false)
        console.error('Erro ao fazer login:', error);
        seterro('Usuario ou senha invalido')
        return null;
    }
}