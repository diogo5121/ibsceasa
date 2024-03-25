'use client'
import NavBar from "@/components/NavBar";
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { HistoryToggleOffSharp, NoteAlt, Notes, PriceChange } from "@mui/icons-material";
import { BiBox, BiPencil } from "react-icons/bi";
import { BsBox, BsBox2, BsBoxFill } from "react-icons/bs";
import { MdOutlineNoteAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ConsultarTabelaPedidos } from "@/components/Api";



export default function Home() {
  const router = useRouter()
  const Today = dayjs().day()


  useEffect(() => {
  }, [])

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

        <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(Today === 0 || Today === 2 || Today === 4) && (
            <>
              <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/pedidoceasa')}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                    Fazer Pedido
                  </Typography>
                  <AssignmentIcon />
                </Box>
              </Button>
              <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/editarpedido')}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                    Editar pedido
                  </Typography>
                  <BiPencil size={25} />
                </Box>
              </Button>
            </>
          )}
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/relatorios')}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                RELATORIOS
              </Typography>
              <Notes />
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

          {(Today === 1 || Today === 3 || Today === 5) && (
            <>
              <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/lancamentos')}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                    Lançamento ceasa
                  </Typography>
                  <MdOutlineNoteAdd size={25} />
                </Box>
              </Button>
              <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/conferencia')}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant='body1' component="h1" m={2} fontWeight={500}>
                    Conferência
                  </Typography>
                  <MdOutlineNoteAdd size={25} />
                </Box>
              </Button>
            </>

          )}
        </Grid>
        {(Today === 0 || Today === 2 || Today === 4) && (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h5" component="h1" fontWeight={700} fontSize={15} color={'green'}>
              Hoje é dia de pedido
            </Typography>
          </Box>
        )}
        {(Today === 1 || Today === 3 || Today === 5 || Today === 6) && (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h5" component="h1" fontWeight={700} fontSize={15} color={'red'}>
              Hoje não é dia de pedido
            </Typography>
          </Box>
        )}
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h5" component="h1" m={2} fontWeight={700}>
            MENU GERAL:
          </Typography>
        </Box>
        <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </Grid>


      </Box>
    </ProtectedRouts>
  );
}