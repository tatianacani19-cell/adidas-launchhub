import bcrypt from "bcryptjs";

const users = [
    {
        id: 1,
        name: "Tatiana C.",
        email: "tatiana@adidas.com",
        password: bcrypt.hashSync("password123", 10),
        role: "Marketing User",
    },
    {
        id: 2,
        name: "Daniel H.",
        email: "daniel@adidas.com",
        password: bcrypt.hashSync("password123", 10),
        role: "Marketing Manager",
    },
];

export const findByEmail = (email) => {
    return users.find((u) => u.email === email);
};

export const findById = (id) => {
    return users.find((u) => u.id === id);
};
