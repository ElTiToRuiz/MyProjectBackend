
import { TeamMembersModel } from "../../models/teams/teamMembersModel.js";
import { TeamModel } from "../../models/teams/teamModel.js";
import { UserModel } from "../../models/user/userModel.js";
import { sendNotifcationAdmin } from "../../sockets/index.js";
import { io } from "../../server.js";

export class TeamController{
    static async getAllTeams(req, res){
        try{
            const user = req.body
            if(['superadmin', 'admin'].includes(user.role)){
                const teams = await TeamModel.findAll();
                return res.status(200).json(teams);
            }else{
                const result = await TeamMembersModel.findAll({
                    where: {
                        userId: user.id
                    },
                    attributes: [],  
                    include: [
                        {
                            model: TeamModel,
                            as: 'team',
                            required: true 
                        }
                    ]
                });
                const teams = result.map(team => team.team);
                return res.status(200).json(teams);
            }
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to retrieve teams', error});
        }
    }

    static async getTeamById(req, res){
        try{
            const teamId = req.params.teamId;
            const team = await TeamModel.findByPk(teamId);
            if(!team) return res.status(404).json({message: 'Team not found'});
            return res.status(200).json(team);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to retrieve team', error});
        }
    }

    static async createTeam(req, res){
        try{
            const newTeam = await TeamModel.create(req.body);
            sendNotifcationAdmin('team-created', newTeam);

            return res.status(201).json(newTeam);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to create team', error});
        }
    }

    static async updateTeam(req, res){
        try{
            const {id, name, description} = req.body;
            const team = await TeamModel.findByPk(id);
            if(!team) return res.status(404).json({message: 'Team not found'});

            team.name = name ?? team.name;
            team.description = description ?? team.description;
            await team.save();
            // Emit event to all users in the team
            io.to(team.id).emit('team-updated', team);
            return res.status(200).json(team);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to update team', error});
        }
    }


    static async deleteTeam(req, res){
        try{
            const teamId = req.body.id
            const team = await TeamModel.findByPk(teamId);
            if(!team) return res.status(404).json({message: 'Team not found'});
            await team.destroy();
            // Emit event to all users in the team
            sendNotifcationAdmin('team-deleted', team);
            io.to(team.id).emit('team-deleted', team);
            return res.status(200).json({message: 'Team deleted successfully'});
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to delete team', error});
        }
    }

    static async getMembersForTeam(req, res){
        try{
            const teamId = req.params.teamId;
            const team = await TeamModel.findByPk(teamId);
            if (!team) return res.status(404).json({ message: 'Team not found' });

            const teamMembers = await TeamMembersModel.findAll({
                where: {teamId},
                include: {
                    model: UserModel,
                    as: 'user',
                    required: true,
                    exclude: ['password']
                }
            })
            const users = teamMembers.map(teamMember => {
                // return user data with password excluded
                const { password, ...userWithoutPassword } = teamMember.user.dataValues;
                return userWithoutPassword;
            });
            if(!team) return res.status(404).json({message: 'Team not found'});
            return res.status(200).json(users);
        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Failed to retrieve members for team', error});
        }
    }

    static async addMemberToTeam({teamId, userId}){
        try{
            const team = await TeamModel.findByPk(teamId);
            if(!team) throw new Error('Team not found');
            const user = await UserModel.findByPk(userId, {attributes: { exclude: ['password'] }});
            if(!user) throw new Error('User not found');
            await TeamMembersModel.create({teamId, userId, role: user.role});
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    static async removeMemberFromTeam({teamId, userId}){
        try{
            const team = await TeamModel.findByPk(teamId);
            if(!team) throw new Error('Team not found');
            const user = await UserModel.findByPk(userId);
            if(!user) throw new Error('User not found');
            await TeamMembersModel.destroy({where: {teamId, userId}});
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    static async getAllTeamsForUser({userId}){
        try{
            const teams = await TeamMembersModel.findAll({
                where: {userId},
                include: {
                    model: TeamModel,
                    as: 'team',
                    required: true
                }
            });
            return teams;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}