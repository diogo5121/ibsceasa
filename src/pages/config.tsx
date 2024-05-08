'use client'
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import "../app/globals.css";
import NavBarPages from "@/components/NavBarPages";
import { BsBoxFill, BsBuildingGear } from "react-icons/bs";
import { WiDayCloudy } from "react-icons/wi";
import { FaCalendarDays } from "react-icons/fa6";




export default function Config() {
    const router = useRouter()

    return (
        <ProtectedRouts>
            <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '130vh', md: '100vh' } }}>
                <NavBarPages />
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                    <Typography variant="h5" component="h1" fontWeight={700}>
                        Configurações
                    </Typography>
                </Box>
                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => { router.push('/config/promautomatica'); }}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Promoções Automaticas
                            </Typography>
                            <BsBuildingGear />
                        </Box>
                    </Button>
                    <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => { router.push('/config/diaceasa'); }}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Dias da ceasa
                            </Typography>
                            <FaCalendarDays />
                        </Box>
                    </Button>
                    <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/produtos')}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                PRODUTOS CEASA
                            </Typography>
                            <BsBoxFill size={25} />
                        </Box>
                    </Button>
                    <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/relatorio-percas')}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                                Relatorio de percas
                            </Typography>
                            <BsBoxFill size={25} />
                        </Box>
                    </Button>
                </Grid>
            </Box>
        </ProtectedRouts>
    );
}