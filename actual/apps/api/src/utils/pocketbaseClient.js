import dotenv from 'dotenv';
dotenv.config();
import Pocketbase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://localhost:8090';
const pocketbaseClient = new Pocketbase(PB_URL);

try {
    if (!process.env.PB_SUPERUSER_EMAIL || !process.env.PB_SUPERUSER_PASSWORD) {
        console.warn('[WARN] PocketBase credentials are missing in env. Running in read-mostly mode.');
    } else {
        await pocketbaseClient.collection('_superusers').authWithPassword(
            process.env.PB_SUPERUSER_EMAIL,
            process.env.PB_SUPERUSER_PASSWORD,
        );
    }
} catch (error) {
    console.warn('[WARN] PocketBase superuser auth failed. Running without admin session.');
    console.warn('[WARN] Set PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD correctly for sync writes.');
}

export default pocketbaseClient;

export { pocketbaseClient };
