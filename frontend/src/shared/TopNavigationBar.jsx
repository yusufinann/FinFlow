import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'

const TopNavigationBar = () => {
  return (
        <AppBar position="static" elevation={0} sx={{ 
           backgroundColor: 'rgba(0,0,0,0.2)',
           backdropFilter: 'blur(10px)'
         }}>
           <Toolbar sx={{ justifyContent: 'space-between', minHeight: '48px !important' }}>
             <Box sx={{ display: 'flex', gap: 3 }}>
               <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
                 GÜVENLİK
               </Typography>
               <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
                 YARDIM
               </Typography>
               <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
                 SIKÇA SORULAN SORULAR
               </Typography>
               <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
                 ENGLISH
               </Typography>
             </Box>
           </Toolbar>
         </AppBar>
  )
}

export default TopNavigationBar
