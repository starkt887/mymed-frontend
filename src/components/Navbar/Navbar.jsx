import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";
import weblogo from "../../assets/weblogo.png";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { fetchNotificationAPI } from "../../services/NotificationService";
import {
  STORE_NOTIFICATIONS,
  UPDATE_NOTIFICATION_COUNT,
} from "../../redux/notificationReducer";

export default function Navbar({ toggleDrawer, auth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { notificationCount } = useSelector((state) => state.notification);
  const [notificationInterval, setNotificationInterval] = useState(500);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) {
        setNotificationInterval(60000);
        fetchNotification();
      }
    }, notificationInterval);

    return () => {
      clearInterval(interval);
    };
  }, [auth, notificationInterval]);

  const fetchNotification = async () => {
    const [res, error] = await fetchNotificationAPI({ id: user.id });
    if (!error) {
      let count = 0;
      const data = res.data.notifications;
      data.forEach((element) => {
        if (element.isRead === false) count += 1;
      });
      dispatch(STORE_NOTIFICATIONS(data));
      dispatch(UPDATE_NOTIFICATION_COUNT(count));
    }
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {auth ? (
        <Box>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={() => navigate("/profile")}>
            <Avatar
              sx={{ mx: 1, width: 35, height: 35, cursor: "pointer" }}
              alt="Profile"
              src={user.profilepic}
            >
              <AccountCircle sx={{ color: "#000" }} />
            </Avatar>
            <p>Profile</p>
          </MenuItem>
        </Box>
      ) : (
        <Box>
          <MenuItem onClick={() => navigate("/")}>
            <InfoIcon sx={{ mr: 1 }} />
            <p>ABOUT</p>
          </MenuItem>
          <MenuItem onClick={() => navigate("/auth")}>
            <LockOpenIcon sx={{ mr: 1 }} />
            <p>LOGIN</p>
          </MenuItem>
        </Box>
      )}
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
        }}
      >
        <Toolbar>
          {auth && (
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="open drawer"
              sx={{ mr: 1, display: { xs: "flex", md: "none" } }}
              onClick={toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              cursor: "pointer",
              display: auth ? { xs: "none", sm: "block" } : "block",
            }}
            onClick={() => navigate(auth ? "dashboard" : "/")}
          >
            MED
          </Typography> */}
          <img
            src={weblogo}
            alt="Logo"
            height={60}
            onClick={() => navigate(auth ? "dashboard" : "/")}
          />
          <Typography
            variant="p"
            noWrap
            component="div"
            sx={{
              cursor: "pointer",

              fontWeight: "bold",
              fontSize: "12px",
            }}
            color="#4328be"
          >
            (B.E.T.A)
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {auth ? (
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {/* <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="primary"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton> */}
              <IconButton size="large" color="primary" onClick={() => navigate("/notification")}>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {user.profilepic ? (
                <Avatar
                  sx={{ mx: 1, width: 35, height: 35, cursor: "pointer" }}
                  alt="Profile"
                  src={user.profilepic}
                  onClick={() => navigate("/profile")}
                >
                  <AccountCircle color="primary" />
                </Avatar>
              ) : (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  color="primary"
                  onClick={() => navigate("/profile")}
                >
                  <AccountCircle sx={{ mr: 1 }} />
                </IconButton>
              )}

              <Typography
                variant="subtitle1"
                color="#000"
                sx={{ cursor: "pointer" }}
              >
                {user.name.split(" ")[0]}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {/* <Button onClick={() => navigate("/")}>ABOUT</Button>
              <Button onClick={() => navigate("/auth")}>LOGIN</Button> */}
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              >
                HOME
              </Link>
              <Link
                to="/auth/users"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              >
                PATIENT
              </Link>
              <Link
                to="/auth/doctors"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              >
                DOCTOR
              </Link>

              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              >
                ABOUT
              </Link>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: "600",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              >
                CONTACT
              </Link>
            </Box>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="primary"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}
