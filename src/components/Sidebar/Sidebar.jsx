import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useRoute from "../../hooks/useRoute";
import { Web3Button } from "@web3modal/react";

const drawerWidth = 240;

const Sidebar = ({ drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const breakPoint = useMediaQuery(theme.breakpoints.up("md"));

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routes = useRoute();

  return (
    <Drawer
      variant={breakPoint ? "permanent" : "temporary"}
      anchor={"left"}
      open={drawerOpen}
      onClose={toggleDrawer()}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{ overflow: "auto" }}
        role="presentation"
        onClick={toggleDrawer()}
      >
        {/* Connect Wallet */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Web3Button label="Connect Wallet" icon="show" balance="hide" />
        </Box>

        <List>
          {routes.map(({ name, Icon, path, exclude }) => (
            <ListItem
              key={name}
              disablePadding
              onClick={() => navigate(path)}
              sx={{
                color: path === pathname ? theme.palette.primary.main : "",
                display: exclude ? "none" : "",
              }}
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    color: path === pathname ? theme.palette.primary.main : "",
                  }}
                >
                  {Icon ? <Icon /> : ""}
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
