'use client'

import { Menu } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material"

export default function NavBar() {
    function Sair() {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SUPERMERCADO IBS
            </Typography>
            <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => { Sair() }}>
              Sair
            </Button>
          </Toolbar>
        </AppBar>
    )
}