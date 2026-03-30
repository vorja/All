import dotenv from 'dotenv';
dotenv.config();
import Pocketbase from 'pocketbase';

const pocketbaseClient = new Pocketbase('http://localhost:8090');

try {
    await pocketbaseClient.collection('_superusers').authWithPassword(
        process.env.PB_SUPERUSER_EMAIL,
        process.env.PB_SUPERUSER_PASSWORD,
    );
} catch (error) {
    console.warn('[WARN] PocketBase superuser auth failed. Running without admin session.');
    console.warn('[WARN] Set PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD correctly for sync writes.');
}

export default pocketbaseClient;

export { pocketbaseClient };
