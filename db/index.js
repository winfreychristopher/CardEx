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

async function createCard({
    card_title,
    description,
    price,
    card_img,
    view_count
}) {
    try {
        const {rows: [card]} = await client.query(`
        INSERT INTO cards(card_title, description, price, card_img, view_count)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `, [card_title, description, price, card_img, view_count])

        return card;
    } catch (error) {
        throw error
    }
}

async function createTags(tag_content) {
    try {
        const {rows: [tags]} = await client.query(`
        INSERT INTO tags(tag_content)
        VALUES ($1)
        RETURNING *;
        `, [tag_content])

        return tags;
    } catch (error) {
        throw error
    }
}

async function getTagByContent(tag_content) {
    try {
        const {rows: [tag]} = await client.query(`
        SELECT * FROM tags
        WHERE tag_content = '${tag_content}'
        `)

        return tag
    } catch (error) {
        throw error
    }
}

async function createCardTag(cardId, tagId) {
    try {
        await client.query(`
        INSERT INTO card_tags("cardId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("cardId", "tagId") DO NOTHING
        `, [cardId, tagId])

    } catch (error) {
        throw error
    }
}

module.exports = {
    client,
    createUser,
    createCard,
    createTags,
    getTagByContent,
    createCardTag
}