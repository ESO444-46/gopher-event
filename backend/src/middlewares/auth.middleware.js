const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repo');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
            message: err.name === 'TokenExpiredError'
                ? 'Your session has expired. Please log in again.'
                : 'Your session is no longer valid. Please log in again.',
        });
    }
}

async function requireOrganizer(req, res, next) {
    try {
        const user = await userRepo.findByEmail(req.user.email);

        if (!user || !user.isOrganizer) {
            return res.status(403).json({
                success: false,
                message: 'Only organizers can create events',
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = {
    authMiddleware,
    requireOrganizer
}

