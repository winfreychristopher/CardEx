const {
    client,
    createUser,
    createCard,
    createTags,
    getTagByContent,
    createCardTag
} = require("./index");

async function buildTables() {
    try {
        client.connect()

        console.log("starting to drop tables");
        //DROP TABLE will go in here
        await client.query(`
        DROP TABLE IF EXISTS img;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS card_tags;
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
                view_count INT NULL,
                card_img BYTEA NULL,
                creation_date DATE NOT NULL DEFAULT CURRENT_DATE
            );
            CREATE TABLE tags(
                ID SERIAL PRIMARY KEY,
                tag_content VARCHAR(255) UNIQUE NOT NULL
            );
            CREATE TABLE card_tags(
                ID SERIAL PRIMARY KEY,
                "cardId" INT REFERENCES cards(ID) NOT NULL,
                "tagId" INT REFERENCES tags(ID) NOT NULL,
                UNIQUE ("cardId", "tagId")
            );
            CREATE TABLE cart(
                ID SERIAL PRIMARY KEY,
                "cardId" INT REFERENCES cards(ID),
                "userId" INT REFERENCES users(ID),
                UNIQUE("cardId", "userId")
            );
            CREATE TABLE img(
                ID SERIAL PRIMARY KEY,
                "cardId" INT REFERENCES cards(ID),
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
        });
        await createUser({
            username: "Astevens14",
            password: "GoColts20"
        })
        console.log("finished creating intial users")

        console.log("creating new card listing")
        await createCard({
            card_title: "Lebron James Topps Rookie",
            description: "mint condition LBJ rookie card",
            price: "1200",
            view_count: "25",
            card_img: "https://th.bing.com/th/id/R4ec8fb7fe602023e56a0950eab2b69c6?rik=fF8DNf3Q%2bOblsQ&pid=ImgRaw"         
        })
        console.log("finished creating new card listing")

        console.log("creating initial tags")
        await createTags("Pokemon")
        await createTags("Basketball")
        console.log("finished creating intial tags")

        await createCardTag(1, 1)
    } catch(error) {
        throw error
    }
}

buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end())