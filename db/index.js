const { Client } = require("pg");
const DB_NAME = "cardex-dev";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`
const client = new Client(DB_URL)
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;

async function createUser({username, password}) {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
        const {rows: [user]} = await client.query(`
            INSERT INTO users (username, password)
            VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `, [username, hashedPassword])

        return user;
    } catch (error) {
        throw error
    }
}

module.exports = {
    client,
    createUser
}