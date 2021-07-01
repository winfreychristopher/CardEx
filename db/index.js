const { Client } = require("pg");
const DB_NAME = "cardex-dev";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`;
const client = new Client(DB_URL);
const bcrypt = require("bcrypt");
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

async function createGuest({ email, name }) {
  try {
    const {
      rows: [guests],
    } = await client.query(
      `
        INSERT INTO guests(email, name)
        VALUES($1, $2)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
        `,
      [email, name]
    );

    return guests;
  } catch (error) {
    console.error("Couldn't create guests");
    throw error;
  }
}

async function createCard({
  card_title,
  description,
  price,
  card_img,
  view_count,
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

async function getCardsById(cardId) {
  try {
    const {
      rows: [card],
    } = await client.query(
      `
      SELECT *
      FROM cards
      WHERE id=$1;
    `,
      [cardId]
    );
    if (!card) {
      throw {
        name: "CardNotFound",
        message: "Could not find a card with that id",
      };
    }
    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN card_tags ON tags.id=card_tags."tagId"
      WHERE card_tags."cardId"=$1
    `,
      [cardId]
    );
    card.tags = tags;
    return card;
  } catch (error) {
    throw error;
  }
}

async function getAllCards() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM cards;
      `);
    return rows;
  } catch (error) {
    console.error("Could not get all cards in the db");
    throw error;
  }
}

async function getCardsBytagName(tagName) {
  try {
    const { rows: cards } = await client.query(
      `
      SELECT cards.id
      FROM cards
      JOIN card_tags ON cards.id=card_tags."cardId"
      JOIN tags ON tags.id=card_tags."tagId"
      WHERE tags.tag_content=$1
    `,
      [tagName]
    );

    return await Promise.all(cards.map((card) => getCardsById(card.id)));
  } catch (error) {
    throw error;
  }
}

async function createTags(tagslist) {
  if (tagslist.length === 0) {
    return;
  }

  const insertValues = tagslist.map((_, index) => `$${index + 1}`).join("), (");
  const selectValues = tagslist.map((_, index) => `$${index + 1}`).join(", ");

  try {
    await client.query(
      `
      INSERT INTO tags(tag_content)
      VALUES (${insertValues})
      ON CONFLICT (tag_content) DO NOTHING;
    `,
      tagslist
    );

    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE tag_content
      IN (${selectValues});
    `,
      tagslist
    );

    return rows;
  } catch (error) {
    throw error;
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
    const usersCart = await getCartByUserId(userId);
    if (usersCart === null) {
      userCart = createCart(userId);
    }
    return await client.query(
      `
        INSERT INTO cart_products("cartId", "cardId")
        VALUES ($1, $2);
        `,
      [usersCart.id, cardId]
    );
  } catch (error) {
    console.error("could not put card into the cart");
    throw error;
  }
}

async function createCart(userId) {
  try {
    return await client.query(
      `
        INSERT INTO cart("userId")
        VALUES ($1)
        ON CONFLICT ("userId") DO NOTHING;
        `,
      [userId]
    );
  } catch (error) {
    console.error("couldn't create cart item");
    throw error;
  }
}

async function getCartByUserId(userId) {
  try {
    return await client.query(
      `
        SELECT TOP(1)* FROM cart
        WHERE "userId" AND active=true;
        `,
      [userId]
    );
  } catch (error) {
    console.error("Couldn't get cart by user id");
    throw error;
  }
}

async function addCardToCart(userId, cardId) {
  try {
    const {
      rows: [card],
    } = await client.query(
      `
        SELECT *
        FROM cards
        WHERE id=$1;
        `,
      [cardId]
    );
    await createCartItem(userId, card.id);

    return await getUserById(userId);
  } catch (error) {
    console.error("couldn't add cart item for user");
    throw error;
  }
}

// async function removeCartItem(cardId) {
//     try {
//         const {rows: [cart]} = await client.query(`
//         DELETE FROM cart
//         WHERE id=$1;
//         `, [cardId])

//         return cart
//     } catch (error) {
//         console.error("couldnt delete item from cart")
//         throw error
//     }
// }

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
  getCardsById,
  getCardsBytagName,
  createCartItem,
  addCardToCart,
  getAllCards,
};
