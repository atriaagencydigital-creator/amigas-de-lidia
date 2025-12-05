import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import API_URL from '../config/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/api/login`, { email, password });
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('role', res.data.role);
                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError('Credenciales incorrectas. Por favor, verifica tus datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-400/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="glass-card p-8 sm:p-10 md:p-12 w-full max-w-md sm:max-w-lg relative z-10"
            >
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-3">
                        Amigas de Lidia
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">✨ Bienvenido al Club de Socios ✨</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl mb-6 text-sm sm:text-base text-center shadow-lg"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Email o Usuario"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-modern pl-12 sm:pl-14 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-modern pl-12 sm:pl-14 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Entrando...
                            </>
                        ) : (
                            <>
                                Entrar <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Benefits Link */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/benefits')}
                        type="button"
                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm sm:text-base underline flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Ver Beneficios del Club de Socios
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
