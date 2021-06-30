const { Client } = require("pg");
const DB_NAME = "cardex-dev";
const DB_URL = process.env.DATABASE_URL || `https://localhost:5432/${DB_NAME}`;
const client = new Client(DB_URL);
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (username, password)
            VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
        `,
      [username, hashedPassword]
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

async function createCard({
  card_title,
  description,
  price,
  card_img,
  view_count,
  tags = [],
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
    const taglist = await createTags(tags);
    return await addTagsToCards(card.id, taglist);
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
  if (tagsList.length === 0) {
    return;
  }

  const insertValues = tagslist.map((_, index) => `$${index + 1}`).join("), (");
  const selectValues = tagslist.map((_, index) => `$${index + 1}`).join(", ");

  try {
    await client.query(
      `
      INSERT INTO tags(tags_content)
      VALUES (${insertValues})
      ON CONFLICT (tags_content) DO NOTHING;
    `,
      tagslist
    );

    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE tags_content
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
        ON CONFLICT ("cardId", "tagId") DO NOTHING
        `,
      [cardId, tagId]
    );
  } catch (error) {
    throw error;
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
  getCardsById,
  getCardsBytagName,
};
