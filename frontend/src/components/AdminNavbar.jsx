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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
const pages = [
  { name: "Yeni Personel Kaydı", path: "/admin/personnel/new" },
  { name: "Personel Bilgi Sorgulama", path: "/admin/personnels/search" },
  { name: "Para Transferleri", path: "/admin/transactions" },
  { name: "Personel Logları", path: "/admin/personnel-logs" },
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
    <AppBar position="sticky" sx={{ bgcolor: "#E30613" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/admin"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FINFLOW
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigate(page.path)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FINFLOW
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                sx={{ my: 2, color: "white", display: "block", px: 2 }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <IconButton component={RouterLink} to="/admin/chat" color="inherit">
    <ChatIcon />
</IconButton>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Kullanıcı Menüsü">
              <Button
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0.5,
                  color: "white",
                  textTransform: "none",
                  borderRadius: 5,
                }}
                startIcon={
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(255,255,255,0.2)",
                    }}
                  >
                  A
                  </Avatar>
                }
              >
                <Typography
                  sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}
                >
                 ADMN
                </Typography>
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => handleNavigate("/profile")}>
                <ListItemIcon>
                  <PersonOutline fontSize="small" />
                </ListItemIcon>
                Profilim
              </MenuItem>
              <MenuItem onClick={() => handleNavigate("/settings")}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Ayarlar
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AdminNavbar;
