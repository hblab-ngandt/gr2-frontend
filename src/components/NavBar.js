import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function NavBar(props) {
  return (
    <AppBar position="static">
    <Toolbar>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1 }}
      >
        Account Address
      </Typography>
      <a
        style={{ textDecoration: "none", color: "white" }}
        target="_blank"
        href={`https://testnet.bscscan.com/address/${props.address}`}
        rel="noreferrer"
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {props.address}
        </Typography>
      </a>
    </Toolbar>
  </AppBar>
  );
}