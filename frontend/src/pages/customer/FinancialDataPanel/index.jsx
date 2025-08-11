import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Container,
  Divider,
  Tabs,
  Tab,
  IconButton,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a8a',
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857'
    },
    info: {
      main: '#0369a1',
      light: '#0ea5e9',
      dark: '#0c4a6e'
    },
    success: {
      main: '#059669',
      light: '#d1fae5',
      dark: '#047857',
      contrastText: '#ffffff'
    },
    error: {
      main: '#dc2626',
      light: '#fef2f2',
      dark: '#991b1b',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#92400e'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    body1: {
      fontWeight: 500,
      lineHeight: 1.6
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.5
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: '16px',
          border: '1px solid #f3f4f6',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600
        }
      }
    }
  }
});

const currencyMap = {
  USD: { name: 'ABD Doları', code: 'US', symbol: '$' },
  EUR: { name: 'Euro', code: 'EU', symbol: '€' },
  GBP: { name: 'İngiliz Sterlini', code: 'GB', symbol: '£' },
  JPY: { name: 'Japon Yeni', code: 'JP', symbol: '¥' },
  CHF: { name: 'İsviçre Frangı', code: 'CH', symbol: 'CHF' },
  AUD: { name: 'Avustralya Doları', code: 'AU', symbol: 'A$' },
  CAD: { name: 'Kanada Doları', code: 'CA', symbol: 'C$' },
  CNY: { name: 'Çin Yuanı', code: 'CN', symbol: '¥' },
  RUB: { name: 'Rus Rublesi', code: 'RU', symbol: '₽' },
  SAR: { name: 'Suudi Riyali', code: 'SA', symbol: 'SR' },
  KWD: { name: 'Kuveyt Dinarı', code: 'KW', symbol: 'KD' },
  AED: { name: 'BAE Dirhemi', code: 'AE', symbol: 'AED' }
};

