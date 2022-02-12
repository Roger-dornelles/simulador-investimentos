/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

const api = axios.create({
    baseURL:  'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getIndicators: async ()=>{
        const result = await api.get('/indicadores');
        const json = await result.data;
        return json;
    },

    getSimulationAll: async (rendimento,indexacao)=>{
        const result = await api.get(`/simulacoes?tipoIndexacao=${indexacao}&tipoRendimento=${rendimento}`);
        const json = await result.data;
        return json;
    },
    
}