import { Router } from 'express';
import healthCheck from './health-check.js';
import integrationRoutes from './integration.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/integration', integrationRoutes);

    return router;
};