import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Alert,
  List,
  ListItem,
  Divider
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Flag from 'react-world-flags';

const currencyMap = {
  USD: { name: 'ABD Doları', code: 'US' },
  EUR: { name: 'Euro', code: 'EU' },
  GBP: { name: 'İngiliz Sterlini', code: 'GB' },
  JPY: { name: 'Japon Yeni', code: 'JP' },
  CHF: { name: 'İsviçre Frangı', code: 'CH' },
  AUD: { name: 'Avustralya Doları', code: 'AU' },
  CAD: { name: 'Kanada Doları', code: 'CA' },
  CNY: { name: 'Çin Yuanı', code: 'CN' },
  SEK: { name: 'İsveç Kronu', code: 'SE' },
  NOK: { name: 'Norveç Kronu', code: 'NO' },
  DKK: { name: 'Danimarka Kronu', code: 'DK' },
  SAR: { name: 'Suudi Arabistan Riyali', code: 'SA' },
};

const ExchangeRates = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      const currenciesToFetch = Object.keys(currencyMap).join(',');
      try {
        // ADIM 1: API'ye "1 TL'nin" değerini diğer para birimleri cinsinden soruyoruz.
        // Bu, istediğimiz sonuca ulaşmak için gerekli bir ara adımdır.
        const response = await fetch(`https://api.frankfurter.app/latest?from=TRY&to=${currenciesToFetch}`);
        
        if (!response.ok) {
          throw new Error('Döviz kuru verileri alınamadı.');
        }

        const data = await response.json();
        const invertedRates = {};
        
        for (const currency in data.rates) {
          // ADIM 2 (EN ÖNEMLİ KISIM): Gelen kurun matematiksel tersini alıyoruz.
          // Bu işlem, "1 Dolar kaç TL?" sorusunun cevabını bize verir.
          invertedRates[currency] = 1 / data.rates[currency];
        }

        // Artık 'invertedRates' içinde "1 USD = 33.33 TL" gibi doğru veriler var.
        setRates(invertedRates);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Geri kalan JSX kısmı tamamen doğru ve bu veriyi göstermek için hazır.
  // ... (Görsel kısımda değişiklik yok)
  const renderSkeleton = () => (
    <List>
      {Array.from(new Array(6)).map((_, index) => (
        <React.Fragment key={index}>
          <ListItem sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="50%" height={24}/>
                <Skeleton variant="text" width="30%" height={18}/>
              </Box>
              <Skeleton variant="text" width="25%" height={30} />
            </Box>
          </ListItem>
          {index < 5 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Paper
      elevation={5}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ShowChartIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Döviz Kurları (TL Karşılığı)
        </Typography>
      </Box>

      {loading && renderSkeleton()}
      {error && <Alert severity="error" variant="outlined">{error}</Alert>}
      {rates && (
        <List disablePadding>
          {Object.entries(rates).map(([currency, rate], index) => (
            <React.Fragment key={currency}>
              <ListItem sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Flag
                    code={currencyMap[currency]?.code || 'XX'}
                    height="30"
                    width="40"
                    style={{ borderRadius: '4px', marginRight: '16px' }}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {`1 ${currencyMap[currency]?.name}`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {`(${currency})`}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', minWidth: '90px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.dark' }}>
                    {`${rate.toFixed(4)} TL`}
                  </Typography>
                </Box>
              </ListItem>
              {index < Object.keys(rates).length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ExchangeRates;