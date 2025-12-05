import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Gift,
    Star,
    Trophy,
    CreditCard,
    ArrowLeft,
    CheckCircle,
    Award,
    Sparkles,
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign
} from 'lucide-react';

const Benefits = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Login
                    </button>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">
                        Club de Socios Amigas de Lidia
                    </h1>
                    <p className="text-gray-600 text-lg">Beneficios exclusivos para nuestros miembros</p>
                </motion.div>

                {/* Ventajas Principales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                        <Gift className="w-8 h-8" />
                        ¿Por qué ser socio?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: TrendingUp, text: 'Acumulas puntos "Lidia" que se traducen en servicios gratis' },
                            { icon: ShoppingBag, text: 'Ofertas puntuales SOLO para socios' },
                            { icon: Trophy, text: 'Sorteo mensual de un servicio gratis' },
                            { icon: Users, text: 'Prioridad para citas con chicas nuevas' },
                            { icon: Sparkles, text: '15 puntos gratis al registrarte' },
                            { icon: Award, text: 'Y más ventajas que iremos añadiendo' }
                        ].map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                                className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                            >
                                <benefit.icon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                <p className="text-gray-800 font-medium">{benefit.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Cómo Funcionan los Puntos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                        <DollarSign className="w-8 h-8" />
                        ¿Cómo funcionan los puntos?
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Acumulación de Puntos
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Acumulas el <strong>10% de tu gasto en puntos</strong> (excepto tarifas especiales)</li>
                                <li>• Ejemplo: Servicio de 100€ = 10 puntos Lidia</li>
                                <li>• Solo por registrarte recibes <strong>15 puntos gratis</strong></li>
                            </ul>
                        </div>

                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Reclamación de Puntos
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Envía un email a <strong>lidia-1997@outlook.es</strong></li>
                                <li>• Indica: día, hora, duración y señorita de tu cita</li>
                                <li>• Puntos anotados en máximo 5 días</li>
                                <li>• <strong>¡Importante!</strong> Reclama antes de 30 días o perderás los puntos</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl">
                            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Uso de Puntos
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Los puntos son como dinero</li>
                                <li>• Solo se usan en servicios COMPLETOS</li>
                                <li>• No se pueden usar como descuentos parciales</li>
                                <li>• Consulta tus movimientos en tu panel de control</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Consumo de Puntos - Tarifas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6">
                        Consumo de Puntos - Chicas Tarifa A
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { time: 'Media hora', points: '90 puntos' },
                            { time: '45 minutos', points: '110 puntos' },
                            { time: '1 hora', points: '140 puntos' }
                        ].map((tariff, idx) => (
                            <div key={idx} className="stat-card from-pink-400 to-purple-500 text-white text-center">
                                <div className="text-xl font-bold mb-2">{tariff.time}</div>
                                <div className="text-3xl font-extrabold">{tariff.points}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Compra de Puntos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                        <CreditCard className="w-8 h-8" />
                        Compra de Puntos Lidia
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Compra en el piso con cualquier chica indicando tu email y nick.
                        <strong> Los puntos NO caducan</strong> y entras automáticamente en sorteos mensuales.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { points: '300', price: '270€' },
                            { points: '500', price: '440€' },
                            { points: '700', price: '615€' },
                            { points: '1000', price: '870€' }
                        ].map((pack, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-emerald-400 to-green-500 p-6 rounded-2xl text-white text-center shadow-xl">
                                <div className="text-4xl font-bold mb-2">{pack.points}</div>
                                <div className="text-sm mb-2">puntos</div>
                                <div className="text-2xl font-bold">{pack.price}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Niveles de Socio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                        <Star className="w-8 h-8" />
                        Niveles de Socio
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Plata */}
                        <div className="bg-gradient-to-br from-gray-300 to-gray-400 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                PLATA (Inicial)
                            </h3>
                            <ul className="space-y-2 text-gray-800 text-sm">
                                <li>✓ Acumula 10% en puntos</li>
                                <li>✓ Sorteo mensual</li>
                            </ul>
                        </div>

                        {/* Oro */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                ORO
                            </h3>
                            <ul className="space-y-2 text-white text-sm mb-4">
                                <li>✓ Acumula 12% en puntos</li>
                                <li>✓ Servicio gratis mensual</li>
                                <li>✓ Cita gratis con chicas nuevas</li>
                                <li>✓ 20% descuento en bonos</li>
                            </ul>
                            <p className="text-xs text-white/90 border-t border-white/30 pt-3">
                                <strong>Requisito:</strong> 35 visitas en 3 meses o cuota de 300€/mes
                            </p>
                        </div>

                        {/* Platino */}
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                PLATINO
                            </h3>
                            <ul className="space-y-2 text-white text-sm mb-4">
                                <li>✓ Acumula 15% en puntos</li>
                                <li>✓ Sorteo mensual</li>
                                <li>✓ Cita gratis con chicas nuevas</li>
                                <li>✓ 20% descuento en bonos</li>
                                <li>✓ <strong>40% descuento en todos los servicios</strong></li>
                            </ul>
                            <p className="text-xs text-white/90 border-t border-white/30 pt-3">
                                <strong>Cuota:</strong> 500€/mes
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Sorteo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4 flex items-center gap-2">
                        <Trophy className="w-8 h-8" />
                        Sorteo Mensual
                    </h2>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                        <p className="text-gray-800 mb-3">
                            Cada visita te da un número entre 00-99. El ganador se determina con <strong>las dos últimas cifras del sorteo de la ONCE del día 1 de cada mes</strong>.
                        </p>
                        <p className="text-gray-800">
                            <strong>Premio:</strong> Un servicio gratis de media hora<br />
                            <strong>¡Importante!</strong> El ganador tiene solo 1 semana para reclamar su premio.
                        </p>
                    </div>
                </motion.div>

                {/* Condiciones Importantes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass-card p-6 sm:p-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                        Condiciones Importantes
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <strong className="text-red-900">Caducidad:</strong>
                            <p className="mt-2">• Puntos comprados: NUNCA caducan</p>
                            <p>• Puntos acumulados: Caducan si no vienes en 6 meses</p>
                        </div>

                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
                            <strong className="text-yellow-900">Puntos Comprados:</strong>
                            <p className="mt-2">• NO se admiten devoluciones</p>
                            <p>• Se pueden transferir a otros socios con consentimiento</p>
                        </div>

                        <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl">
                            <strong className="text-orange-900">Derecho de Admisión:</strong>
                            <p className="mt-2">
                                La agencia se reserva el derecho de dar de baja a un socio (con pérdida de puntos)
                                si no cumple condiciones de higiene básicas, no respeta a las señoritas o causa incomodidad.
                                Se avisará por email antes de la baja definitiva.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white text-center">
                        <p className="text-lg mb-2">¿Dudas o consultas?</p>
                        <a href="mailto:lidia-1997@outlook.es" className="text-2xl font-bold hover:underline">
                            lidia-1997@outlook.es
                        </a>
                    </div>
                </motion.div>

                {/* CTA to Register */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary text-xl px-12 py-4"
                    >
                        Volver al Login
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Benefits;
