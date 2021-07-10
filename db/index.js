const { Client } = require("pg");
const DB_NAME = "cardex-dev";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`;
const client = new Client(DB_URL);
const bcrypt = require("bcrypt");
const { isCompositeComponent } = require("react-dom/test-utils");
const { scryRenderedDOMComponentsWithClass } = require("react-dom/cjs/react-dom-test-utils.production.min");
const SALT_COUNT = 10;

async function createUser({ username, password, email, admin = false }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (username, password, email, admin)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `,
      [username, hashedPassword, email, admin]
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
  console.log(password)
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
        `);

    return rows;
  } catch (error) {
    console.log("could not get all users from the db/index");
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

async function getCardsById(cardId) {
  try {
    const {
      rows: [cards],
    } = await client.query(`
    SELECT * 
    FROM cards
    WHERE id=${cardId}
    `);

    if (!cards) {
      throw {
        name: "CardNotFoundError",
        message: "Could not find a card with that cardId",
      };
    }

    return cards;
  } catch (error) {
    console.error("Could not grab a product by id in db/index");
    throw error;
  }
}

async function getAllTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM tags;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// async function getAllCards() {
//   try {
//     const { rows } = await client.query(`
//       SELECT * FROM cards;
//       `);
//     return rows;
//   } catch (error) {
//     console.error("Could not get all cards in the db");
//     throw error;
//   }
// }

async function createTags(tag_content) {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
    INSERT INTO tags(tag_content)
    VALUES ($1)
    RETURNING *;
    `,
      [tag_content]
    );

    return tag;
  } catch (error) {
    throw error;
  }
}

//Duplicate
async function getAllCardTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM card_tags;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function patchCards(cardId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    if (setString.length > 0) {
      await client.query(
        `
            UPDATE cards
            SET ${setString}
            WHERE id=${cardId}
            RETURNING *;
            `,
        Object.values(fields)
      );
    }

    return await getCardsById(cardId);
  } catch (error) {
    console.error("Could not patch product in db/index");
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

// async function getAllCardTags() {
//   try {
//     const { rows } = await client.query(`
//     SELECT * FROM tags
//     WHERE tag_content = '${tag}';
//     `);

//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }

async function getAllCardsWithTags() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM cards
    `);

    return await attachTagsToCard(rows);
  } catch (error) {
    throw error;
  }
}

async function attachTagsToCard(allCards) {
  const cardIds = allCards.map((card) => card.id);
  const inString = allCards.map((_, index) => `$${index + 1}`).join(", ");

  const { rows: tags } = await client.query(
    `
  SELECT tags.tag_content, card_tags.*
  FROM tags
  JOIN card_tags ON tags.ID = link_tags."tagId"
  WHERE card_tags."cardId" IN (${inString})
  `,
    cardIds
  );

  allCards.forEach((card) => {
    card.tags = [];
    tags.forEach((tag) => {
      if (tag.cardId === card.id) {
        card.tags.push(tag);
      }
    });
  });

  return allCards;
}

async function createCardTag(cardId, tagId) {
  try {
    const {
      rows: [cardtag],
    } = await client.query(
      `
        INSERT INTO card_tags("cardId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("cardId", "tagId") DO NOTHING
        RETURNING *;
        `,
      [cardId, tagId]
    );

    return cardtag;
  } catch (error) {
    throw error;
  }
}

//error
async function createCartItem(userId, cardId, quanity = 1) {
  try {
    const usersCart = await getCartByUserId(userId);
    if (usersCart === null) {
      userCart = createCart(userId);
    }
    console.log(usersCart);
    console.log(usersCart.id);
    const { rows } = await client.query(
      `
        INSERT INTO cart_products("cartId", "cardId", quanity)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
      [usersCart.id, cardId, quanity]
    );

    return rows;
  } catch (error) {
    console.error("could not put card into the cart");
    throw error;
  }
}

async function createCart(userId) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO cart("userId")
        VALUES ($1)
        ON CONFLICT ("userId") DO NOTHING
        RETURNING *;
        `,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error("couldn't create cart item");
    throw error;
  }
}

async function getCartByUserId(userId) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
        SELECT * FROM cart

        WHERE "userId"=$1 AND active=true;

        `,
      [userId]
    );

    return cart;
  } catch (error) {
    console.error("Couldn't get cart by user id");
    throw error;
  }
}

