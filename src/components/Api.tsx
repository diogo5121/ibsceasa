import axios from 'axios';
import dayjs from 'dayjs';


interface LoginResponse {
    access_token: string;
}

export async function fazerLogin(
    usuario: string,
    senha: string,
    setLoading: (loading: boolean) => void,
    seterro: (erro: string) => void
): Promise<string | null> {


    try {
        const response = await axios.post<LoginResponse>('http://45.164.8.122:30492/api/ciss/login', {
            usuario: usuario,
            senha: senha,
        });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token)

            const currentTime = dayjs().toString();



            localStorage.setItem('lastLogin', currentTime);



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

interface Faturamento {
    somaValores: string;
}

export async function ObterFaturamento(data: string, loja: string): Promise<Faturamento> {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post<Faturamento>('http://45.164.8.122:30492/api/ciss/faturamento', {
            token: token,
            data: data,
            empresa: loja,
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao obter faturamento:', error);
        throw error;
    }
}
