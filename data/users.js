import { faker } from "@faker-js/faker";

function generateRandomUser(index) {
    let role = 'staff';  // Default role is 'staff'
    // Assign 'superadmin' to the first user
    if (index === -10) role = 'superadmin';
    else {
        const rand = Math.random();
        if (rand < 0.65) {
            role = 'staff';      // 65% chance for 'staff'
        } else if (rand < 0.97) {
            role = 'manager';    // 32% chance for 'manager'
        } else {
            role = 'admin'; // 3% chance for 'superadmin'
        }
    }
  
    // Generate random user data
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = faker.internet.password(); 

    return {
        username: username, 
        email: email,
        password: password,
        role: role,
    }
}

// Generate an array of random users
export const USERS = Array.from({ length: 5 }, (_, index) => generateRandomUser(index));
