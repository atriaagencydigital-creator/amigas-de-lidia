import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    TrendingUp,
    TrendingDown,
    History,
    LogOut,
    Plus,
    Minus,
    Search,
    Trophy,
    Calendar,
    DollarSign,
    Download,
    Filter,
    Sparkles,
    Star
} from 'lucide-react';
import API_URL from '../config/api';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [historySearch, setHistorySearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
        if (activeTab === 'history') {
            loadAllTransactions();
        }
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users`);
            const usersWithBalances = await Promise.all(
                res.data.map(async (user) => {
                    const userRes = await axios.get(`${API_URL}/api/user/${user.id}`);
                    return { ...user, balance: userRes.data.balance || 0 };
                })
            );
            setUsers(usersWithBalances);
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const loadAllTransactions = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/transactions`);
            setAllTransactions(res.data);
        } catch (err) {
            console.error('Error loading transactions:', err);
        }
    };

    const handleAddPoints = async () => {
        if (!selectedUser || !amount || !concept) return;
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/transaction`, {
                user_id: selectedUser.id,
                amount: parseFloat(amount),
                concept,
                type: 100
            });
            setAmount('');
            setConcept('');
            await loadUsers();
        } catch (err) {
            console.error('Error adding points:', err);
        }
        setLoading(false);
    };

    const handleSubtractPoints = async () => {
        if (!selectedUser || !amount || !concept) return;
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/transaction`, {
                user_id: selectedUser.id,
                amount: -parseFloat(amount),
                concept,
                type: 200
            });
            setAmount('');
            setConcept('');
            await loadUsers();
        } catch (err) {
            console.error('Error subtracting points:', err);
        }
        setLoading(false);
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Usuario ID', 'Concepto', 'Importe', 'Tipo', 'Estado', 'Fecha'];
        const rows = filteredTransactions.map(t => [
            t.id,
            t.user_id,
            t.concept,
            t.amount,
            t.type === 100 ? 'Crédito' : 'Débito',
            t.status,
            t.created_at
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_movimientos_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTransactions = allTransactions.filter(t =>
        t.concept?.toLowerCase().includes(historySearch.toLowerCase()) ||
        t.user_id?.toString().includes(historySearch)
    );

    const topUsers = [...users].sort((a, b) => (b.balance || 0) - (a.balance || 0)).slice(0, 10);

    const totalCredits = allTransactions.filter(t => t.type === 100).reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = Math.abs(allTransactions.filter(t => t.type === 200).reduce((sum, t) => sum + t.amount, 0));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
            {/* Header */}
            <div className="glass-card mx-4 my-4 sm:mx-6 lg:mx-8">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                                Panel de Administración
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">Amigas de Lidia - Club de Socios</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                        >
                            <LogOut className="w-5 h-5" />
                            Salir
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="glass-card mx-4 mb-4 sm:mx-6 lg:mx-8 overflow-x-auto">
                <div className="flex gap-2 sm:gap-4 p-2 min-w-max sm:min-w-0">
                    {[
                        { id: 'users', label: 'Usuarios', icon: Users, color: 'from-blue-500 to-cyan-500' },
                        { id: 'ranking', label: 'Ranking', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
                        { id: 'history', label: 'Historial', icon: History, color: 'from-purple-500 to-pink-500' },
                        { id: 'points', label: 'Puntos', icon: DollarSign, color: 'from-green-500 to-emerald-500' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                                : 'text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 pb-8">
                <AnimatePresence mode="wait">
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-4 sm:p-6 lg:p-8"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuario..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-modern pl-10"
                                    />
                                </div>
                                <div className="text-sm font-semibold text-gray-600 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-xl text-center sm:text-left">
                                    {filteredUsers.length} usuarios
                                </div>
                            </div>

                            <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">ID</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Nombre</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Email</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Puntos</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.02 }}
                                                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setActiveTab('points');
                                                }}
                                            >
                                                <td className="py-4 px-4 text-sm font-semibold text-gray-700">{user.id}</td>
                                                <td className="py-4 px-4 text-sm font-semibold text-gray-900">{user.name}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow">
                                                        {user.balance || 0} pts
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'A'
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {user.status === 'A' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Ranking Tab */}
                    {activeTab === 'ranking' && (
                        <motion.div
                            key="ranking"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-4 sm:p-6 lg:p-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 gradient-text">
                                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                                Top 10 Usuarios
                            </h2>
                            <div className="space-y-4">
                                {topUsers.map((user, idx) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-white to-purple-50 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xl ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                                            idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                                                idx === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' :
                                                    'bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg truncate">{user.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                            <div className="flex mt-1">
                                                {[...Array(Math.min(5, Math.floor((user.balance || 0) / 100)))].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-right bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-3">
                                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                {user.balance || 0}
                                            </div>
                                            <div className="text-xs text-gray-500 font-semibold">puntos</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-4 sm:p-6 lg:p-8"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 gradient-text">
                                    <History className="w-6 h-6 sm:w-8 sm:h-8" />
                                    Historial de Movimientos
                                </h2>
                                <button
                                    onClick={exportToCSV}
                                    className="btn-success flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Download className="w-5 h-5" />
                                    Exportar CSV
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="stat-card from-emerald-400 to-green-500">
                                    <div className="flex items-center gap-2 text-white mb-1">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-sm font-medium">Total Créditos</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white">
                                        {totalCredits.toLocaleString()}
                                    </div>
                                </div>
                                <div className="stat-card from-rose-400 to-red-500">
                                    <div className="flex items-center gap-2 text-white mb-1">
                                        <TrendingDown className="w-5 h-5" />
                                        <span className="text-sm font-medium">Total Débitos</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white">
                                        {totalDebits.toLocaleString()}
                                    </div>
                                </div>
                                <div className="stat-card from-blue-400 to-indigo-500">
                                    <div className="flex items-center gap-2 text-white mb-1">
                                        <Filter className="w-5 h-5" />
                                        <span className="text-sm font-medium">Transacciones</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white">
                                        {filteredTransactions.length.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por concepto o ID de usuario..."
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                    className="input-modern pl-10"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
                                <table className="w-full min-w-[700px]">
                                    <thead className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50">
                                        <tr>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">ID</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Usuario</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Concepto</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Importe</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Tipo</th>
                                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.slice(0, 100).map((transaction) => (
                                            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                                                <td className="py-3 px-4 text-sm font-semibold text-gray-700">{transaction.id}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{transaction.user_id}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{transaction.concept}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 100
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                                        }`}>
                                                        {transaction.type === 100 ? 'Crédito' : 'Débito'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredTransactions.length > 100 && (
                                <div className="text-center mt-4 text-sm text-gray-500 font-semibold">
                                    Mostrando 100 de {filteredTransactions.length} transacciones
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Points Management Tab */}
                    {activeTab === 'points' && (
                        <motion.div
                            key="points"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {/* User Selection */}
                            <div className="glass-card p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Seleccionar Usuario</h2>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuario..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-modern pl-10"
                                    />
                                </div>
                                <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-thin">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all ${selectedUser?.id === user.id
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105'
                                                : 'bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50 border-2 border-transparent hover:border-purple-200'
                                                }`}
                                        >
                                            <div className={`font-semibold text-lg ${selectedUser?.id === user.id ? 'text-white' : 'text-gray-900'}`}>
                                                {user.name}
                                            </div>
                                            <div className={`text-sm ${selectedUser?.id === user.id ? 'text-white/90' : 'text-gray-500'}`}>
                                                {user.email}
                                            </div>
                                            <div className={`text-sm font-bold mt-2 ${selectedUser?.id === user.id ? 'text-white' : 'text-pink-600'}`}>
                                                {user.balance || 0} puntos
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Points Form */}
                            <div className="glass-card p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Gestionar Puntos</h2>
                                {selectedUser ? (
                                    <div className="space-y-4">
                                        <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-xl">
                                            <div className="text-sm opacity-90">Usuario seleccionado:</div>
                                            <div className="text-2xl font-bold mt-1">{selectedUser.name}</div>
                                            <div className="text-4xl font-bold mt-3">
                                                {selectedUser.balance || 0} <span className="text-lg">puntos</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Cantidad de Puntos
                                            </label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="100"
                                                className="input-modern"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Concepto
                                            </label>
                                            <input
                                                type="text"
                                                value={concept}
                                                onChange={(e) => setConcept(e.target.value)}
                                                placeholder="Compra / Visita / Regalo..."
                                                className="input-modern"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleAddPoints}
                                                disabled={loading}
                                                className="btn-success flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Añadir
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSubtractPoints}
                                                disabled={loading}
                                                className="btn-danger flex items-center justify-center gap-2"
                                            >
                                                <Minus className="w-5 h-5" />
                                                Restar
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <Users className="w-20 h-20 mx-auto mb-4 text-purple-200" />
                                        <p className="text-gray-400 text-lg">Selecciona un usuario para gestionar sus puntos</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminPanel;
