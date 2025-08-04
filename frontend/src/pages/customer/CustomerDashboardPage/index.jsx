import { Box } from '@mui/material'
import React from 'react'
import DashboardRightArea from './DashboardRightArea'
import DashboardLeftArea from './DashboardLeftArea'

const CustomerDashboardPage = () => {
  return (
    <Box sx={{display:'flex',flexDirection:'row',gap:4 ,width:'100%',height:'100%'}}>
<DashboardLeftArea/>
 <DashboardRightArea/>
    </Box>
 
  )
}

export default CustomerDashboardPage