const COLLECT_API_KEY = '5QDtdUWecQc8GVF58qGDms:4ikNUBLMvS4pJ1TUW0Fqvx';
const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000_000) {
        return `${(num / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    return num.toString();
};
const FinancialDataPanel = () => {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [bistData, setBistData] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [bondData, setBondData] = useState(null);
  const [loading, setLoading] = useState({ exchange: true, market: true, bist: true, crypto: true, bonds: true });
  const [error, setError] = useState({ exchange: null, market: null, bist: null, crypto: null, bonds: null });
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState(new Set(['USD', 'EUR', 'BIST 100', 'Altın (Gram)']));
  const [refreshing, setRefreshing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (item) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(item)) {
      newFavorites.delete(item);
    } else {
      newFavorites.add(item);
    }
    setFavorites(newFavorites);
  };

  const fetchAllData = () => {
    fetchExchangeRates();
    fetchMarketData();
    fetchBistData();
    fetchCryptoData();
    fetchBondData();
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    setLoading({ exchange: true, market: true, bist: true, crypto: true, bonds: true });
    localStorage.removeItem('metalPricesCache');
    localStorage.removeItem('metalPricesTimestamp');
    setTimeout(() => {
      setRefreshing(false);
      fetchAllData();
    }, 1000);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(l => ({ ...l, exchange: true }));
    setError(e => ({ ...e, exchange: null }));
    try {
      const currenciesToFetch = Object.keys(currencyMap).join(',');
      const response = await fetch(`https://api.frankfurter.app/latest?from=TRY&to=${currenciesToFetch}`);
      if (!response.ok) throw new Error('Döviz kuru verileri alınamadı.');
      const data = await response.json();
      const invertedRates = {};
      for (const currency in data.rates) {
        invertedRates[currency] = {
          rate: 1 / data.rates[currency],
          change: Math.random() * 4 - 2, 
          volume: Math.floor(Math.random() * 10000000) + 1000000 // Simülasyon
        };
      }
      setExchangeRates(invertedRates);
    } catch (err) {
      setError(e => ({ ...e, exchange: err.message }));
    } finally {
      setLoading(l => ({ ...l, exchange: false }));
    }
  };

  const fetchMarketData = async () => {
    setLoading(l => ({ ...l, market: true }));
    setError(e => ({ ...e, market: null }));

    const cachedMetals = localStorage.getItem('metalPricesCache');
    const cacheTimestamp = localStorage.getItem('metalPricesTimestamp');
    const oneHour = 60 * 60 * 1000;

    try {
        let realGoldData = [];
        if (cachedMetals && cacheTimestamp && (Date.now() - cacheTimestamp < oneHour)) {
            realGoldData = JSON.parse(cachedMetals);
        } else {
            const response = await fetch('https://api.collectapi.com/economy/goldPrice', {
                headers: { 'authorization': `apikey ${COLLECT_API_KEY}`, 'content-type': 'application/json' },
            });
            if (!response.ok) throw new Error('Altın ve değerli metal verileri alınamadı.');
            const data = await response.json();
            if (data.success && data.result) {
                realGoldData = data.result;
                localStorage.setItem('metalPricesCache', JSON.stringify(realGoldData));
                localStorage.setItem('metalPricesTimestamp', Date.now().toString());
            } else {
                throw new Error(data.message || 'API yanıtı başarısız veya geçersiz formatta.');
            }
        }
        
 
        const formattedGoldData = realGoldData.map(item => {
            const sellingPrice = parseFloat(item.selling);
            return {
                name: item.name,
                value: sellingPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: Math.random() * 2 - 1, // Simüle ediliyor
                icon: <MonetizationOnIcon/>,
                volume: `${(Math.random() * 50).toFixed(1)}M`, // Simüle ediliyor
                high: (sellingPrice * 1.01).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Simüle
                low: (sellingPrice * 0.99).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Simüle
            };
        });
        
        
        const mockCommodityData = [
            { name: 'Brent Petrol', value: '85,12', change: 2.51, icon: <LocalGasStationIcon/>, volume: '125.3M', high: '86,50', low: '82,80' },
            { name: 'Platin (Ons)', value: '995,40', change: -0.80, icon: <AttachMoneyIcon/>, volume: '4.2M', high: '1.002,00', low: '988,50' },
            { name: 'Paladyum (Ons)', value: '923,60', change: 1.22, icon: <AttachMoneyIcon/>, volume: '2.8M', high: '935,20', low: '915,40' },
            { name: 'Bakır (Ton)', value: '8.245,50', change: -0.65, icon: <AttachMoneyIcon/>, volume: '89.7M', high: '8.280,00', low: '8.210,30' }
        ];

        setMarketData([...formattedGoldData, ...mockCommodityData]);

    } catch (err) {
        setError(e => ({ ...e, market: err.message }));
    } finally {
        setLoading(l => ({ ...l, market: false }));
    }
  };

  // Aşağıdaki fonksiyonlar gerçek API sağlanmadığı için simülasyon olarak kalmıştır
  const fetchBistData = () => {
    setTimeout(() => {
      setBistData({
        indices: [
          { name: 'BIST 100', value: '10.740,25', change: -0.28, volume: '18.5M', marketCap: '8.2T' },
          { name: 'BIST 30', value: '11.685,50', change: -0.35, volume: '12.3M', marketCap: '5.1T' },
          { name: 'XUBNK', value: '15.450,11', change: 0.15, volume: '5.8M', marketCap: '1.8T' },
          { name: 'XUSIN', value: '14.230,80', change: -0.89, volume: '8.2M', marketCap: '2.5T' },
          { name: 'XUTEK', value: '15.110,40', change: 1.12, volume: '3.1M', marketCap: '950B' },
          { name: 'XGIDA', value: '12.850,65', change: 0.75, volume: '2.9M', marketCap: '780B' }
        ],
        stocks: [
          { name: 'THYAO', value: '308,50', change: -1.20, volume: '2.5M', marketCap: '385B' },
          { name: 'TUPRS', value: '169,80', change: -0.47, volume: '1.8M', marketCap: '169B' },
          { name: 'EREGL', value: '42,66', change: -2.15, volume: '4.2M', marketCap: '153B' },
          { name: 'KCHOL', value: '235,00', change: 0.53, volume: '1.2M', marketCap: '141B' },
          { name: 'ASELS', value: '61,75', change: 1.06, volume: '3.1M', marketCap: '137B' },
          { name: 'SAHOL', value: '98,45', change: 2.15, volume: '2.8M', marketCap: '123B' },
          { name: 'AKBNK', value: '45,20', change: -0.88, volume: '5.5M', marketCap: '117B' },
          { name: 'GARAN', value: '89,30', change: 1.35, volume: '3.3M', marketCap: '112B' }
        ]
      });
      setLoading(l => ({ ...l, bist: false }));
    }, 800);
  };
  
 const fetchCryptoData = async () => {
    setLoading(l => ({ ...l, crypto: true }));
    setError(e => ({ ...e, crypto: null }));
    try {
        // Mock datadaki coin'lerin ID'leri
        const coinIds = 'bitcoin,ethereum,binancecoin,solana,ripple,cardano';
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
        
        if (!response.ok) {
            throw new Error('Kripto para verileri alınamadı.');
        }
        
        const data = await response.json();

        // API'den gelen veriyi bileşenin beklediği formata dönüştür
        const formattedData = data.map(coin => ({
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            value: coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: coin.price_change_percentage_24h,
            volume: formatLargeNumber(coin.total_volume),
            marketCap: formatLargeNumber(coin.market_cap),
        }));
        
        setCryptoData(formattedData);

    } catch (err) {
        setError(e => ({ ...e, crypto: err.message }));
    } finally {
        setLoading(l => ({ ...l, crypto: false }));
    }
  };
  
  const fetchBondData = () => {
    setTimeout(() => {
      setBondData([
        { name: '2 Yıllık Tahvil', value: '28,45', change: -0.15, yield: '28,45%', duration: '1.95' },
        { name: '5 Yıllık Tahvil', value: '29,20', change: 0.25, yield: '29,20%', duration: '4.85' },
        { name: '10 Yıllık Tahvil', value: '30,15', change: -0.35, yield: '30,15%', duration: '9.75' },
        { name: 'Eurobond 2030', value: '7,85', change: 0.05, yield: '7,85%', duration: '5.25' },
        { name: 'Eurobond 2035', value: '8,45', change: -0.12, yield: '8,45%', duration: '10.15' }
      ]);
      setLoading(l => ({ ...l, bonds: false }));
    }, 900);
  };

  const renderSkeleton = (count = 5, height = 70) => (
    <Box sx={{ p: 2 }}>
      {Array.from(new Array(count)).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={height} sx={{ mb: 1.5, borderRadius: '12px' }} />
      ))}
    </Box>
  );

  const ChangeChip = ({ value, showIcon = true }) => (
    <Chip
      icon={showIcon ? (value > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : null}
      label={`${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
      color={value >= 0 ? "success" : "error"}
      sx={{ color: 'white', '& .MuiChip-icon': { color: 'white!important' }, fontWeight: 'bold', minWidth: showIcon ? '80px' : '60px' }}
      size="small"
    />
  );

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette[color].main}15, ${theme.palette[color].light}05)` }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, color: 'white', width: 48, height: 48 }}>{icon}</Avatar>
          {change !== undefined && <ChangeChip value={change} />}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: `${color}.dark` }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
      </CardContent>
    </Card>
  );

  const DetailedTable = ({ data, columns }) => (
    <TableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 700, bgcolor: 'grey.50', color: 'text.primary', borderBottom: '2px solid', borderColor: 'grey.200' }}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => toggleFavorite(row.name || row.symbol)} sx={{ p: 0.5 }}>
                        {favorites.has(row.name || row.symbol) ? ( <StarIcon sx={{ color: 'warning.main', fontSize: 18 }} /> ) : ( <StarBorderIcon sx={{ fontSize: 18 }} /> )}
                    </IconButton>
                    <Typography variant="body2" sx={{fontWeight: 600}}>{row.name}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{row.value}</TableCell>
              <TableCell><ChangeChip value={row.change} showIcon={false} /></TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{row.volume}</TableCell>
              {columns.includes('Piy. Değeri') && <TableCell sx={{ color: 'text.secondary' }}>{row.marketCap}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 1, md: 0 } }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ color: 'text.primary', mb: 1 }}>Finansal Piyasalar</Typography>
            </Box>
            <ButtonGroup variant="outlined" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
              <IconButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
              <IconButton><FullscreenIcon /></IconButton>
            </ButtonGroup>
          </Box>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}><StatCard title="BIST 100" value={bistData?.indices[0].value || '...'} change={bistData?.indices[0].change} icon={<BarChartIcon />} color="info" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="USD/TRY" value={exchangeRates ? `₺${exchangeRates.USD.rate.toFixed(2)}` : '...'} change={exchangeRates?.USD.change} icon={<ShowChartIcon />} color="primary" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Altın (Gram)" value={marketData ? `₺${marketData[0].value}` : '...'} change={marketData?.[0].change} icon={<MonetizationOnIcon />} color="warning" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Bitcoin" value={cryptoData ? `$${cryptoData[0].value}` : '...'} change={cryptoData?.[0].change} icon={<TrendingUpIcon />} color="secondary" /></Grid>
          </Grid>

          <Paper sx={{ mb: 3 }}><Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}><Tab label="Döviz Kurları" /><Tab label="Borsa İstanbul" /><Tab label="Emtialar" /><Tab label="Kripto Paralar" /><Tab label="Tahviller" /></Tabs></Paper>

          {/* TAB CONTENT */}
          <Box>
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}><ShowChartIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Döviz Kurları</Typography></Box>
                      <Chip label={`${Object.keys(currencyMap).length} Para Birimi`} variant="outlined" />
                    </Box>
                    {loading.exchange && renderSkeleton(10, 50)}
                    {error.exchange && <Alert severity="error">{error.exchange}</Alert>}
                    {exchangeRates && (
                      <DetailedTable
                        data={Object.entries(exchangeRates).map(([currency, data]) => ({ name: currency, value: `₺${data.rate.toFixed(4)}`, change: data.change, volume: `${(data.volume / 1000000).toFixed(1)}M` }))}
                        columns={['Para Birimi', 'Kur', 'Değişim', 'Hacim']}
                      />
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}><Paper sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}><AssessmentIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Borsa Endeksleri</Typography></Box>
                  {loading.bist && renderSkeleton(6, 50)}
                  {bistData && <DetailedTable data={bistData.indices} columns={['Endeks', 'Değer', 'Değişim', 'Hacim', 'Piy. Değeri']} />}
                </Paper></Grid>
                <Grid item xs={12} lg={6}><Paper sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}><TimelineIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Hisse Senetleri</Typography></Box>
                  {loading.bist && renderSkeleton(8, 50)}
                  {bistData && <DetailedTable data={bistData.stocks} columns={['Hisse', 'Fiyat', 'Değişim', 'Hacim', 'Piy. Değeri']} />}
                </Paper></Grid>
              </Grid>
            )}
            {tabValue === 2 && (
              <Grid item xs={12}><Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}><Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}><TrendingUpIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Emtia Piyasaları</Typography></Box>
                {loading.market && renderSkeleton(8, 60)}
                {error.market && <Alert severity="error">{error.market}</Alert>}
                {marketData && (
                  <Grid container spacing={2}>
                    {marketData.map((item) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}><Card sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>{item.icon}</Avatar>
                          <IconButton size="small" onClick={() => toggleFavorite(item.name)}>{favorites.has(item.name) ? <StarIcon sx={{ color: 'warning.main' }} /> : <StarBorderIcon />}</IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{item.name}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{item.name.includes('Petrol') ? '$' : '₺'}{item.value}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}><ChangeChip value={item.change} showIcon={false} /><Typography variant="caption" color="text.secondary">Hacim: {item.volume}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, opacity: 0.8 }}><Typography variant="caption" color="success.dark">Y: {item.high}</Typography><Typography variant="caption" color="error.dark">D: {item.low}</Typography></Box>
                      </Card></Grid>
                    ))}
                  </Grid>
                )}
              </Paper></Grid>
            )}
            {tabValue === 3 && (
              <Grid item xs={12}><Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}><TrendingUpIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Kripto Para Piyasası</Typography><Chip label={`Top ${cryptoData?.length || 0}`} variant="outlined" size="small" /></Box>
                {loading.crypto && renderSkeleton(6, 50)}
                {cryptoData && <DetailedTable data={cryptoData.map(c => ({...c, name: `${c.name} (${c.symbol})`, value: `$${c.value}`}))} columns={['Kripto Para', 'Fiyat', 'Değişim', 'Hacim', 'Piy. Değeri']}/>}
              </Paper></Grid>
            )}
            {tabValue === 4 && (
              <Grid item xs={12}><Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}><Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}><AccountBalanceIcon /></Avatar><Typography variant="h6" sx={{ fontWeight: 700 }}>Tahvil Piyasası</Typography></Box>
                {loading.bonds && renderSkeleton(5, 120)}
                {bondData && (
                  <Grid container spacing={3}>{bondData.map((bond, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}><Card sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}><Typography variant="h6" sx={{ fontWeight: 700 }}>{bond.name}</Typography><ChangeChip value={bond.change} showIcon={false} /></Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>%{bond.value}</Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2" color="text.secondary">Getiri</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{bond.yield}</Typography></Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Süre</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{bond.duration} yıl</Typography></Box>
                    </Card></Grid>
                  ))}</Grid>
                )}
              </Paper></Grid>
            )}
          </Box>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}><Typography variant="body2" color="text.secondary">Son güncelleme: {new Date().toLocaleString('tr-TR')} • Veriler 15 dakika gecikmeli olabilir.</Typography></Grid>
              <Grid item xs={12} md={4}><Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Chip icon={<TrendingUpIcon />} label="Piyasa Açık" color="success" variant="filled" sx={{color: 'white'}}/>
                <Badge badgeContent={favorites.size} color="warning"><Chip icon={<StarIcon />} label="Favoriler" variant="outlined"/></Badge>
              </Box></Grid>
            </Grid>
          </Box>
        </Container>
        <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </Box>
    </ThemeProvider>
  );
};

export default FinancialDataPanel;