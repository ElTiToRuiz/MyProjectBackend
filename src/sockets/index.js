import { io } from "../server.js";

// Función para unirse a las salas dependiendo del rol del usuario
export const joinRoleRooms = (socket, user) => {
    switch (user.role) {
        case 'superadmin':
            socket.join('superadmin');
            socket.join('admin');
            socket.join('manager');
            socket.join('staff');
            break;
        case 'admin':
            socket.join('admin');
            socket.join('manager');
            socket.join('staff');
            break;
        case 'manager':
            socket.join('manager');
            socket.join('staff');
            break;
        case 'staff':
            socket.join('staff');
            break;
        default:
            console.log('Rol not valid');
    }
};

const sendToRoom = (room, name, message) => {
    if (!name || !message || !room) throw new Error('Missing parameters');
    // console.log('\n\nSending to room:', room);
    // console.log('Sending with name:', name);
    // console.log('Sending message:', message);
    io.to(room).emit(name, message);
};

// Funciones para enviar notificaciones a salas específicas
export const sendNotifcationSuperAdmin = (name, notification) => sendToRoom('superadmin', name, notification);
export const sendNotifcationAdmin = (name, notification) => sendToRoom('admin', name, notification);
export const sendNotifcationManager = (name, notification) => sendToRoom('manager', name, notification);
export const sendNotifcationStaff = (name, notification) =>sendToRoom('staff', name, notification);
