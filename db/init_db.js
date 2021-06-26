const {
    client,
    createUser
} = require("./index");

async function buildTables() {
    try {
        client.connect()

        console.log("starting to drop tables");
        //DROP TABLE will go in here
        await client.query(`
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS cards;
        DROP TABLE IF EXISTS users;
        `)
        console.log("finished dropping tables")

        console.log("Starting to create tables")
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE cards(
                ID SERIAL PRIMARY KEY,
                card_title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                price INT NULL,
                card_img BYTEA NULL,
                creation_date DATE NOT NULL DEFAULT CURRENT_DATE
            );
            CREATE TABLE tags(
                ID SERIAL PRIMARY KEY,
                tag_content VARCHAR(255) UNIQUE NOT NULL
            );
            CREATE TABLE cart(
                ID SERIAL PRIMARY KEY,
                "cardId" INT REFERENCES cards(ID),
                "userId" INT REFERENCES users(ID),
                UNIQUE("cardId", "userId")
            );
            CREATE TABLE img(
                ID SERIAL PRIMARY KEY,
                "cardId" INT REFENCES cards(ID),
                name TEXT,
                img TEXT
            )
        `)
    } catch (error) {
        throw error
    }
}

async function populateInitialData() {
    try {
        console.log("creating intial users")
        await createUser({
            username: "Eman",
            password: "CodingGod"
        })
        console.log("finished creating intial users")

        await createCard({
            card_title: "Lebron James Topps Rookie",
            description: "mint condition LBJ rookie card",
            price: "$1200",
            card_img: "",         
        })

        console.log("creating initial tags")
        await createTags("Pokemon")
        await createTags("Basketball")
        console.log("finished creating intial tags")
    } catch(error) {
        throw error
    }
}

buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end())