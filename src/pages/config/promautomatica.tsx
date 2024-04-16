import { useEffect, useState } from 'react';
import Head from 'next/head';
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import NavBarPages from '@/components/NavBarPages';
import '@/app/globals.css'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';


export default function PromAutomatica() {
    const [repeticao, setRepeticao] = useState<string>('');
    const [diaSemana, setDiaSemana] = useState<string>('');

    useEffect(() => {
    }, []);

    const handleRepeticaoChange = (event: SelectChangeEvent<string>) => {
        setRepeticao(event.target.value as string);
    };

    const handleDiaSemanaChange = (event: SelectChangeEvent<string>) => {
        setDiaSemana(event.target.value as string);
    };


    useEffect(() => {
    }, []);

    const somaDia = () => {
        const dia = parseFloat(diaSemana)
        if (dia <= 13){
            return dia + 15
        }else if (dia >= 16){
            return dia - 15
        }else if (dia === 15 || dia === 14){
            return 1
        }
    }

    return (
        <ProtectedRouts>
            <Head>
                <title>Supermercado IBS</title>
            </Head>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '100%', md: '100%' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        Configuração de Promoções automaticas
                    </Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant="h5" component="h1" m={1} fontWeight={700}>
                        Promoções diarias
                    </Typography>
                    <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'column'} border={1} borderColor={'gray'} alignItems={'center'}>
                        <Typography m={1} textAlign={'center'}>Titulo da promoção: Segunda-Feira de Limpeza</Typography>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />} label="Ativo" />
                            </FormGroup>
                        </Box>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <TextField id="outlined-basic" label="Grupo 1" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { }} />
                            <BiPlus size={40} />

                        </Box>


                        <Typography m={1} textAlign={'center'}>Excluir SubGrupos:</Typography>

                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <TextField id="outlined-basic" label="Exluir subgrupo 1" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { }} />
                            <BiPlus size={40} />
                        </Box>

                        <Typography m={1} textAlign={'center'}>Produtos Fixos:</Typography>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <TextField id="outlined-basic" label="Codigo Produto 1" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { }} />
                            <TextField id="outlined-basic" label="Preço produto 1" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { }} />
                            <BiPlus size={40} />
                        </Box>
                        <Typography m={1} textAlign={'center'}>Configuração dos concorrentes</Typography>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <TextField id="outlined-basic" label="Raio da concorrencia (KM)" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="text" onChange={(e) => { }} />
                        </Box>
                        <Typography m={1} textAlign={'center'}>Repetição da promoção</Typography>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <FormControl variant="outlined" style={{ backgroundColor: 'white', margin: 5 }}>
                                <Select
                                    label='Seleciona a frequência'
                                    value={repeticao}
                                    onChange={handleRepeticaoChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione a frequência
                                    </MenuItem>
                                    <MenuItem value="semanal">Semanal</MenuItem>
                                    <MenuItem value="quinzenal">Quinzenal</MenuItem>
                                    <MenuItem value="mensal">Mensal</MenuItem>
                                </Select>
                            </FormControl>
                            {repeticao === 'semanal' && (
                                <FormControl variant="outlined" style={{ backgroundColor: 'white', margin: 5 }}>
                                    <Select
                                        label='Seleciona a frequência'
                                        value={diaSemana}
                                        onChange={handleDiaSemanaChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Selecione o dia da semana
                                        </MenuItem>
                                        <MenuItem value="1">Segunda-feira</MenuItem>
                                        <MenuItem value="2">Terça-feira</MenuItem>
                                        <MenuItem value="3">Quarta-feira</MenuItem>
                                        <MenuItem value="4">Quinta-feira</MenuItem>
                                        <MenuItem value="5">Sexta-feira</MenuItem>
                                        <MenuItem value="6">Sábado</MenuItem>
                                        <MenuItem value="0">Domingo</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            {repeticao === 'mensal' && (
                                <FormControl variant="outlined" style={{ backgroundColor: 'white', margin: 5 }}>
                                    <Select
                                        value={diaSemana}
                                        onChange={handleDiaSemanaChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Selecione o dia do mes
                                        </MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="8">8</MenuItem>
                                        <MenuItem value="9">9</MenuItem>
                                        <MenuItem value="10">10</MenuItem>
                                        <MenuItem value="11">11</MenuItem>
                                        <MenuItem value="12">12</MenuItem>
                                        <MenuItem value="13">13</MenuItem>
                                        <MenuItem value="14">14</MenuItem>
                                        <MenuItem value="15">15</MenuItem>
                                        <MenuItem value="16">16</MenuItem>
                                        <MenuItem value="17">17</MenuItem>
                                        <MenuItem value="18">18</MenuItem>
                                        <MenuItem value="19">19</MenuItem>
                                        <MenuItem value="20">20</MenuItem>
                                        <MenuItem value="21">21</MenuItem>
                                        <MenuItem value="22">22</MenuItem>
                                        <MenuItem value="23">23</MenuItem>
                                        <MenuItem value="24">24</MenuItem>
                                        <MenuItem value="25">25</MenuItem>
                                        <MenuItem value="26">27</MenuItem>
                                        <MenuItem value="27">28</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            {repeticao === 'quinzenal' && (
                                <>
                                    <FormControl variant="outlined" style={{ backgroundColor: 'white', margin: 5 }}>
                                        <Select
                                            value={diaSemana}
                                            onChange={handleDiaSemanaChange}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="" disabled>
                                                Selecione o dia do mes
                                            </MenuItem>
                                            <MenuItem value="1">1</MenuItem>
                                            <MenuItem value="2">2</MenuItem>
                                            <MenuItem value="3">3</MenuItem>
                                            <MenuItem value="4">4</MenuItem>
                                            <MenuItem value="5">5</MenuItem>
                                            <MenuItem value="6">6</MenuItem>
                                            <MenuItem value="7">7</MenuItem>
                                            <MenuItem value="8">8</MenuItem>
                                            <MenuItem value="9">9</MenuItem>
                                            <MenuItem value="10">10</MenuItem>
                                            <MenuItem value="11">11</MenuItem>
                                            <MenuItem value="12">12</MenuItem>
                                            <MenuItem value="13">13</MenuItem>
                                            <MenuItem value="14">14</MenuItem>
                                            <MenuItem value="15">15</MenuItem>
                                            <MenuItem value="16">16</MenuItem>
                                            <MenuItem value="17">17</MenuItem>
                                            <MenuItem value="18">18</MenuItem>
                                            <MenuItem value="19">19</MenuItem>
                                            <MenuItem value="20">20</MenuItem>
                                            <MenuItem value="21">21</MenuItem>
                                            <MenuItem value="22">22</MenuItem>
                                            <MenuItem value="23">23</MenuItem>
                                            <MenuItem value="24">24</MenuItem>
                                            <MenuItem value="25">25</MenuItem>
                                            <MenuItem value="26">27</MenuItem>
                                            <MenuItem value="27">28</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {diaSemana != '' && (
                                        <Box display={'flex'} >
                                            <Typography m={1} textAlign={'center'} color={'blue'} fontWeight={700}>Dia: {diaSemana} e dia {somaDia()}</Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                        <Typography m={1} textAlign={'center'}>Configuração do horario e quantidade de itens</Typography>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Horario para gerar promoção"
                                    defaultValue={dayjs('2022-04-17T17:00')}
                                    ampm={false}
                                    format="HH:mm"
                                />
                            </LocalizationProvider>
                            <TextField id="outlined-basic" label="Quant. Itens" variant="outlined" style={{ backgroundColor: 'white', margin: 5 }} type="number" onChange={(e) => { }} />
                        </Box>
                        <Box style={{ padding: 5, backgroundColor: 'white', margin: 3 }} borderRadius={2} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Button variant="contained" style={{ backgroundColor: 'green' }}>Salvar Promoção</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ProtectedRouts>
    );
}
