import React from 'react'
import {Box} from "@mui/material";
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
const MainAppLayout = () => {
  return (
  <Box sx={{display:"flex",flexDirection:"column",height:"100vh"}}>
    <Navbar/>
    <Box
        component="main"
        sx={{
         // paddingTop: `${TOTAL_NAVBAR_HEIGHT_FOR_PADDING}px`,
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 2, sm: 4, md: 10 },
            mr: { xs: 2, sm: 4, md: 10 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      {/* <Footer /> */}
        </Box>
  )
}

export default MainAppLayout
