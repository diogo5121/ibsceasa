'use client'
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NavBar() {
  function Sair() {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: 'green' }}>
        <img src='/images/ibs.png' alt="Ibs-Logo" style={{ width: '70px', marginBottom: '10px', margin: 20 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: {xs: 15, md: 20} }}>
          SUPERMERCADOS IBS
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
        <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => { Sair() }}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  )
}