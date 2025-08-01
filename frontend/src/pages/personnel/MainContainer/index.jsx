import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainContainer = () => {
  return (
   <Box sx={{display:'flex', width:'1005',flexGrow:'Shrink'}}>
      <Outlet/>
   </Box>
  )
}

export default MainContainer
