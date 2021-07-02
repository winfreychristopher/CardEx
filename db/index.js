const { Client } = require("pg");
const DB_NAME = "cardex-dev";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`;
const client = new Client(DB_URL);
const bcrypt = require("bcrypt");
const { isCompositeComponent } = require("react-dom/test-utils");
const SALT_COUNT = 10;

async function createUser({ username, password, admin = false }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (username, password, admin)
            VALUES($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `,
      [username, hashedPassword, admin]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id=$1;
    `,
      [id]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    let user = await getUserByUsername(username);
    if (bcrypt.compareSync(password, user.password)) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
        SELECT * FROM users;
        `)

        return rows;
    } catch (error) {
        console.log("could not get all users from the db/index")
        throw error
    }
}

async function createGuest({email, name}) {
    try {
        const {rows: [guests]} = await client.query(`
        INSERT INTO guests(email, name)
        VALUES($1, $2)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
        `, [email, name])

        return guests;
    } catch (error) {
        console.error("Couldn't create guests")
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
    const {
      rows: [card],
    } = await client.query(
      `
        INSERT INTO cards(card_title, description, price, card_img, view_count)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [card_title, description, price, card_img, view_count]
    );
    
    return card;
  } catch (error) {
    throw error;
  }
}

async function getAllCards() {
    try {
        const { rows } = await client.query(`
        SELECT * FROM cards;
        `)

        return rows;
    } catch (error) {
        console.error("Could not get all cards in the db")
        throw error;
    }
}

async function getAllTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM tags;
    `)

    return rows;
  } catch (error) {
    throw error
  }
}

async function createTags(tag_content) {
  try {
    const {rows: [tag]} = await client.query(`
    INSERT INTO tags(tag_content)
    VALUES ($1)
    RETURNING *;
    `, [tag_content]);

    return tag;
  } catch (error) {
    throw error 
  }
}

async function getAllCardTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM card_tags;
    `)
    return rows;
  } catch (error) {
    throw error
  }
}

async function patchCards(cardId, fields = {}) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
    try {
        if (setString.length > 0) {
            await client.query(`
            UPDATE cards
            SET ${setString}
            WHERE id=${cardId}
            RETURNING *;
            `, Object.values(fields))
        }

        return await getCardsById(cardId)
    } catch (error) {
        console.error("Could not patch product in db/index")
        throw error
    }
}


async function addTagsToCards(cardId, taglist = []) {
  try {
    const createCardTags = taglist.map((tag) => createCardTag(cardId, tag.id));
    await Promise.all(createCardTags);
    return await getCardsById(cardId);
  } catch (error) {
    throw error;
  }
}

async function getTagByContent(tag_content) {
  try {
    const {
      rows: [tag],
    } = await client.query(`
        SELECT * FROM tags
        WHERE tag_content = '${tag_content}'
        `);

    return tag;
  } catch (error) {
    throw error;
  }
}

async function getAllCardTags() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM tags
    WHERE tag_content = '${tag}';
    `)

    return rows;
  } catch (error) {
    throw error
  }
}

async function getAllCardsWithTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM cards
    `);

    return await attachTagsToCard(rows)
  } catch (error) {
    throw error
  }
}

async function attachTagsToCard(allCards) {
  const cardIds = allCards.map((card) => card.id)
  const inString = allCards.map((_, index) => `$${index + 1}`).join(", ")

  const { rows: tags } = await client.query(`
  SELECT tags.tag_content, card_tags.*
  FROM tags
  JOIN card_tags ON tags.ID = link_tags."tagId"
  WHERE card_tags."cardId" IN (${inString})
  `, cardIds)

  allCards.forEach((card) => {
    card.tags = [];
    tags.forEach((tag) => {
      if (tag.cardId === card.id) {
        card.tags.push(tag)
      }
    })
  })
}

async function createCardTag(cardId, tagId) {
  try {
    await client.query(
      `
        INSERT INTO card_tags("cardId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("cardId", "tagId") DO NOTHING;
        `,
      [cardId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

async function createCartItem(userId, cardId) {
    try {
        const usersCart = await getCartByUserId(userId)
        if (usersCart === null) {
            userCart = createCart(userId)
        }
        return await client.query(`
        INSERT INTO cart_products("cartId", "cardId")
        VALUES ($1, $2);
        `, [usersCart.id, cardId])
    } catch (error) {
        console.error("could not put card into the cart")
        throw error
    }
}

async function createCart(userId) {
    try {
        return await client.query(`
        INSERT INTO cart("userId")
        VALUES ($1)
        ON CONFLICT ("userId") DO NOTHING;
        `, [userId]);
    } catch (error) {
        console.error("couldn't create cart item")
        throw error
    }
}

async function getCartByUserId(userId) {
    try {
        return await client.query(`
        SELECT TOP(1)* FROM cart
        WHERE "userId"=$1 AND active=true;
        `, [userId])
    } catch (error) {
        console.error("Couldn't get cart by user id")
        throw error
    }
}

async function addCardToCart(userId, cardId) {
    try {
        const {rows: [card]} = await client.query(`
        SELECT *
        FROM cards
        WHERE id=$1;
        `, [cardId]);
        await createCartItem(userId, card.id);

        return await getUserById(userId);
    } catch (error) {
        console.error("couldn't add cart item for user")
        throw error;
    }
}

async function updateViewCount(cardId, count) {
  try {
    const { rows } = await client.query(`
    UPDATE cards
    SET view_count = $1
    WHERE ID = $2
    RETURNING *;
    `, [++count, cardId])

    return rows;
  } catch (error) {
    throw error
  }
}

async function deleteCard(id) {
  try {
    await client.query(`
    DELETE FROM card_tags
    WHERE "cardId"=$1
    `, [id])

    const { rows } = await client.query(`
    DELETE FROM cards
    WHERE id=$1
    RETURNING *;
    `, [id])

    return rows;
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
  createCardTag,
  getUserByUsername,
  getUser,
  createGuest,
  getUserById,
  createCartItem,
  addCardToCart,
  getAllCards,
  patchCards,
  getAllUsers,
  getAllTags,
  addTagsToCards,
  getAllCardTags,
  getAllCardsWithTags,
  deleteCard,
  updateViewCount
};
