import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import GameControls from './GameControls';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({onLogout}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            League Manager
          </Typography>
          {/* Game Controls as separate component */}
          <GameControls />
          {/* Account Settings / Credits Icon */}
          <IconButton
              edge="end"
              color="inherit"
              onClick={handleAccountMenuOpen}
              sx={{ ml: 2 }}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Credits</MenuItem>
            <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onLogout();
                }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
