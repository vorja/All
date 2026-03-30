import { Router } from 'express';
import { runSync } from '../services/integrationService.js';

const router = Router();

router.get('/agricol/status', async (_req, res, next) => {
  try {
    res.json({
      status: 'ready',
      integration: 'agricol_patacon_produccion'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/agricol/sync', async (req, res, next) => {
  try {
    const date = req.body?.date;
    const result = await runSync(date);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
