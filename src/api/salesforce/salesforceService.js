import { userRepository } from '../users/userRepository.js';
import { salesforceRepository } from './salesforceRepository.js';
import { tokenService } from './tokenService.js';
import axios from 'axios';

const company = process.env.SALESFORCE_MAIN_COMPANY;

export const salesforceService = {
    async createAccountWithContact(userData) {
        const localUser = await userRepository.findByEmail(userData.email);
        if (localUser?.salesforceId) {
            return {
                alreadySynced: true,
                accountId: null,
                contactId: localUser.salesforceId,
            };
        }

        const accessToken = await tokenService.getValidAccessToken(localUser.id);

        let accountId = await salesforceRepository.findAccountByName(accessToken, company);
        if (!accountId) {
            accountId = await salesforceRepository.createAccount(accessToken, company);
        }

        const contactPayload = {
            FirstName: userData.firstName,
            LastName: userData.lastName,
            Email: userData.email,
            AccountId: accountId,
            Title: userData.title,
            Phone: userData.phone,
            MobilePhone: userData.mobilePhone,
        };

        const contactId = await salesforceRepository.createContact(accessToken, contactPayload);

        await userRepository.updateSalesforceId(userData.email, contactId);

        return { accountId, contactId, alreadySynced: false };
    },

    async unsyncSalesforceContact(userEmail) {
        const localUser = await userRepository.findByEmail(userEmail);
        if (!localUser?.salesforceId) {
            return { alreadyUnsynced: true };
        }

        const accessToken = await tokenService.getValidAccessToken(localUser.id);

        try {
            await salesforceRepository.deleteContact(accessToken, localUser.salesforceId);
        } catch (error) {
            console.warn('Salesforce contact deletion failed:', error.response?.data || error.message);
        }

        await userRepository.updateSalesforceId(userEmail, null);

        return { alreadyUnsynced: false };
    },

    async exchangeCodeForToken(code, userId) {
        const params = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: process.env.SF_CLIENT_ID,
            client_secret: process.env.SF_CLIENT_SECRET,
            redirect_uri: process.env.SF_REDIRECT_URI,
        });

        const response = await axios.post(process.env.SF_TOKEN_URL, params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { access_token, refresh_token, issued_at, expires_in } = response.data;

        const expiresAt = new Date(Number(issued_at) + (expires_in || 3600) * 1000);

        await salesforceRepository.upsertToken(userId, {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt,
        });
    }
}; 