/* eslint-disable react/jsx-no-comment-textnodes */
import { Box, Drawer, AppBar, CssBaseline, Toolbar, Typography, Divider } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import { useContext } from "react";
import { UserContext } from "../App";

const drawerWidth = 240;

export default function DefaultLayout({ setUser }) {
   const User = useContext(UserContext);
   const navigate = useNavigate();

   function logout() {
      sessionStorage.clear();
      setUser(null);
      navigate("/login");
   }

   return (
      <Box sx={{ display: "flex" }}>
         <CssBaseline />
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
               {User ? (
                  <Typography variant="h6" noWrap component="div">
                     Hi {User.firstName}
                  </Typography>
               ) : null}

               <Typography variant="h6" noWrap component="div">
                  <Link to="/profile">Profile</Link>
               </Typography>
               <button onClick={logout}>Logout</button>
               <Link to="/">Home</Link>
            </Toolbar>
         </AppBar>

         <Drawer
            variant="permanent"
            sx={{
               width: drawerWidth,
               flexShrink: 0,
               [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
         >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
               <MenuItem text="Dashboard" link="/" />
               <MenuItem text="Employees" link="/employees" />
               <MenuItem text="Streams" link="/streams" />
               <MenuItem text="Leave Requests" link="/leave-requests" />
               <MenuItem text="Leave" link="/leave" />
               <Divider />
            </Box>
         </Drawer>

         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <button onClick={() => navigate(-1)}>Go back </button>

            <Outlet />
         </Box>
      </Box>
   );
}
