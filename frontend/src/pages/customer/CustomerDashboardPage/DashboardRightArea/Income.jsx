
import { Box, Typography, Chip, Card, CardContent,  } from '@mui/material'
import React from 'react'
import { TrendingUp, } from '@mui/icons-material'

const Income = () => {
  const incomeData = [
    { source: 'Maaş', amount: 15000, color: '#4CAF50' },
    { source: 'Freelance', amount: 3500, color: '#2196F3' },
    { source: 'Yatırım', amount: 1200, color: '#FF9800' }
  ]

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card sx={{
      width: '22vw',
      height: '40vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Gelir
          </Typography>
          <TrendingUp sx={{ fontSize: 28, opacity: 0.8 }} />
        </Box>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            ₺{totalIncome.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Bu ay toplam gelir
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {incomeData.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {item.source}
              </Typography>
              <Chip 
                label={`₺${item.amount.toLocaleString()}`}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Income
