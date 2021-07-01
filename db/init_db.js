const {
    client,
    createUser,
    createCard,
    createTags,
    getTagByContent,
    createCardTag,
    createGuest,
    createCartItem,
    addCardToCart,
    getAllCards,
    getAllUsers
} = require("./index");

async function buildTables() {
    try {
        // client.connect()

        console.log("starting to drop tables");
        await client.query(`
        DROP TABLE IF EXISTS img;
        DROP TABLE IF EXISTS order_cards;
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS user_order;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS card_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS cards;
        DROP TABLE IF EXISTS guests;
        DROP TABLE IF EXISTS users;
        `)
        console.log("finished dropping tables")

        console.log("Starting to create tables")
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                admin BOOLEAN DEFAULT FALSE,
                UNIQUE(username)
            );
            CREATE TABLE guests(
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                UNIQUE(email)
            );
            CREATE TABLE cards(
                ID SERIAL PRIMARY KEY,
                card_title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                price INT NULL,
                view_count INT NULL,
                card_img TEXT NOT NULL,
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
                "userId" INT REFERENCES users(ID),
                active BOOLEAN DEFAULT TRUE,
                UNIQUE("userId")
            );
            CREATE TABLE user_order(
                ID SERIAL PRIMARY KEY,
                "userId" INT REFERENCES users(ID),
                "cartId" INT REFERENCES cart(ID),
                UNIQUE ("userId", "cartId")
            );
            CREATE TABLE cart_products(
                ID SERIAL PRIMARY KEY,
                "cartId" INT REFERENCES cart(ID),
                "cardId" INT REFERENCES cards(ID),
                quanitity INTEGER NOT NULL,
                active BOOLEAN DEFAULT TRUE,
                UNIQUE("cartId", "cardId")
            );
            CREATE TABLE order_cards(
                ID SERIAL PRIMARY KEY,
                "orderId" INT REFERENCES user_order(ID),
                "cardId" INT REFERENCES cards(ID),
                quantity INT NOT NULL
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


const createInitialCards = async () => {
    console.log("starting to create initial cards")
    try {
        const cardsToCreate = [
            {
                card_title: "2003-04 Lebron James Topps Rookie",
                description: "mint condition LBJ rookie card",
                price: "1200",
                view_count: "25",
                card_img: "https://th.bing.com/th/id/R4ec8fb7fe602023e56a0950eab2b69c6?rik=fF8DNf3Q%2bOblsQ&pid=ImgRaw"
            },
            {
                card_title: "Fleer 1988 Reggie Miller Rookie Card",
                description: "Good condition Reggie Miller Rookie Card Rare PSA 9",
                price: "300",
                view_count: "278",
                card_img: "https://images-na.ssl-images-amazon.com/images/I/512KpkGffQL._SY300_QL70_.jpg"
            },
            {
                card_title: "1st Edition Charizard PSA 10",
                description: "Super rare Charizard PSA 10 only a few in the entire world",
                price: "750000",
                view_count: "4679",
                card_img: "https://th.bing.com/th/id/Rfc9fe0953c464ecb1e811c33bd24fe11?rik=J4phdw%2bQd%2brd6A&riu=http%3a%2f%2fi.ebayimg.com%2fimages%2fi%2f112406552365-0-1%2fs-l1000.jpg&ehk=bRrw8m%2bTRt23vwGkISKQVuPWVHaQY7GmKIPSaQ7UUZ4%3d&risl=&pid=ImgRaw"
            },
            {
                card_title: "1st edition Pikachu 1999",
                description: "Good condition Pikachu card 1st edition card. Great for any collector",
                price: "60",
                view_count: "140",
                card_img: "https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/products/pictures/1067923.jpg"
            },
            {
                card_title: "2001 Bowman Drew Brees Rookie Card",
                description: "Great condition, card has slight wear on top left corner",
                price: "25",
                view_count: "9",
                card_img: "https://th.bing.com/th/id/OIP.abIUBSuuMwn2UoVumn57aAHaKY?pid=ImgDet&rs=1"
            },
            {
                card_title: "1998 Fleer Peyton Manning Rookie Autograph ",
                description: "Peyton Manning autograph and slabbed, the Sherrif himself autographed this",
                price: "240",
                view_count: "920",
                card_img: "https://th.bing.com/th/id/Rc4f63effff1a396de855a4922ced8953?rik=k1id3JtnW8KzGg&riu=http%3a%2f%2fcdn.sportsmemorabilia.com%2fsports-product-image%2f34-t4204666-2000.jpg&ehk=Bl4VYsp%2bo8LKk%2bkKMstHjsZIF%2fUrwpA4EdO%2fqQizPHI%3d&risl=&pid=ImgRaw"
            },
            {
                card_title: "1st Edition Squirtle",
                description: "1st edition Squirtle, card is in great condition and would be great for any pokemon collector",
                price: "45",
                view_count: "148",
                card_img: "https://th.bing.com/th/id/OIP.pGWduX1sZhiz3JPDtyC3rQAAAA?pid=ImgDet&rs=1"
            },
            {
                card_title: "1st Edition Venusaur PSA 10",
                description: "1st edition Venusaur PSA 10 gem-mint super Rare, perfect for any pokemon collector",
                price: "560",
                view_count: "97",
                card_img: "https://i.ebayimg.com/00/s/MTE1Mlg3Njg=/z/v3UAAOSw7bla~WOX/$_58.JPG"
            },
            {
                card_title: "2018-19 Prizm Trae Young Rookie Auto /75",
                description: "Trae Young rare rookie autograph, Beckett 9.5, buy while you still can!",
                price: "1100",
                view_count: "169",
                card_img: "https://i.ebayimg.com/images/g/zlYAAOSwuTpfSEbG/s-l300.jpg"
            },
            {
                card_title: "2017 Panini Select Alvin Kamara auto",
                description: "Alvin Kamara Rookie Signatures PSA gem mint 10, WHO DAT NATION",
                price: "450",
                view_count: "211",
                card_img: "https://i.pinimg.com/originals/5a/c7/9c/5ac79c77896bb53f7c0cb6f900822857.jpg"
            },
        ];
        const products = await Promise.all(cardsToCreate.map(createCard))
        console.log("Cards created:")
        console.log(products)
        console.log("finished creating cards")
    } catch (error) {
        throw error
    }
}

const createInitialUsers = async () => {
    console.log("Starting to create intital users")
    try {
        const adminUser = {
            username: "admin",
            password: "adminPassword123",
            admin: true,
        };
        await createUser(adminUser)
        const usersToCreate = [
            {
                username: "Eman",
                password: "CodingGod69",
            },
            {
                username: "Astevens14",
                password: "GoColts20",
            },
            {
                username: "ChrisTheBoss",
                password: "CW123"
            },
        ];
        const users = await Promise.all(usersToCreate.map(createUser))
        console.log("users created:")
        console.log(users)
        console.log("Finished creating users")
    } catch (error) {
        console.error("there was an issues creating users")
        throw error
    }
}

async function rebuildDB() {
    try {
        client.connect()
        await buildTables();
        await createInitialCards();
        await createInitialUsers()
    } catch (error) {
        throw error
    }
}

async function testDB() {
    try {
        console.log("starting to test the database")
        
        console.log("calling allCards")
        const products = await getAllCards()
        console.log("Results:", products)

        console.log("getting allUsers")
        const users = await getAllUsers()
        console.log("Results:", users)

        console.log("Finished database tests")
    } catch (error) {
        console.log("error during testDB")
        throw error
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())