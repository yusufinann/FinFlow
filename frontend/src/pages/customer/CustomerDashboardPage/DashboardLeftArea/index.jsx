import { Box } from '@mui/material'
import React from 'react'
import MyAccounts from './MyAccounts'

const DashboardLeftArea = () => {
  return (
<Box sx={{display:'flex',flexDirection:'column',gap:5}}>
   <MyAccounts/>
 </Box>
  )
}

export default DashboardLeftArea
