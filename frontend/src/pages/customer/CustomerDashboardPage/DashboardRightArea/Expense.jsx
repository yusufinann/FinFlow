import React from 'react'
import { TrendingDown,} from '@mui/icons-material'
import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material'

const Expense = () => {
  const expenseData = [
    { category: 'Market', amount: 2500, percentage: 35 },
    { category: 'Kira', amount: 4000, percentage: 55 },
    { category: 'Ulaşım', amount: 800, percentage: 15 }
  ]

  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card sx={{
      width: '22vw',
      height: '40vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Gider
          </Typography>
          <TrendingDown sx={{ fontSize: 28, opacity: 0.8 }} />
        </Box>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            ₺{totalExpense.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Bu ay toplam gider
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {expenseData.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {item.category}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ₺{item.amount.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.percentage} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Expense
