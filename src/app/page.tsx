'use client'
import NavBar from "@/components/NavBar";
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <ProtectedRouts>
      <head>
        <title>Supermercado IBS</title>
      </head>
      <Container>
        <NavBar />
        <Grid container>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/faturamento-atual')}>
            Faturamento Atual
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/pedido-ceasa')}>
            Pedido Ceasa
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }} onClick={() => router.push('/gerenciar-pedidos')}>
            Gerenciar pedidos
          </Button>
        </Grid>
      </Container>
    </ProtectedRouts>

  );
}
