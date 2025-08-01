import { Box } from '@mui/material'
import React from 'react'
import Income from './Income'
import Expense from './Expense'
import TotalSpends from './TotalSpends'
const DashboardRightArea = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width: '40vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
        <Income />
        <Expense />
      </Box>
      <TotalSpends />
    </Box>
  )
}

export default DashboardRightArea
