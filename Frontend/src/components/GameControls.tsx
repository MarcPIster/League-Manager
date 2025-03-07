import React, { useState } from 'react';
import { Box, Select, MenuItem, Button } from '@mui/material';

const GameControls: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('');

  // Handler for dropdown changes
  const handleGameChange = (event: React.ChangeEvent<{ value: usnknown }>) => {
    setSelectedGame(event.target.value as string);
  };

  return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <Select
      value={selectedGame}
  onChange={handleGameChange}
  displayEmpty
  variant="standard"
  sx={{
    mr: 2,
        color: 'white',
        '.MuiSelect-icon': { color: 'white' },
  }}
>
  <MenuItem value="">
      <em>Load Game</em>
  </MenuItem>
  <MenuItem value="Game 1">Game 1</MenuItem>
  <MenuItem value="Game 2">Game 2</MenuItem>
  <MenuItem value="Game 3">Game 3</MenuItem>
  </Select>
  <Button color="inherit">Start New Game</Button>
  </Box>
);
};

export default GameControls;
