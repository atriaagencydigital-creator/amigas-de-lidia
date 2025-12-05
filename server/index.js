const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const DATABASE_PATH = process.env.DATABASE_PATH || '../database/amigas.sqlite';

// CORS configuration
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// Database Setup
// Database Setup
let sequelize;

if (process.env.POSTGRES_URL) {
    // Production (Vercel/Postgres)
    sequelize = new Sequelize(process.env.POSTGRES_URL, {
        dialect: 'postgres',
        dialectModule: require('pg'),
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
    // Development (Local SQLite)
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_PATH,
        logging: false
    });
}

// Models
const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    email: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    referral_link: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: DataTypes.INTEGER,
    concept: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    type: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

// Routes

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check Admin first
        const admin = await Admin.findOne({ where: { email, password } });
        if (admin) return res.json({ success: true, user: admin, role: 'admin' });

        // Check User
        const user = await User.findOne({ where: { email, password } });
        if (user) return res.json({ success: true, user: user, role: 'user' });

        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register
app.post('/api/register', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const maxId = await User.max('id') || 0;
        const user = await User.create({
            id: maxId + 1,
            email,
            name,
            password,
            referral_link: '',
            status: 'A',
            created_at: new Date()
        });

        // Give 15 welcome points
        const maxTransactionId = await Transaction.max('id') || 0;
        await Transaction.create({
            id: maxTransactionId + 1,
            user_id: user.id,
            concept: 'Bienvenida al Club - Regalo de registro',
            amount: 15,
            type: 100,
            status: 'A',
            created_at: new Date()
        });

        res.json({ success: true, user, message: '¡Registro exitoso! Has recibido 15 puntos de bienvenida.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Data (Points & History)
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const transactions = await Transaction.findAll({
            where: { user_id: user.id },
            order: [['created_at', 'DESC']]
        });

        // Calculate Balance
        const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

        res.json({ user, balance, transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Add Transaction
app.post('/api/transaction', async (req, res) => {
    const { user_id, amount, concept, type } = req.body;
    try {
        const maxId = await Transaction.max('id') || 0;
        const transaction = await Transaction.create({
            id: maxId + 1,
            user_id,
            amount,
            concept,
            type,
            status: 'A',
            created_at: new Date()
        });
        res.json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all transactions (for admin history)
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            order: [['created_at', 'DESC']],
            limit: 10000 // Limit to avoid overwhelming the response
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize demo user and admin on startup
// Initialize demo user and admin on startup
(async () => {
    try {
        await sequelize.sync(); // Ensure tables exist

        // Initialize demo user
        const user = await User.findByPk(1);
        if (user) {
            await user.update({ password: 'demo123' });
            console.log('✓ Demo user ready: adolfo.p@terra.com / demo123');
        }

        // Initialize admin user
        let admin = await Admin.findOne({ where: { email: 'lidia-1997@outlook.es' } });
        if (!admin) {
            const maxAdminId = await Admin.max('id') || 0;
            admin = await Admin.create({
                id: maxAdminId + 1,
                email: 'lidia-1997@outlook.es',
                name: 'Lidia Admin',
                password: 'lidiaadmin!!!',
                role: 'admin',
                status: 'A',
                created_at: new Date()
            });
            console.log('✓ Admin user created: lidia-1997@outlook.es');
        } else {
            await admin.update({ password: 'lidiaadmin!!!' });
            console.log('✓ Admin user ready: lidia-1997@outlook.es');
        }
    } catch (err) {
        console.error('Error initializing users:', err);
    }
})();

// Export for Vercel
module.exports = app;

// Start server if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ CORS enabled for: ${CORS_ORIGIN}`);
        console.log(`✓ Database: ${process.env.POSTGRES_URL ? 'PostgreSQL' : DATABASE_PATH}`);
    });
}
