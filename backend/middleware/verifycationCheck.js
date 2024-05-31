import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Ad from '../models/Ad.js';

const isUserActive = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization : null;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                if (user.isActive === true || user.role === 'admin') {
                    req.user = user;
                    next();
                } else {
                    res.status(403).json({ message: 'User is not active' });
                }
            } else {
                res.status(403).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
};

const adOwnershipCheck = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (ad.createdBy.toString() === req.user._id.toString() || req.user.role === 'admin') {
            req.ad = ad;
            next();
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { isUserActive, adOwnershipCheck };