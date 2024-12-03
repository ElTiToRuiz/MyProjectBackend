import { TeamController } from "../controllers/user/teamController.js";
import { TeamModel } from "../models/teams/teamModel.js";
import { io, userSockets } from "../server.js";
import { joinRoleRooms } from "./index.js";

export const joinTeams = async (socket, user) => {
    try {
        if (!user || !user.id || !user.role) {
            console.error('Invalid user data:', user);
            return;
        }

        if (user.role === 'superadmin' || user.role === 'admin') {
            const allTeams = await TeamModel.findAll();
            allTeams.map(async (team) => socket.join(team.id));
        } else {
            const teams = await TeamController.getAllTeamsForUser({ userId: user.id });
            if (teams && teams.length > 0) {
               teams.map((team) => socket.join(team.teamId));
            } else {
                console.log(`User ${user.id} has no teams`);
            }
        }
    } catch (error) {
        console.error('Error fetching teams for user:', error);
        throw error;
    }
};

export const addStaffToTeam = async (team, user) => {
    try {
        if (!team || !user) {
            console.error('Invalid team, user, or admin data:', { team, user });
            return;
        }

        // Agregar miembro al equipo (esto sería el backend agregando al staff)
        const userSocket = userSockets[user.id];
        
        if (userSocket) {
            userSocket.join(team.id);
            // console.log('User rooms:', userSocket.rooms);
            // console.log('Team id:', team.id);
        } else {
            console.error('User socketId not found for user:', user.id);
        }
        
        await TeamController.addMemberToTeam({ teamId: team.id, userId: user.id });
        io.to(team.id).emit('team-member-added', { team, user });
    } catch (error) {
        userSockets.leave(team.id);
        console.error('Error adding staff to team:', error);
        throw new Error('Error adding staff to team: ' + error.message);
    }
}

export const removeStaffFromTeam = async (team, user) => {
    try {
        if (!team || !user) {
            console.error('Invalid team, user, or admin data:', { team, user });
            return;
        }

        // Eliminar al miembro del equipo en la base de datos o en la estructura de datos
        console.log('Removing staff from team:', team.id, user.id);
        await TeamController.removeMemberFromTeam({ teamId: team.id, userId: user.id });

        // // Notificar a todos los miembros del equipo (si es necesario)
        io.to(team.id).emit('team-member-removed', {team, user});
       
       
        // const adminSocket = userSockets[admin.id];
        const userSocket = userSockets[user.id];
        if (userSocket && user.role !== 'superadmin' && user.role !== 'admin') {
            userSocket.leave(team.id);
            // console.log('User rooms:', userSocket.rooms);
        }
    } catch (error) {
        console.error('Error removing staff from team:', error);
        throw error;
    }
}


export const leaveRooms = async (socket, userId) => {
    try {
        if (!userId) {
            console.error('Invalid userId:', userId);
            return;
        }

        const teams = await TeamController.getAllTeamsForUser({ userId });
        if (teams && teams.length > 0) {
           teams.map((team) => socket.leave(team.id));
        }
        ['superadmin', 'admin', 'manager', 'staff'].forEach((role) => socket.leave(role));
    } catch (error) {
        console.error('Error while leaving rooms:', error);
        throw error;
    }
};
