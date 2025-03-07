// Backend/src/middleware/validateTeam.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Validates a team creation/update request
 * Ensures all required fields are present and valid
 */
export const validateTeam = (req: Request, res: Response, next: NextFunction): void => {
  const { id, name, ingameName, foundDate, currentPlayers, playerHistory } = req.body;

  // Basic field validation
  if (!id || !name || !ingameName || !foundDate || !currentPlayers) {
    res.status(400).json({
      message: 'Missing required fields: id, name, ingameName, foundDate, and currentPlayers are required.'
    });
    return;
  }

  // Validate ID is a positive number
  if (typeof id !== 'number' || id <= 0) {
    res.status(400).json({ message: 'ID must be a positive number.' });
    return;
  }

  // Validate currentPlayers is an array
  if (!Array.isArray(currentPlayers)) {
    res.status(400).json({ message: 'currentPlayers must be an array of player IDs.' });
    return;
  }

  // Validate playerHistory if provided
  if (playerHistory && !Array.isArray(playerHistory)) {
    res.status(400).json({ message: 'playerHistory must be an array.' });
    return;
  }

  // If playerHistory exists, validate each entry
  if (playerHistory && Array.isArray(playerHistory)) {
    for (let i = 0; i < playerHistory.length; i++) {
      const entry = playerHistory[i];
      if (!entry.playerId || !entry.name || !entry.role || !entry.startDate || !entry.endDate) {
        res.status(400).json({
          message: `Entry at index ${i} in playerHistory is missing required fields.`
        });
        return;
      }
    }
  }

  // If all validations pass, continue to the next middleware or route handler
  next();
};

/**
 * Validate team ID parameter
 * Ensures teamId is a valid number
 */
export const validateTeamId = (req: Request, res: Response, next: NextFunction): void => {
  const { teamId } = req.params;

  if (!teamId) {
    res.status(400).json({ message: 'Team ID is required.' });
    return;
  }

  const id = parseInt(teamId, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'Team ID must be a positive number.' });
    return;
  }

  next();
};