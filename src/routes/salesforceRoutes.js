import express from 'express';
import { salesforceController } from '../api/salesforce/salesforceController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post("/sync", requireAuth, salesforceController.handleSalesforceSync);
router.get("/callback", salesforceController.handleOAuthCallback);
router.delete("/unsync/:email", requireAuth, salesforceController.handleSalesforceUnsync);

export default router;