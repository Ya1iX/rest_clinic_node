const jwt = require('jsonwebtoken');
const JwtToken = require('../models/JwtToken');

class JwtService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
            expiresIn: '1h'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
            expiresIn: '7d'
        });
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenDB = await JwtToken.findOne({
            where: {
                user_id: userId
            }
        });

        // Если пользователь авторизован, то перезаписать токен
        if (tokenDB) {
            tokenDB.refresh_token = refreshToken;
            return await tokenDB.save();
        }

        // Если не авторизован, то создать новую запись
        return await JwtToken.create({user_id: userId, refresh_token: refreshToken})
    }

    async generateAndSaveToken(payload){
        const tokens = this.generateTokens(payload);
        await this.saveToken(payload.id, tokens.refreshToken);
        return tokens;
    }

    async removeToken(refreshToken) {
        await JwtToken.destroy({
            where: {
                refresh_token: refreshToken
            }
        });
    }

    async findToken(token) {
        return await JwtToken.findOne({
            where: {
                refresh_token: token
            }
        });
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_KEY);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_KEY);
        } catch (e) {
            return null;
        }
    }
}

module.exports = new JwtService();