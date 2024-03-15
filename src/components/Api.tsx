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
            console.log(response)
            const currentTime = dayjs().toString();
            localStorage.setItem('lastLogin', currentTime);
            localStorage.setItem('nome', usuario);
            window.location.reload();
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

export interface Root {
    produto: Produto
    preco: Preco
  }
  
  export interface Produto {
    info: Info
  }
  
  export interface Info {
    idproduto: number
    idsubproduto: number
    descrcomproduto: string
    descrresproduto: string
    subdescricao: string
    nrcodbarprod: number
    iddivisao: number
    descrdivisao: string
    idsecao: number
    descrsecao: string
    idgrupo: number
    descrgrupo: string
    idsubgrupo: number
    descrsubgrupo: string
    embalagementrada: string
    valgramaentrada: number
    embalagemsaida: string
    valgramasaida: number
    ncm: string
    peripi: number
    flaginativo: string
    dtcadastro: string
    dtalteracao: string
    pesoliquido: number
    pesobruto: number
    altura: number
    largura: number
    comprimento: number
    flagbloqueiavenda: string
    gramaturavenda: string
    valmultivendas: number
  }
  
  export interface Preco {
    info: Info2
  }
  
  export interface Info2 {
    idempresa: number
    idproduto: number
    idsubproduto: number
    valprecovarejo: number
    valpromvarejo: number
    valprecoatacado: number
    valpromatacado: number
    valcustorepos: number
    custogerencial: number
    custonotafiscal: number
    dtalteracaovar: string
    dtalteracaopromovar: string
    dtalteracao: string
    flaginativo: string
    qtdmultiplicador: number
    valprecovarejomulti: number
  }

export async function ConsultarProduto(codigo: string): Promise<Root> {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post<Root>('http://45.164.8.122:30492/api/ciss/produto', {
            token: token,
            codigo: codigo,
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao consultar produto:', error);
        throw error;
    }
}
