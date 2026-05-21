const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Keep existing session auth support
    if (req.session && req.session.user) {
        req.auth = {
            type: 'session',
            user: {
                id: String(req.session.user.id || req.session.user._id),
                username: req.session.user.username,
                role: req.session.user.role
            }
        };
        return next();
    }

    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized: token or session required' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'incident-reporting-jwt-secret'
        );

        req.auth = {
            type: 'token',
            user: {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            }
        };

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = requireAuth;
