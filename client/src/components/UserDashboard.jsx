import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    History,
    Trophy,
    LogOut,
    Calendar,
    Sparkles,
    Star,
    X
} from 'lucide-react';
import API_URL from '../config/api';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [ranking, setRanking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }

            const res = await axios.get(`${API_URL}/api/user/${user.id}`);
            setUserData(res.data.user);
            setBalance(res.data.balance);
            setTransactions(res.data.transactions);

            const usersRes = await axios.get(`${API_URL}/api/users`);
            const usersWithBalances = await Promise.all(
                usersRes.data.map(async (u) => {
                    const userRes = await axios.get(`${API_URL}/api/user/${u.id}`);
                    return { ...u, balance: userRes.data.balance || 0 };
                })
            );

            const sorted = usersWithBalances.sort((a, b) => (b.balance || 0) - (a.balance || 0));
            const userRank = sorted.findIndex(u => u.id === user.id) + 1;
            setRanking({ position: userRank, total: sorted.length });

            setLoading(false);
        } catch (err) {
            console.error('Error loading user data:', err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-semibold">Cargando datos...</p>
                </div>
            </div>
        );
    }

    const recentTransactions = transactions.slice(0, 10);
    const totalEarned = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
            {/* Header */}
            <div className="glass-card mx-4 my-4 sm:mx-6 lg:mx-8">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                                Amigas de Lidia
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">Bienvenid@, <span className="font-semibold">{userData?.name}</span> ✨</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Points Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white"
                >
                    <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-white/90 text-sm sm:text-base font-medium">Tus Puntos</span>
                        </div>
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                        >
                            {balance.toLocaleString()}
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm text-white/80">Ganados</span>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold">{totalEarned.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingDown className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm text-white/80">Consumidos</span>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold">{totalSpent.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Ranking Card */}
                {ranking && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 sm:p-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Tu Posición en el Ranking</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">#{ranking.position}</span>
                                        <span className="text-sm sm:text-base text-gray-500">de {ranking.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center sm:text-right bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                                <div className="text-xs sm:text-sm text-gray-500 mb-1">Percentil</div>
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Top {Math.round((ranking.position / ranking.total) * 100)}%
                                </div>
                                <div className="flex justify-center sm:justify-end mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Transactions History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 sm:p-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <History className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Historial de Movimientos</h2>
                    </div>

                    <div className="space-y-3 scrollbar-thin max-h-96 sm:max-h-[500px] overflow-y-auto pr-2">
                        {recentTransactions.map((transaction, idx) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all border border-gray-100 gap-3"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.amount > 0
                                        ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                                        : 'bg-gradient-to-br from-rose-400 to-red-500'
                                        } shadow-lg`}>
                                        {transaction.amount > 0 ? (
                                            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        ) : (
                                            <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{transaction.concept}</div>
                                        <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-xl sm:text-2xl font-bold text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                                    <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">pts</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {transactions.length > 10 && (
                        <button
                            onClick={() => setShowAllTransactions(true)}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            Ver todos los {transactions.length} movimientos <History className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            </div>

            {/* Modal for All Transactions */}
            {showAllTransactions && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAllTransactions(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                                <History className="w-6 h-6 sm:w-8 sm:h-8" />
                                Todos los Movimientos ({transactions.length})
                            </h2>
                            <button
                                onClick={() => setShowAllTransactions(false)}
                                className="p-2 hover:bg-red-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="overflow-y-auto scrollbar-thin flex-1">
                            <div className="space-y-3">
                                {transactions.map((transaction, idx) => (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all border border-gray-100 gap-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.amount > 0
                                                ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                                                : 'bg-gradient-to-br from-rose-400 to-red-500'
                                                } shadow-lg`}>
                                                {transaction.amount > 0 ? (
                                                    <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                ) : (
                                                    <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 text-sm sm:text-base">{transaction.concept}</div>
                                                <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-xl sm:text-2xl font-bold text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                                            <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">pts</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
