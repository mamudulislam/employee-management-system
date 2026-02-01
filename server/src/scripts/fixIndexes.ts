// src/scripts/fixIndexes.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fixIndexes = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('Checking indexes for collection: users');
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');

        if (hasUsernameIndex) {
            console.log('Dropping index: username_1');
            await collection.dropIndex('username_1');
            console.log('Index dropped successfully');
        } else {
            console.log('Index username_1 not found');
        }

    } catch (err) {
        console.error('Error fixing indexes:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

fixIndexes();
