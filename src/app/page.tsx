'use client'
import NavBar from "@/components/NavBar";
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { HistoryToggleOffSharp, PriceChange } from "@mui/icons-material";



export default function Home() {
  const router = useRouter()

  return (
    <ProtectedRouts>
      <head>
        <title>Supermercado IBS</title>
      </head>
      <Box display={'flex'} flexDirection={'column'} bgcolor={'#e3e1e1'} sx={{ height: { xs: '130vh', md: '100vh' } }}>
        <NavBar />
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h5" component="h1" m={2} fontWeight={700}>
            MENU CEASA:
          </Typography>
        </Box>
        <Grid container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/pedidoceasa')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                Realizar Pedido Ceasa
              </Typography>
              <AssignmentIcon />
            </Box>
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/gerenciar-pedidos')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                GERENCIAR PEDIDOS
              </Typography>
              <BorderColorIcon />
            </Box>
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/compra-ceasa')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                DEL - CEASA
              </Typography>
              <BorderColorIcon />
            </Box>
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/precos')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                HISTORICO DE PEDIDOS
              </Typography>
              <HistoryToggleOffSharp />
            </Box>
          </Button>
        </Grid>

        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h5" component="h1" m={2} fontWeight={700}>
            MENU GERAL:
          </Typography>
        </Box>
        <Grid container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => { router.push('/faturamento'); }}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                Faturamento das Lojas
              </Typography>
              <AssessmentIcon />
            </Box>
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/precos')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                PREÇOS
              </Typography>
              <PriceChange />
            </Box>
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/promocoes')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                PROMOÇÕES DE HOJE
              </Typography>
              <PriceChange />
            </Box>
          </Button>
        </Grid>
      </Box>
    </ProtectedRouts>
  );
}