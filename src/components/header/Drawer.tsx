import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Grid from "@mui/material/Grid";
import { Menu, MenuItem } from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Badge, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Analytics, AutoAwesomeMotion, Dashboard, EditNote, Settings } from "@mui/icons-material";
import avatar01 from "../../assets/avatar/avatar_01.png";
import avatar02 from "../../assets/avatar/avatar_02.png";
import avatar03 from "../../assets/avatar/avatar_03.png";
import avatar04 from "../../assets/avatar/avatar_04.png";
import avatar05 from "../../assets/avatar/avatar_05.png";
import avatar06 from "../../assets/avatar/avatar_06.png";
import avatar07 from "../../assets/avatar/avatar_07.png";
import avatar08 from "../../assets/avatar/avatar_08.png";
import avatar09 from "../../assets/avatar/avatar_09.png";
import avatar10 from "../../assets/avatar/avatar_10.png";
import avatar11 from "../../assets/avatar/avatar_11.png";
import avatar12 from "../../assets/avatar/avatar_12.png";
import type { RootState } from "../../store";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../auth/authSlice";
import { useColorMode } from "../../theme";

const drawerWidth = 240;

const pages = ["Dashboard", "Simulados", "Baralhos"];

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const avatarMap: Record<string, string> = {
  avatar_01: avatar01,
  avatar_02: avatar02,
  avatar_03: avatar03,
  avatar_04: avatar04,
  avatar_05: avatar05,
  avatar_06: avatar06,
  avatar_07: avatar07,
  avatar_08: avatar08,
  avatar_09: avatar09,
  avatar_10: avatar10,
  avatar_11: avatar11,
  avatar_12: avatar12,
};

export default function PersistentDrawerLeft() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const isAdmin = true; // mudar aqui
  const [anchorNotif, setAnchorNotif] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorUser, setAnchorUser] = React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const {user} = useAppSelector((state: RootState) => state.auth);
  const avatarSrc = user?.avatarCodigo ? avatarMap[user.avatarCodigo] : undefined;

  const handleLogout = () => {
    dispatch(logout());
    setAnchorUser(null);
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="default">
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    mr: 2,
                  },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Treinar +
              </Typography>
            </Toolbar>
          </Grid>
          <Grid sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
              <IconButton color="inherit" onClick={toggleColorMode} sx={{ mr: 1 }}>
                {mode === "dark" ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchorNotif(e.currentTarget)}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorNotif}
                open={Boolean(anchorNotif)}
                onClose={() => setAnchorNotif(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => setAnchorNotif(null)}></MenuItem>
              </Menu>

              <IconButton
                color="inherit"
                onClick={(e) => setAnchorUser(e.currentTarget)}
              >
                <Avatar sx={{ width: 40, height: 40 }} src={avatarSrc}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "J"}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorUser}
                open={Boolean(anchorUser)}
                onClose={() => setAnchorUser(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorUser(null);
                    navigate("/configuracoes");
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 18, mr: 1 }} /> Configurações
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ fontSize: 18, mr: 1 }} /> Sair
                </MenuItem>
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"Dashboard"} disablePadding>
              <ListItemButton   
              component={NavLink}
              to="/dashboard"
              sx={{
                "&.active": {
                  bgcolor: "action.selected",
                  borderRadius: 2,
                  mx: 1,
                },
              }}>
                <ListItemIcon>
                  <Dashboard/>
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Simulados"} disablePadding>
              <ListItemButton  
              component={NavLink}
              to="/simulado"
              sx={{
                "&.active": {
                  bgcolor: "action.selected",
                  borderRadius: 2,
                  mx: 1,
                },
              }}>
                <ListItemIcon>
                  <EditNote/>
                </ListItemIcon>
                <ListItemText primary={"Simulados"} />
              </ListItemButton >
            </ListItem>
            <ListItem key={"Flashcards"} disablePadding>
              <ListItemButton  
                component={NavLink}
                to="/flashcard"
                sx={{
                  "&.active": {
                    bgcolor: "action.selected",
                    borderRadius: 2,
                    mx: 1,
                  },
                }}>
                <ListItemIcon>
                  <AutoAwesomeMotion/>
                </ListItemIcon>
                <ListItemText primary={"Flashcards"} />
              </ListItemButton>
            </ListItem>
              <ListItem key={"Desempenho"} disablePadding>
              <ListItemButton  
                component={NavLink}
                to="/desempenho"
                sx={{
                  "&.active": {
                    bgcolor: "action.selected",
                    borderRadius: 2,
                    mx: 1,
                  },
                }}>
                <ListItemIcon>
                  <Analytics/>
                </ListItemIcon>
                <ListItemText primary={"Desempenho"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Configurações"} disablePadding>
              <ListItemButton  
                component={NavLink}
                to="/configuracao"
                sx={{
                  "&.active": {
                    bgcolor: "action.selected",
                    borderRadius: 2,
                    mx: 1,
                  },
                }}>
                <ListItemIcon>
                  <Settings/>
                </ListItemIcon>
                <ListItemText primary={"Configurações"} />
              </ListItemButton>
            </ListItem>
        </List>
        {isAdmin && (
        <>
          <Divider>
            <Typography>Opções Admin</Typography>
          </Divider>
          <List>
            {["Perguntas", "Usuários", "Configuração"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      </Drawer>
      <Main open={open} >
        <DrawerHeader />
        <Outlet/>
      </Main>
    </Box>
  );
}
