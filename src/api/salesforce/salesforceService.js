import prisma from "../../config/database.js";
import { salesforceRepository } from './salesforceRepository.js';
import { config } from 'dotenv';

config();

export const salesforceService = {
    async createAccountWithContact(userData) {
        const localUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (localUser?.salesforceId) {
            return {
                alreadySynced: true,
                accountId: null,
                contactId: localUser.salesforceId,
            };
        }

        let accountId = await salesforceRepository.findAccountByName(process.env.SALESFORCE_MAIN_COMPANY);
        if (!accountId) {
            accountId = await salesforceRepository.createAccount(process.env.SALESFORCE_MAIN_COMPANY);
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

        const contactId = await salesforceRepository.createContact(contactPayload);

        await prisma.user.update({
            where: { email: userData.email },
            data: { salesforceId: contactId },
        });

        return { accountId, contactId, alreadySynced: false };
    },
};