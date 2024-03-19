'use client'
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import Image from "next/image";

export default function NavBar() {
  const conta = localStorage.getItem('nome')
  function Sair() {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: 'green' }}>
      <Image src='/images/ibs.png' alt="Ibs-Logo" width={80} height={50} style={{ marginBottom: '10px', margin: 20 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: {xs: 15, md: 20} }}>
          SUPERMERCADOS IBS
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: {xs: 0, md: 2} }} alignItems={'center'} justifyContent={'center'}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: {xs: 15, md: 20} }}>
          Conta: {conta}
        </Typography>
        </Box>
        <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => { Sair() }}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  )
}