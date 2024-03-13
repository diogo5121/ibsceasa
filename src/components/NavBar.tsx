'use client'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"

export default function NavBar() {
  function Sair() {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: 'green' }}>
        <img src='/images/ibs.png' alt="Ibs-Logo" style={{ width: '70px', marginBottom: '10px', margin: 20 }}/>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SUPERMERCADOS IBS
        </Typography>
        <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => { Sair() }}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  )
}