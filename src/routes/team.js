import express from 'express';
import { TeamController } from '../controllers/user/teamController.js';

export const teamsRouter = express.Router();

// Route for getting all teams
teamsRouter.post('/', TeamController.getAllTeams);

// Route for getting a team by id
teamsRouter.get('/:teamId', TeamController.getTeamById);

// Route for creating a team
teamsRouter.post('/create', TeamController.createTeam);

// Route for updating a team
teamsRouter.put('/update', TeamController.updateTeam);

// Route for deleting a team
teamsRouter.post('/delete', TeamController.deleteTeam);

// Route for getting all users in a team
teamsRouter.get('/users/:teamId', TeamController.getMembersForTeam);

// Route for adding a user to a team
// teamsRouter.post('/assign', TeamController.addMemberToTeam);

// Route for removing a user from a team
// teamsRouter.post('/remove', TeamController.removeMemberFromTeam);

