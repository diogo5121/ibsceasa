
import NavBar from "@/components/NavBar";
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Button, Container, Grid, IconButton, Toolbar, Typography } from "@mui/material";

export default function Home() {

  return (
    <ProtectedRouts>
      <Container>

        <NavBar />
        <Grid container>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }}>
            Faturamento Atual
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }}>
            Pedido Ceasa
          </Button>
          <Button variant="contained" style={{ width: 150, height: 150, margin: 10, padding: 5, backgroundColor: 'green' }}>
            Gerenciar pedidos
          </Button>
        </Grid>
      </Container>
    </ProtectedRouts>

  );
}
