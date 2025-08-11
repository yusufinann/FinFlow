import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  ListItemIcon,
  Fade,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import PersonOutline from "@mui/icons-material/PersonOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import { Link as RouterLink } from 'react-router-dom';

const pages = [
  { 
    name: "Yeni Personel", 
    path: "/admin/personnel/new",
    icon: PersonAddIcon,
    color: "#4CAF50"
  },
  { 
    name: "Personel Sorgulama", 
    path: "/admin/personnels/search",
    icon: SearchIcon,
    color: "#2196F3"
  },
  { 
    name: "Para Transferleri", 
    path: "/admin/transactions",
    icon: SwapHorizIcon,
    color: "#FF9800"
  },
  { 
    name: "Personel Logları", 
    path: "/admin/personnel-logs",
    icon: AssignmentIcon,
    color: "#9C27B0"
  },
];

function AdminNavbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    navigate("/personnel-login");
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: '#f44336',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          <AdminPanelSettingsIcon 
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              mr: 1.5,
              fontSize: 28,
              color: '#FFD700',
            }} 
          />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/admin"
            sx={{
              mr: 3,
              display: { xs: "none", md: "flex" },
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            FINFLOW
          </Typography>
          
          <Chip 
            label="ADMIN PANEL" 
            size="small" 
            sx={{ 
              mr: 3,
              display: { xs: "none", md: "flex" },
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              fontWeight: 700,
              fontSize: '0.7rem',
            }} 
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              TransitionComponent={Fade}
              sx={{ 
                display: { xs: "block", md: "none" },
                '& .MuiPaper-root': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  mt: 1,
                }
              }}
            >
              {pages.map((page) => {
                const IconComponent = page.icon;
                return (
                  <MenuItem
                    key={page.name}
                    onClick={() => handleNavigate(page.path)}
                    sx={{
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateX(8px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon>
                      <IconComponent sx={{ color: page.color, fontSize: 22 }} />
                    </ListItemIcon>
                    <Typography sx={{ color: '#333', fontWeight: 500 }}>
                      {page.name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          <AdminPanelSettingsIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1, color: '#FFD700' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/admin"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FINFLOW
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 2 }}>
            {pages.map((page) => {
              const IconComponent = page.icon;
              return (
                <Button
                  key={page.name}
                  onClick={() => handleNavigate(page.path)}
                  startIcon={<IconComponent sx={{ fontSize: 18 }} />}
                  sx={{ 
                    my: 2, 
                    color: "white", 
                    display: "flex", 
                    px: 2.5,
                    py: 1,
                    mx: 0.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {page.name}
                </Button>
              );
            })}
          </Box>

          <IconButton 
            component={RouterLink} 
            to="/admin/chat" 
            color="inherit"
            sx={{
              mr: 2,
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ChatIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Yönetici Menüsü" arrow>
              <Button
                onClick={handleOpenUserMenu}
                sx={{
                  p: 1,
                  color: "white",
                  textTransform: "none",
                  borderRadius: 4,
                  background: 'rgba(255, 215, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 215, 0, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#333',
                      fontWeight: 900,
                      fontSize: '1rem',
                    }}
                  >
                    A
                  </Avatar>
                }
              >
                <Box sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>
                    ADMIN
                  </Typography>
                  <Chip 
                    label="Yönetici" 
                    size="small" 
                    sx={{ 
                      height: 16,
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(255, 215, 0, 0.3)',
                      color: '#FFD700',
                    }} 
                  />
                </Box>
              </Button>
            </Tooltip>
            <Menu
              sx={{ 
                mt: "50px",
                '& .MuiPaper-root': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  minWidth: 200,
                }
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              TransitionComponent={Fade}
            >
              <MenuItem 
                onClick={() => handleNavigate("/profile")}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                <ListItemIcon>
                  <PersonOutline fontSize="small" sx={{ color: '#666' }} />
                </ListItemIcon>
                <Typography sx={{ color: '#333', fontWeight: 500 }}>Profilim</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => handleNavigate("/settings")}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" sx={{ color: '#666' }} />
                </ListItemIcon>
                <Typography sx={{ color: '#333', fontWeight: 500 }}>Ayarlar</Typography>
              </MenuItem>
              <Divider sx={{ my: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  }
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: '#f44336' }} />
                </ListItemIcon>
                <Typography sx={{ color: '#f44336', fontWeight: 500 }}>Çıkış Yap</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AdminNavbar;