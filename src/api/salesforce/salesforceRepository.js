import { config } from 'dotenv';
import axios from 'axios';

config();

const headers = {
    Authorization: `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
};

const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

export const salesforceRepository = {
    async createAccount(companyName) {
        const url = `${instanceUrl}/services/data/v65.0/sobjects/Account/`;
        const response = await axios.post(url, { Name: companyName }, { headers });
        return response.data.id;
    },

    async createContact(contactData) {
        const url = `${instanceUrl}/services/data/v65.0/sobjects/Contact/`;
        const response = await axios.post(url, contactData, { headers });
        return response.data.id;
    },

    async findAccountByName(name) {
        const query = `SELECT Id FROM Account WHERE Name = '${name}' LIMIT 1`;
        const url = `${instanceUrl}/services/data/v65.0/query/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, { headers });
        return response.data.records[0]?.Id || null;
    },
};