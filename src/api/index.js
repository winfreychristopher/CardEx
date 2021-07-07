import axios from "axios";

export const clearToken = () => {
    localStorage.removeItem("token")
};

export const setToken = (token) => {
    localStorage.setItem("token", token)
};

export const getToken = () => {
    return localStorage.getItem("token")
};

export const loggedAdmin = () => {
    localStorage.setItem("admin", "isAdmin")
};

export const clearAdmin = () => {
    localStorage.removeItem("admin")
}

export async function getAllCards() {
    try {
        const { data } = await axios.get("/api/cards");
        console.log( "EMAN" , data)
        return data;
    } catch (error) {
        throw error;
    }
}
getAllCards();

export async function getUsers() {
    try {
        const { data } = await axios.get("/api/users")
        console.log(data.users)
        return data.users;
    } catch (error) {
        throw error;      
    }
}
getUsers()

export async function userLogin(username, password) {
    try {
        const { data } = await axios.post("/api/users/login", {
            username,
            password,
        });
    
        if (data.token) {
            alert("You are now logged in")
            setToken(data.token)
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export async function userRegister(username, password, email) {
    try {
        const { data } = await axios.post("/api/users/register", {
            username,
            password,
        });
        console.log(data.token)
        if (data.token) {
            alert("You have successfully registered, welcome to CardEx");
            setToken(data.token)
        }
        return data;
    } catch (error) {
        throw error
    }
}

export async function changeAdmin(id, admin) {
    try {
        let updatedInfo = {
            admin,
        };

        const { data } = await axios.patch(`/api/users/${id}`, updatedInfo)
        console.log(data)
        return data;
    } catch (error) {
        throw error;
    }
}

export async function createCard(card_title, description, price, card_img, tag_content) {
    try {
        const { data } = await axios.post("/api/cards", {
            card_title,
            description,
            price,
            card_img,
            tag_content,
        });
        alert("Card was successfully listed")
        return data;
    } catch (error) {
        throw error
    }
}

export async function getCart(token) {
    try {
        const { data } = await axios.get("/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error getting cart")
        throw error
    }
}

export async function removeItemFromCart(cardId, token) {
    try {
        const { data } = await axios.delete(`api/cart/${cardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        console.error("Error removing card from cart")
        throw error;
    }
}

export async function addItemToCart(cardId, quanity, token) {
    try {
        const { data } = await axios.post(`api/cart`,
        {cardId, quanity},
        {headers: {
            Authorization: `Bearer ${token}`
        }}
        );
        return data;
    } catch (error) {
        console.error("Error adding to cart")
        throw error;
    }
}