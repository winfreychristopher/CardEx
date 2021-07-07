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