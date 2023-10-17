import * as React from "react";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "../Navbar/Navbar";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

export default function ClippedDrawer({ children }) {
  const auth = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff" }}>
      <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} auth={auth} />
      {auth && <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        {children}
        {!auth && <Footer />}
      </Box>
    </Box>
  );
}
