const fs = require('fs');
const csv = require('csv-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Database Setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database/amigas.sqlite',
    logging: false
});

// Transaction Model
const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: DataTypes.INTEGER,
    concept: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    type: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATEONLY
}, { timestamps: false });

async function importMovimientos() {
    try {
        await sequelize.sync();

        // Get current max transaction ID
        let maxId = await Transaction.max('id') || 0;
        console.log(`Current max transaction ID: ${maxId}`);

        const movimientos = [];

        fs.createReadStream('../movimientos.csv')
            .pipe(csv())
            .on('data', (row) => {
                // Parse the CSV row
                movimientos.push({
                    id: parseInt(row.mov_id),
                    user_id: parseInt(row.mov_idusuario),
                    concept: row.mov_concepto,
                    amount: parseFloat(row.mov_importe),
                    type: parseInt(row.mov_tipo),
                    status: row.mov_estado,
                    created_at: row.mov_fechaalta
                });
            })
            .on('end', async () => {
                console.log(`Found ${movimientos.length} movimientos in CSV`);

                let imported = 0;
                let skipped = 0;

                for (const mov of movimientos) {
                    // Check if transaction already exists
                    const existing = await Transaction.findByPk(mov.id);

                    if (!existing) {
                        await Transaction.create(mov);
                        imported++;
                    } else {
                        skipped++;
                    }
                }

                console.log(`\n✓ Import complete!`);
                console.log(`  - Imported: ${imported} new transactions`);
                console.log(`  - Skipped: ${skipped} existing transactions`);
                console.log(`  - Total in DB: ${imported + skipped}`);

                process.exit(0);
            });
    } catch (err) {
        console.error('Error importing movimientos:', err);
        process.exit(1);
    }
}

importMovimientos();
