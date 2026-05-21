const requireSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized: please login first' });
    }

    return next();
};

module.exports = requireSession;
