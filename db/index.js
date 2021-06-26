const { Client } = require("pg");
const DB_NAME = "cardexdb";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`
const client = new Client(DB_URL)