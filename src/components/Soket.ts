import { useEffect, useState } from 'react';

const newWs = new WebSocket('ws://190.5.209.135:8080');
newWs.onopen = () => {
    console.log('Conexão WebSocket aberta');
};



export const WebSocketExample = (atualizar: number, setAtulizar: (numero : number) => void) => {
    //receber msg
    newWs.onmessage = (event) => {
        const newMessage = event.data;
        setAtulizar(atualizar + 1)
    };
};

export const EnviarMsg = () => {
    //receber msg
    newWs.send('mensagem')
};

