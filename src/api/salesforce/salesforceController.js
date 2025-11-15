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
            console.error("Salesforce sync error:", error.response?.data || error.message);
            next(error);
        }
    },

    async handleSalesforceUnsync(req, res, next) {
        try {
            const { email } = req.params;
            const result = await salesforceService.unsyncSalesforceContact(email);
            res.status(200).json({
                message: result.alreadyUnsynced
                    ? 'User was not synced with Salesforce'
                    : 'Salesforce contact removed and user unsynced',
                ...result,
            });
        } catch (error) {
            next(error);
        }
    },

    async handleOAuthCallback(req, res, next) {
        try {
            const { code, state } = req.query;

            if (!code || !state) {
                return res.status(400).json({ message: "Missing authorization code or state" });
            }

            const userId = state;

            await salesforceService.exchangeCodeForToken(code, userId);

            res.redirect(`${process.env.FRONTEND_URL}/salesforce/sync/${userId}`);
        } catch (error) {
            console.error("OAuth callback error:", error.response?.data || error.message);
            next(error);
        }
    }
}