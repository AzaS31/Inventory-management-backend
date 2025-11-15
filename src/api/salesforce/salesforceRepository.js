import axios from 'axios';
import prisma from '../../config/database.js';

const getHeaders = (accessToken) => ({
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
});

const InstanceUrl = process.env.SALESFORCE_INSTANCE_URL;

export const salesforceRepository = {
    async createAccount(accessToken, companyName) {
        const url = `${InstanceUrl}/services/data/v65.0/sobjects/Account/`;
        const response = await axios.post(url, { Name: companyName }, { headers: getHeaders(accessToken) });
        return response.data.id;
    },

    async createContact(accessToken, contactData) {
        const url = `${InstanceUrl}/services/data/v65.0/sobjects/Contact/`;
        const response = await axios.post(url, contactData, { headers: getHeaders(accessToken) });
        return response.data.id;
    },

    async findAccountByName(accessToken, name) {
        const query = `SELECT Id FROM Account WHERE Name = '${name}' LIMIT 1`;
        const url = `${InstanceUrl}/services/data/v65.0/query/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, { headers: getHeaders(accessToken) });
        return response.data.records[0]?.Id || null;
    },

    async deleteContact(accessToken, contactId) {
        const url = `${InstanceUrl}/services/data/v65.0/sobjects/Contact/${contactId}`;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        await axios.delete(url, { headers });
    },

    async upsertToken(userId, { accessToken, refreshToken, expiresAt }) {
        await prisma.salesforceToken.upsert({
            where: { userId },
            update: { accessToken, refreshToken, expiresAt },
            create: { userId, accessToken, refreshToken, expiresAt },
        });
    }
};