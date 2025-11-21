import React, { useState } from 'react';
import { Trash2, Edit, Plus, X, Loader2 } from 'lucide-react';

// Hook useUsers (copiado del código proporcionado) Elaborado por Miguel Angel Guerrero RAve
const URL_API = "https://apirest3209616-1.onrender.com/api/users";

const endpoints = {
    get: URL_API,
    getOne: (id) => `${URL_API}/${id}`,
    post: URL_API,
    put: (id) => `${URL_API}/${id}`,
    delete: (id) => `${URL_API}/${id}`,
};

const useUsers = () => {
    const [user, setUsers] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState("");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                setLoading("Obteniendo usuarios");
                const data = await get();
                setUsers(data);
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
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
            const newUser = await response.json();
            setUsers((prev) => [...prev, newUser]);
            return newUser;
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
                body: JSON.stringify(data),
            });
            const actualizado = await response.json();
            setUsers((prev) => prev.map((u) => (u._id === id ? actualizado : u)));
            return actualizado;
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
            setUsers((prev) => prev.filter((user) => user._id !== id));
            const response = await fetch(endpoints.delete(id), {
                method: "DELETE",
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

// Componente principal App
export default function App() {
    const { user, loading, error, post, put, remove, get } = useUsers();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });

    const handleOpenModal = (userToEdit = null) => {
        if (userToEdit) {
            setEditingUser(userToEdit);
            setFormData({
                name: userToEdit.name || '',
                email: userToEdit.email || '',
                age: userToEdit.age || ''
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', age: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', age: '' });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) {
            alert('Nombre y email son requeridos');
            return;
        }
        
        if (editingUser) {
            await put(editingUser._id, formData);
        } else {
            await post(formData);
        }
        
        handleCloseModal();
        await get();
    };

    const handleDelete = async (id) => {

            await remove(id);
 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || '' : value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">Gestión de Usuarios {user.length}</h1>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            <Plus size={20} />
                            Nuevo Usuario
                        </button>
                    </div>


                        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                            <Loader2 className="animate-spin text-blue-600" size={24} />
                            <span className="text-blue-700 font-medium">{loading}</span>
                        </div>
                  

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                            <p className="text-red-700">Error: {error.message}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user && user.length > 0 ? (
                            user.map((u) => (
                                <div
                                    key={u._id}
                                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{u.name}</h3>
                                        <p className="text-gray-600 text-sm mb-1">📧 {u.email}</p>
                                        {u.age && <p className="text-gray-600 text-sm">🎂 {u.age} años</p>}
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleOpenModal(u)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Edit size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">No hay usuarios disponibles</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Edad
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editingUser ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
