const fs = require('fs');
const csv = require('csv-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database/amigas.sqlite',
    logging: false
});

// Define Models
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
    id: { type: DataTypes.INTEGER, primaryKey: true }, // usp_id
    email: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    referral_link: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true }, // mov_id
    user_id: DataTypes.INTEGER,
    concept: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    type: DataTypes.INTEGER, // 100 or 200
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

async function importData() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced.');

        const results = [];
        fs.createReadStream('../qany787.csv')
            .pipe(csv({ headers: false })) // Read as array of values to handle varying columns
            .on('data', (data) => results.push(Object.values(data)))
            .on('end', async () => {
                console.log(`Parsed ${results.length} rows.`);

                const admins = [];
                const users = [];
                const transactions = [];

                for (const row of results) {
                    // Skip headers
                    if (row[0] === 'adm_id' || row[0] === 'usp_id' || row[0] === 'mov_id' || row[0] === 'con_id') continue;

                    // Check for Admin
                    if (row[4] === 'ADM' || row[4] === 'OPE') {
                        admins.push({
                            id: parseInt(row[0]),
                            email: row[1],
                            name: row[2],
                            password: row[3],
                            role: row[4],
                            status: row[5],
                            created_at: row[6]
                        });
                    }
                    // Check for Transaction
                    else if (row[4] === '100' || row[4] === '200') {
                        transactions.push({
                            id: parseInt(row[0]),
                            user_id: parseInt(row[1]),
                            concept: row[2],
                            amount: parseFloat(row[3]),
                            type: parseInt(row[4]),
                            status: row[5],
                            created_at: row[6]
                        });
                    }
                    // Check for User
                    else if (row[1] && row[1].includes('@')) {
                        // Schema 1: usp_ table (Link at index 3, Status at 4)
                        // Heuristic: Link is long string starting with 'os' OR length > 10
                        if (row[3] && row[3].length > 10) {
                            users.push({
                                id: parseInt(row[0]),
                                email: row[1],
                                name: row[2],
                                referral_link: row[3],
                                status: row[4],
                                password: row[5],
                                created_at: row[6]
                            });
                        }
                        // Schema 2: Old table? (Link is '0', Status at index 7)
                        else {
                            users.push({
                                id: parseInt(row[0]),
                                email: row[1],
                                name: row[2],
                                referral_link: null,
                                status: row[7] || 'A',
                                password: row[5],
                                created_at: row[8] || row[6] // Date might be at 8
                            });
                        }
                    }
                }

                console.log(`Found ${admins.length} admins, ${users.length} users, ${transactions.length} transactions.`);

                if (admins.length > 0) await Admin.bulkCreate(admins, { ignoreDuplicates: true });
                if (users.length > 0) await User.bulkCreate(users, { ignoreDuplicates: true });
                if (transactions.length > 0) await Transaction.bulkCreate(transactions, { ignoreDuplicates: true });

                console.log('Data import completed.');
            });

    } catch (error) {
        console.error('Import failed:', error);
    }
}

importData();
