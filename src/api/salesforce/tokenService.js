import axios from 'axios';
import prisma from '../../config/database.js';

export const tokenService = {
  async getTokenRecord(userId) {
    const token = await prisma.salesforceToken.findUnique({ where: { userId } });
    if (!token) throw new Error("Salesforce token not found");
    return token;
  },

  isTokenValid(tokenRecord) {
    const now = new Date();
    return tokenRecord.expiresAt && tokenRecord.expiresAt > now;
  },

  async requestNewAccessToken(refreshToken) {
    const response = await axios.post(process.env.SF_TOKEN_URL, new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.SF_CLIENT_ID,
      client_secret: process.env.SF_CLIENT_SECRET,
      refresh_token: refreshToken,
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;

    return {
      accessToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  },

  async saveAccessToken(userId, accessToken, expiresAt) {
    await prisma.salesforceToken.update({
      where: { userId },
      data: {
        accessToken,
        expiresAt,
      },
    });
  },

  async refreshAccessToken(tokenRecord) {
    const { accessToken, expiresAt } = await this.requestNewAccessToken(tokenRecord.refreshToken);
    await this.saveAccessToken(tokenRecord.userId, accessToken, expiresAt);
    return accessToken;
  },

  async getValidAccessToken(userId) {
    const tokenRecord = await this.getTokenRecord(userId);
    if (this.isTokenValid(tokenRecord)) {
      return tokenRecord.accessToken;
    }
    return await this.refreshAccessToken(tokenRecord);
  },
};