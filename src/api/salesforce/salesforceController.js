import { salesforceService } from "./salesforceService.js";

export const salesforceController = {
    async handleSalesforceSync(req, res, next) {
        try {
            const result = await salesforceService.createAccountWithContact(req.body);
            res.status(200).json({
                message: result.alreadySynced
                    ? 'User already synced with Salesforce'
                    : 'Account and Contact created successfully',
                ...result,
            });
        } catch (error) {
            console.error('Salesforce error:', error.response?.data || error.message);

            res.status(500).json({
                status: 'error',
                message: 'Salesforce integration failed',
                details: error.response?.data || error.message,
            });
            // next(error);
        }
    },
}