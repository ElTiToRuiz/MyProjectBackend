import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { setupDatabase } from './models/index.js';
import { usersRouter } from './routes/user.js';
import { ordersRouter } from './routes/order.js';
import { productsRouter } from './routes/product.js';
import { teamsRouter } from './routes/team.js';
import { shipmentRouter } from './routes/shipment.js';
import { notificationRouter } from './routes/notification.js';
import { authRouter } from './routes/auth.js';
import { addStaffToTeam, joinTeams, removeStaffFromTeam } from './sockets/teams.js';
import { joinRoleRooms } from './sockets/index.js';
import { supportRouter } from './routes/support.js';
import { statsRouter } from './routes/stats.js';
import { init } from './services/init.js';


const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

console.log('Socket.IO server initialized');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,              
}));

export const userSockets = {}

io.on('connection', (socket) => {
    socket.emit('connected', { message: 'Connected to the server' });

    // Handle 'client-connected' event
    socket.on('client-connected', async (user) => {
        try {
            userSockets[user.id] = socket;
            await joinTeams(socket, user)
            joinRoleRooms(socket, user);
            console.log('Joined rooms:', socket.rooms);
            socket.emit('user-connected', { message: 'User connected successfully', user });
        } catch (error) {
            console.error('Error in client-connected:', error);
            socket.emit('error', { message: 'Failed to handle client connection', error });
        }
    });


    socket.on('add-user-to-team', async ({team, user}) => {
        try{
            await addStaffToTeam(team, user);
        }catch(error){
            console.error('Error adding user to team:', error);
            socket.emit('error', { message: 'Failed to add user to team', error });
        }
    });

    socket.on('remove-user-from-team', async ({team, user}) => {
        try{
            await removeStaffFromTeam(team, user);
        }catch(error){
            console.error('Error removing user from team:', error);
            socket.emit('error', { message: 'Failed to remove user from team', error });
        }
    });

    // Handle disconnection
    socket.on('disconnect', async (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
});
           
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/shipment', shipmentRouter)
app.use('/api/notifications', notificationRouter);
app.use('/api/auth', authRouter);
app.use('/api/support', supportRouter);
app.use('/api/stats', statsRouter);

// Connect to the database and setup associations
await setupDatabase();
const PORT = process.env.PORT || 3000;
await init();

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

