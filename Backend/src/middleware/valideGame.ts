import { Request, Response, NextFunction } from 'express';

/**
 * Validates a game creation/update request
 * Ensures all required fields are present and valid
 */
export const validateGame = (req: Request, res: Response, next: NextFunction): void => {
  const { duration, patch, teams } = req.body;

  // Basic field validation
  if (!duration || !patch || !teams) {
    res.status(400).json({ message: 'Missing required fields: duration, patch, and teams are required.' });
    return;
  }

  // Validate that duration is a positive number
  if (typeof duration !== 'number' || duration <= 0) {
    res.status(400).json({ message: 'Duration must be a positive number.' });
    return;
  }

  // Validate teams array
  if (!Array.isArray(teams) || teams.length !== 2) {
    res.status(400).json({ message: 'Teams must be an array with exactly 2 teams.' });
    return;
  }

  // Validate each team
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];

    // Check required team fields
    if (!team.teamId || !team.teamName || !team.result || !Array.isArray(team.players)) {
      res.status(400).json({
        message: `Team at index ${i} is missing required fields. Each team must have teamId, teamName, result, and players.`
      });
      return;
    }

    // Validate result is either "win" or "loss"
    if (team.result !== 'win' && team.result !== 'loss') {
      res.status(400).json({ message: `Team at index ${i} has invalid result. Must be "win" or "loss".` });
      return;
    }

    // Ensure only one team has "win" as result
    const otherTeamIdx = i === 0 ? 1 : 0;
    if (team.result === 'win' && teams[otherTeamIdx]?.result === 'win') {
      res.status(400).json({ message: 'Only one team can have a "win" result.' });
      return;
    }

    // Validate each player
    for (let j = 0; j < team.players.length; j++) {
      const player = team.players[j];

      // Check required player fields
      if (!player.playerId || !player.playerName || !player.role) {
        res.status(400).json({
          message: `Player at index ${j} in team ${i} is missing required fields. Each player must have playerId, playerName, and role.`
        });
        return;
      }

      // Validate numeric fields are numbers
      const numericFields = ['kills', 'deaths', 'assists', 'cs', 'gold'];
      for (const field of numericFields) {
        if (player[field] !== undefined && typeof player[field] !== 'number') {
          res.status(400).json({
            message: `Player at index ${j} in team ${i} has invalid ${field}. Must be a number.`
          });
          return;
        }
      }
    }
  }

  // If all validations pass, continue to the next middleware or route handler
  next();
};

/**
 * Validate game ID parameter
 * Ensures gameId is a valid number
 */
export const validateGameId = (req: Request, res: Response, next: NextFunction): void => {
  const { gameId } = req.params;

  if (!gameId) {
    res.status(400).json({ message: 'Game ID is required.' });
    return;
  }

  const id = parseInt(gameId, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'Game ID must be a positive number.' });
    return;
  }

  next();
};