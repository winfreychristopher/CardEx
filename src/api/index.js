import axios from "axios";

export const clearToken = () => {
    localStorage.removeItem("CardEXtoken")
};

export const setToken = (token) => {
    localStorage.setItem("CardEXtoken", token)
};

export const getToken = () => {
    return localStorage.getItem("CardEXtoken")
};

// export const loggedAdmin = () => {
//     localStorage.setItem("admin", "isAdmin")
// };

// export const clearAdmin = () => {
//     localStorage.removeItem("admin")
// }

export async function getAllCards() {
    try {
        const { data } = await axios.get("/api/cards");
        console.log( "EMAN" , data)
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getUsers() {
    try {
        const { data } = await axios.get("/api/users")
        console.log(data.users)
        return data.users;
    } catch (error) {
        throw error;      
    }
}

export async function userLogin(username, password) {
    console.log("API " + username, password)
    try {
        const { data } = await axios.post("/api/users/login", {
            username, 
            password,
        });
        console.log(data)
        if (data.token) {  
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
            email,
        });
        console.log(data.token)
        if (data.token) {
            alert("You have successfully registered. Welcome to CardEx!");
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

export async function createCard(card_title, description, price, card_img, token) {
    try {
        const { data } = await axios.post("/api/cards", {
            card_title,
            description,
            price,
            card_img,
            // tag_content,
        }, {headers: {Authorization: `Bearer ${token}`}});
        alert("Card was successfully listed")
        return data;
    } catch (error) {
        throw error
    }
}

export async function updateCard({id, count}) {
    try {
        const data = await axios.patch(`/api/cards/${id}`, {
            count,
        });

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

export async function getAllOrders() {
    try {
        const {data} = await axios.get(`api/orders/all`)
        console.log(data)
        return data;
    } catch (error) {
        throw error
    }
}

export async function updateOrderStatus(orderId, status) {
    const updatedOrder = await axios.patch(`/api/order/${orderId}`, {status})
    return updatedOrder;
} 