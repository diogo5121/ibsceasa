'use client'
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AssessmentIcon from '@mui/icons-material/Assessment';
import { PriceChange, RocketLaunchRounded } from "@mui/icons-material";
import '@/app/globals.css'
import NavBarPages from "@/components/NavBarPages";
import { useEffect, useState } from "react";
import { ConsultarTabelaConferencia, ConsultarTabelaLancamentos, ConsultarTabelaPedidos, Lancamento, Root4, Root7 } from "@/components/Api";
import dayjs from "dayjs";
import { gerarRelatorioConferencia, gerarRelatorioLancamento, gerarRelatorioPDF, gerarRelatorioPDFDEL, gerarRelatorioPDFTodas } from "@/utils/Relatorios";
import { FaExplosion } from "react-icons/fa6";
import { BiGlasses } from "react-icons/bi";




export default function Home() {
    const [pedidos, setpedidos] = useState<Root4>()
    const [loading, setLoading] = useState(false)
    const [TemLancamentoHoje, setTemLancamentoHoje] = useState(true)
    const [LancamentoHoje, setLancamentoHoje] = useState<Lancamento[]>([])
    const [conferencias, setConferencias] = useState<Root7>()

    useEffect(() => {
        const PuxatPedidos = async () => {
            setLoading(true)
            try {
                const pedidos = await ConsultarTabelaPedidos('pedidos')
                setpedidos(pedidos)
            } catch {
                console.log('SEM PEDIDOS')
                setLoading(false)
            }
            setLoading(false)

        }
        PuxatPedidos()
        const PuxatLancamentos = async () => {
            setLoading(true)
            try {
                const lacamentos = await ConsultarTabelaLancamentos('lancamento')
                lacamentos.message[0].lancamento.map(produto => {
                    if(produto.lancado === false){
                        setTemLancamentoHoje(false)
                    }
                })
                setLancamentoHoje(lacamentos.message[0].lancamento)
            
            } catch {
                setTemLancamentoHoje(false)

            }
            setLoading(false)

        }
        PuxatLancamentos()
        const PuxarConferencias = async () => {
            setLoading(true)
            try {
                const conferencias = await ConsultarTabelaConferencia('conferencia')
                setConferencias(conferencias)
            
            } catch {

            }
            setLoading(false)

        }
        PuxarConferencias()
    }, [])

    const dataHoje = dayjs().format('YYYY-MM-DD');
    const pedidosHoje = pedidos?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });
    const conferenciaHoje = conferencias?.message.filter(pedido => {
        return dayjs(pedido.data).format('YYYY-MM-DD') === dataHoje;
    });

    return (
        <ProtectedRouts>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '130vh', md: '100vh' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant="h5" component="h1" m={2} fontWeight={700}>
                        RELATORIOS:
                    </Typography>
                </Box>
                {loading ? (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {TemLancamentoHoje === true && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioLancamento(LancamentoHoje, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Relatorio lançamento
                                    </Typography>
                                    <RocketLaunchRounded />
                                </Box>
                            </Button>
                        )}


                        {conferenciaHoje?.filter(pedidos => pedidos.loja === 1).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioConferencia(conferenciaHoje?.filter(pedidos => pedidos.loja === 1), 1, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Conferencia Loja 1
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(pedidos => pedidos.loja === 2).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioConferencia(conferenciaHoje?.filter(pedidos => pedidos.loja === 2), 2, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Conferencia Loja 2
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(pedidos => pedidos.loja === 3).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioConferencia(conferenciaHoje?.filter(pedidos => pedidos.loja === 3), 3, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Conferencia Loja 3
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(pedidos => pedidos.loja === 4).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioConferencia(conferenciaHoje?.filter(pedidos => pedidos.loja === 4), 4, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Conferencia Loja 5
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {conferenciaHoje?.filter(pedidos => pedidos.loja === 5).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => {gerarRelatorioConferencia(conferenciaHoje?.filter(pedidos => pedidos.loja === 5), 5, dataHoje)}}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Conferencia Loja 7
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}

                        {pedidosHoje?.filter(pedidos => pedidos.loja === 1).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => pedidosHoje && gerarRelatorioPDF(pedidosHoje?.filter(pedidos => pedidos.loja === 1), 1)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Pedido Loja 1
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.filter(pedidos => pedidos.loja === 2).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => pedidosHoje && gerarRelatorioPDF(pedidosHoje?.filter(pedidos => pedidos.loja === 2), 2)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Pedido Loja 2
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.filter(pedidos => pedidos.loja === 3).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => pedidosHoje && gerarRelatorioPDF(pedidosHoje?.filter(pedidos => pedidos.loja === 3), 3)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Pedido Loja 3
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.filter(pedidos => pedidos.loja === 4).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => pedidosHoje && gerarRelatorioPDF(pedidosHoje?.filter(pedidos => pedidos.loja === 4), 5)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Pedido Loja 5
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.filter(pedidos => pedidos.loja === 5).length === 1 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => pedidosHoje && gerarRelatorioPDF(pedidosHoje?.filter(pedidos => pedidos.loja === 5), 7)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        Pedido Loja 7
                                    </Typography>
                                    <AssessmentIcon />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.length === 5 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => gerarRelatorioPDFTodas()}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        RELATORIO TODAS AS LOJAS
                                    </Typography>
                                    <FaExplosion size={30} />
                                </Box>
                            </Button>
                        )}
                        {pedidosHoje?.length === 5 && (
                            <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => gerarRelatorioPDFDEL(pedidosHoje)}>
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                        RELATORIO DEL
                                    </Typography>
                                    <BiGlasses size={30} />
                                </Box>
                            </Button>
                        )}

                    </Grid>
                )}

            </Box>
        </ProtectedRouts>
    );
}