import React, { useState, useEffect } from 'react'; // useEffect import edildi
import { Link } from 'react-router-dom'; // Yönlendirme için Link import edildi
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Avatar,
  Paper,
  Alert,
  Fab,
} from '@mui/material';
import {
  Search,
  Close,
  Chat,
  ChevronLeft,
  ChevronRight,
  Diamond
} from '@mui/icons-material';
import firstSlideImage from '../assets/img1.png';
import secondSlideImage from '../assets/img2.png';
import thirdSlideImage from '../assets/img3.png';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotification, setShowNotification] = useState(true);

  const slides = [
    {
      title: "FINFLOW işe alım yazılı sınav sonuçlarına göre mülakata katılmaya hak kazanan adayların mülakat planı yayınlanmıştır.",
      buttonText: "DETAYLI BİLGİ",
      image: firstSlideImage
    },
    {
      title: "Dijital bankacılık hizmetlerimizle 7/24 yanınızdayız",
      buttonText: "KEŞFET",
      image: secondSlideImage
    },
    {
      title: "Yatırım fırsatları ile geleceğinizi güvence altına alın",
      buttonText: "BAŞVUR",
      image: thirdSlideImage
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  useEffect(() => {
    const slideTimer = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(slideTimer);
    };
  }, [currentSlide]);

  const ziraatRed = '#E30613';

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#dc2626', boxShadow: 'none' }}>
        <Toolbar sx={{ minHeight: '48px !important', py: 1 }}>
          <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Diamond fontSize="small" /> Süper Şube
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                Z Ticaret Yolu
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                Ürün ve Hizmet Ücretleri
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                Kampanyalar
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                Dijital Bankacılık
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                Yatırımcı İlişkileri
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                Bankamız
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  borderLeft: '1px solid rgba(255,255,255,0.3)',
                  pl: 2
                }}
              >
                EN
              </Typography>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      {/* Main Navigation */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ py: 1.5 }}>
          <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                     <AccountBalanceIcon sx={{ color: ziraatRed, mr: 1, fontSize: 60 }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 'bold' }}>
                  FINFLOW
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography 
                  component={Link}
                  to="/customer-login"
                  variant="body1" 
                  sx={{ 
                    color: '#333', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    textDecoration: 'none' 
                  }}
                >
                  Müşteri Girişi  
                </Typography>
                <Typography 
                  component={Link}
                  to="/personnel-login"
                  variant="body1" 
                  sx={{ 
                    color: '#333', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  Personel Girişi
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: '#dc2626', 
                  color: '#dc2626',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                BankKart
              </Button>
              
              <Avatar sx={{ bgcolor: '#ff6b35', width: 32, height: 32, fontSize: '12px' }}>
                ÖÖ
              </Avatar>
              
              <IconButton>
                <Search />
              </IconButton>
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#dc2626',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: '#b91c1c' }
                }}
              >
                İnternet Şubesi
              </Button>
              
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: '#dc2626', 
                  color: '#dc2626',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Müşteri Ol
              </Button>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Hero Slider Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
          minHeight: '500px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              minHeight: '500px',
              gap: 5
            }}
          >
            {/* Left Column */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, color: 'white' }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: 4,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                {slides[currentSlide].title}
              </Typography>
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: 'white',
                  color: '#dc2626',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  mb: 4,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                {slides[currentSlide].buttonText}
              </Button>
            </Box>
            
            {/* Right Column */}
            <Box sx={{ width: { xs: '100%', md: '100%' } }}>
              <Paper 
                sx={{ 
                  height: 600, 
                  backgroundImage: `url(${slides[currentSlide].image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2
                }}
              />
            </Box>
          </Box>
        </Container>

        {/* Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
        >
          <ChevronLeft />
        </IconButton>
        
        <IconButton
          onClick={nextSlide}
          sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
        >
          <ChevronRight />
        </IconButton>
        
        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '10%',
            display: 'flex',
            gap: 1.5,
          }}
        >
          {slides.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                minWidth: 'auto',
                p: 0,
                backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                boxShadow: currentSlide === index ? '0 0 0 3px rgba(0,0,0,0.4)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Cookie Notification */}
      {showNotification && (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0', borderRadius: 0, '& .MuiAlert-icon': { display: 'none' } }}
          action={
            <IconButton size="small" onClick={() => setShowNotification(false)} sx={{ color: '#666' }}>
              <Close fontSize="small" />
            </IconButton>
          }
        >
          <Typography variant="caption" sx={{ color: '#666' }}>
            Sitemizde size en iyi hizmeti sunabilmek için çerez kullanılmaktadır. Detaylar için{' '}
            <Typography component="span" variant="caption" sx={{ color: '#dc2626', textDecoration: 'underline', cursor: 'pointer' }}>
              Gizlilik Politikamızı
            </Typography>
            {' '}ve{' '}
            <Typography component="span" variant="caption" sx={{ color: '#dc2626', textDecoration: 'underline', cursor: 'pointer' }}>
              Çerez Politikamızı
            </Typography>
            {' '}inceleyebilirsiniz.
          </Typography>
        </Alert>
      )}
      {/* Chat FAB */}
      <Fab sx={{ position: 'fixed', bottom: 30, right: 30, backgroundColor: '#dc2626', color: 'white', '&:hover': { backgroundColor: '#b91c1c' }, boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)' }}>
        <Chat />
      </Fab>
    </Box>
  );
};

export default LandingPage;