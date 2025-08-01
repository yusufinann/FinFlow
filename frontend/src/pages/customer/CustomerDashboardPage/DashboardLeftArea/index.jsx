import { Box } from '@mui/material'
import React from 'react'
import MyAccounts from './MyAccounts'
import Transactions from './Transactions'

const DashboardLeftArea = () => {
  return (
<Box sx={{display:'flex',flexDirection:'column',gap:5}}>
   <MyAccounts/>
   <Transactions/>
 </Box>
  )
}

export default DashboardLeftArea
