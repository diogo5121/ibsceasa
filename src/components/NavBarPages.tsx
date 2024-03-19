'use client'

import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { useRouter } from "next/navigation";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Image from "next/image";

export default function NavBarPages() {
  const router = useRouter()
  function Voltar() {
    router.push('/')
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: 'green' }}>
      <Image src='/images/ibs.png' alt="Ibs-Logo" width={70} height={70} style={{ marginBottom: '10px', margin: 20 }} />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: 15, md: 20 } }}>
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
        <Button variant="contained" style={{ backgroundColor: 'orange' }} onClick={() => { Voltar() }}>
          Voltar
        </Button>
      </Toolbar>
    </AppBar>
  )
}