async function addCardToCart(userId, cardId) {
  try {
    console.log("Initial query");
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
    console.log("create cart item");
    await createCartItem(userId, card.id);
    console.log("get card by user Id");
    return await getCardUserById(userId);
  } catch (error) {
    console.error("couldn't add cart item for user");
    throw error;
  }
}

async function deleteCardFromCart(userId, cardId) {
  try {
    const userCart = await getCartByUserId(userId)
    console.log("USER CART", userCart)
    const {rows: [deletedCard]} = await client.query(`
    DELETE FROM cart_products
    WHERE cartId = $(1) AND cardId = ($2)
    RETURNING *;
    `, userCart[0].id, cardId)

    return deletedCard;
  } catch (error) {
    console.error("Could not delete card")
    throw error
  }
}

async function getUserCartProducts(cartId) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM cart_products
    WHERE "cartId"=$1
    RETURNING *;
    `, [cartId])

    return rows
  } catch (error) {
    throw error
  }
}

async function getCardUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE id=$1
    `,
      [userId]
    );

    if (!user) {
      throw {
        name: "UserNotFound",
        message: "Could not find a user with that id",
      };
    }

    const { rows: cards } = await client.query(
      `
    SELECT *
    FROM cards
    JOIN cart_products ON cards.Id=cart_products."cardId"
    JOIN cart ON "cartId"="userId"
    WHERE cart."userId"=$1;
    `,
      [userId]
    );

    user.cart = cards;

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateViewCount(cardId, count) {
  try {
    const { rows } = await client.query(
      `
    UPDATE cards
    SET view_count = $1
    WHERE ID = $2
    RETURNING *;
    `,
      [++count, cardId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteCard(id) {
  try {
    await client.query(
      `
    DELETE FROM card_tags
    WHERE "cardId"=$1
    `,
      [id]
    );

    const { rows } = await client.query(
      `
    DELETE FROM cards
    WHERE id=$1
    RETURNING *;
    `,
      [id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// async function deleteCardFromCart(userId, cardId) {
//   try {
//     const userCart = await getCartByUserId(userId);
//     console.log("USER CART", userCart);
//     const {
//       rows: [deletedCard],
//     } = await client.query(
//       `
//     DELETE FROM cart_products
//     WHERE cartId = $(1) AND cardId = ($2)
//     RETURNING *;
//     `,
//       userCart[0].id,
//       cardId
//     );
//     return deletedCard;
//   } catch (error) {
//     console.error("Could not delete card");
//     throw error;
//   }
// }

async function createUserOrder(userId) {
  try {
    const getUserCart = await getCartByUserId(userId)
    // console.log(getUserCart)
    const {rows} = await client.query(`
    INSERT INTO user_order("userId", "cartId")
    VALUES($1, $2) 
    RETURNING *;
    `, [userId, getUserCart.id]);

    await client.query(`
    UPDATE cart
    SET active=false
    WHERE ID=$1;
    `, [getUserCart.id]);

    // await createCart(userId)
    return rows;
  } catch (error) {
    console.error("could not create order for user")
    throw error
  }
}

async function getAllOrders() {
  try {
    const {rows} = await client.query(`
    SELECT user_order.ID, cards.card_title,cards.card_img,cards.price FROM user_order
    JOIN cart ON user_order."cartId"=cart.ID
    JOIN cart_products ON cart.ID=cart_products."cartId"
    JOIN cards ON cart_products."cardId"=cards.ID
    `)

    return rows;
  } catch (error) {
    throw error
  }
}


async function createUserAddress({userId, street, state, zip_code,}) {
  try {
    await client.query(`
    INSERT INTO user_address("userId", street, state, zip_code)
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("userId") DO NOTHING
    RETURNING *;
    `, [userId, street, state, zip_code])

    return await joinAddressToUser(userId)
  } catch (error) {
    console.error("Could not create users address")
    throw error
  }
}

async function joinAddressToUser(userId) {
  try {
    const {rows: userAddress} = await client.query(`
    SELECT users.id
    FROM users
    INNER JOIN user_address ON "userId" = users.id
    WHERE user_address."userId" = $1;
    `, [userId])

    return userAddress;
  } catch (error) {
    console.error("could not join address to user")
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
  updateViewCount,
  createCart,
  getCartByUserId,
  deleteCardFromCart,
  getCardsById,
  getCardUserById,
  deleteCardFromCart,
  createUserOrder,
  createUserAddress,
  getAllOrders
};
