import { orders } from "./orders.js";
import { products } from "./products.js";
import { TEAMS } from "./teams.js";
import { USERS } from "./users.js";

const ADD_PRODUCT = async () => {
    const ADD_PRODUCT_PATH = 'https://myprojectbackend-uic2.onrender.com/api/products';
    
    for (const product of products) {
        try {
            const response = await fetch(ADD_PRODUCT_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            const data = await response.json();
        } catch (error) {
            console.log('Error adding product:', error);
        }
    }
}

const ADD_ORDERS = async () => {
    for (const order of orders) {
        try {
            await FETCH_ORDERS(order);
        } catch (error) {
            console.log('Error adding order:', error);
        }
    }
}

const ADD_N_ORDERS = async (n) => {
    for (let i = 0; i < n; i++) {
        const order = orders[i];
        try {
            await FETCH_ORDERS(order);
        } catch (error) {
            console.log('Error adding order:', error);
        }
    }
}

const FETCH_ORDERS = async (order) => {
    const ADD_ORDERS_PATH = 'https://myprojectbackend-uic2.onrender.com/api/orders';
    const response = await fetch(ADD_ORDERS_PATH, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    const data = await response.json();
    return data;
}

const AUTH = async () => {
    const AUTH_PATH = 'https://myprojectbackend-uic2.onrender.com/api/users/register';
    try {
        const response = await fetch(AUTH_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": "superadmin",
                "email": "superadmin@gmail.com",
                "password": "superadmin",
                "role": "superadmin"
            }),
        });
        const data = await response.json();
    }catch (error) {
        console.log('Error adding user:', error);
    }
}

const ADD_PRODUCT_TO_ORDER = async () => {
    const ADD_PRODUCT_TO_ORDER_PATH = 'https://myprojectbackend-uic2.onrender.com/api/orders/products';

    try {
        // Obtener órdenes
        const response = await fetch('https://myprojectbackend-uic2.onrender.com/api/orders/admin');
        console.log(response);
        const arrayOrders = await response.json();

        // Obtener productos
        const response2 = await fetch('https://myprojectbackend-uic2.onrender.com/api/products');
        const arrayProducts = await response2.json();
        const product = () => arrayProducts[Math.floor(Math.random() * arrayProducts.length)];

        for (const order of arrayOrders) { 
            const productsArrayToFetch = [product(), product(), product(), product()];

            for (const product of productsArrayToFetch) {
                console.log('Product:', product); 
                if (!order.id || !product.id) {
                    throw new Error('Invalid order or product data');
                }
    
                const body = {
                    orderId: order.id,
                    productId: product.id,
                    quantity: Math.floor(Math.random() * 10),
                };
    
                // Agregar producto a la orden
                const response3 = await fetch(ADD_PRODUCT_TO_ORDER_PATH, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                await response3.json();
            }
        }
    } catch (error) {
        console.error('Error adding product to order:', error);
    }
};


const CREATE_USER = async () => {
    const CREATE_USER_PATH = 'https://myprojectbackend-uic2.onrender.com/api/users/register';
    const users = USERS;
    for (const user of users) {
        try {
            await fetch(CREATE_USER_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}

const CREATE_FIRST_USER = async (user) => {
    const CREATE_USER_PATH = 'https://myprojectbackend-uic2.onrender.com/api/users/create';
    try {
        const response = await fetch(CREATE_USER_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        const data = await response.json();
        console.log(data);
        console.log('Superadmin created');
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

const CREATE_A_USER = async (user) => {
    const CREATE_USER_PATH = 'https://myprojectbackend-uic2.onrender.com/api/users/register';
    try {
        const response = await fetch(CREATE_USER_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log(data);
        console.log('User created');
    } catch (error) {
        console.error('Error creating user:', error);
    }
}


const CREATE_TEAM = async () => {
    const CREATE_TEAM_PATH = 'https://myprojectbackend-uic2.onrender.com/api/teams/create';
    for (const team of TEAMS) {
        try {
            const response = await fetch(CREATE_TEAM_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(team),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error creating team:', error);
        }
    }
}

const ASSIGN_USER_TO_TEAM = async () => {
    const ASSIGN_USER_TO_TEAM_PATH = 'https://myprojectbackend-uic2.onrender.com/api/teams/assign';
    
    const TEAMS = await (await fetch('https://myprojectbackend-uic2.onrender.com/api/teams')).json();
    const USERS = await (await fetch('https://myprojectbackend-uic2.onrender.com/api/users')).json();
    
    const getRandomUser = () => USERS[Math.floor(Math.random() * USERS.length)];
    
    for (const team of TEAMS) {
        const usersArrayToFetch = [getRandomUser(), getRandomUser(), getRandomUser(), getRandomUser()];
        for(const user of usersArrayToFetch) {
            const body = {
                userId: user.id,
                teamId: team.id,
                role: user.role
            };
            try {
                const response = await fetch(ASSIGN_USER_TO_TEAM_PATH, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error assigning user to team:', error);
            }
        }
    }
}

export const insertData = async() => {
    await ADD_PRODUCT();
    await ADD_ORDERS();
    await ADD_PRODUCT_TO_ORDER();
    await CREATE_USER();
    await CREATE_TEAM();
    console.log('Data inserted');
}

// (async () => {
//     await ADD_PRODUCT();
//     console.log('Products created');
//     await ADD_ORDERS();
//     console.log('Orders created');
//     await ADD_PRODUCT_TO_ORDER();
//     console.log('Product added to order');
//     await CREATE_USER();
//     console.log('Users created');
//     await CREATE_TEAM();
//     console.log('Teams created');
//     // await ASSIGN_USER_TO_TEAM();
//     // console.log('Users assigned to teams');
//     // await ADD_N_ORDERS(1)
//     await CREATE_FIRST_USER({
//         username: 'superadmin',
//         email: 'superadmin@example.com',
//         password: 'superadmin',
//         role: 'superadmin',
//     });
//     // await CREATE_A_USER({
//     //     username: 'example',
//     //     email: 'example@example.com',
//     //     password: 'example',
//     // });
// })()

// (async () => {
//     await CREATE_FIRST_USER({
//         username: 'superadmin',
//         email: 'superadmin@example.com',
//         password: 'superadmin',
//         role: 'superadmin',
//     });
//     await CREATE_A_USER({
//         username: 'example',
//         email: 'example@example.com',
//         password: 'example',
//     });
// })()