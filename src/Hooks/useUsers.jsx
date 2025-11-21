import React from "react";
import { useEffect } from "react";
import { useState } from "react";
const URL_API = "https://apirest3209616-1.onrender.com/api/users";

const endpoints = {
    get: URL_API,
    getOne: (id) => `${URL_API}/${id}`,
    post: URL_API,
    put: (id) => `${URL_API}/${id}`,
    delete: (id) => `${URL_API}/${id}`,
};

const useUsers = () => {
    const [user, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState("");

    useEffect(() => {
        try {
            setError(null);
            setLoading(true);
            const data = get();
            setUsers(data);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    async function get() {
        try {
            setError(null);
            setLoading("Obteniendo usuarios");
            const response = await fetch(endpoints.get);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function getOne(id) {
        try {
            setError(null);
            setLoading("Obteniendo al usuario");
            const response = await fetch(endpoints.getOne(id));
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const post = async (data) => {
        try {
            setError(null);
            setLoading("Agregando usuario");
            const response = await fetch(endpoints.post, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            setUsers((prev) => [...prev, data]);
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const put = async (id, data) => {
        try {
            setError(null);
            setLoading("Editando usuario");
            const response = await fetch(endpoints.put(id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json.stringify(data),
            });
            setUsers((prev) => prev.map((u) => (u._id === id ? actualizado : u)));
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        try {
            setError(null);
            setLoading("Eliminando usuario");
            const response = await fetch(endpoints.delete(id), {
                method: "DELETE",
            });
            setUsers((prev) => {
                const newData = prev.filter((user) => user.id !== id);
                return newData;
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return {
        get,
        getOne,
        post,
        put,
        remove,
        user,
        loading,
        error,
    };
};

export default useUsers;
