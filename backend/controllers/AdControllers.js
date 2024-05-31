import Ad from '../models/Ad.js';

const createAd = async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const ad = new Ad({
            title,
            description,
            price,
            createdBy: req.user._id,
        });

        await ad.save();
        res.status(201).json(ad);
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Error creating ad' });
    }
};

const updateAd = async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.price = price || ad.price;

        await ad.save();
        res.status(200).json(ad);
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ message: 'Error updating ad' });
    }
};

const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await ad.deleteOne();
        res.status(200).json({ message: 'Ad deleted' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Error deleting ad' });
    }
};

const getAds = async (req, res) => {
    try {
        const ads = await Ad.find().populate('createdBy', 'name email phone');
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error getting ads:', error);
        res.status(500).json({ message: 'Error getting ads' });
    }
};

export { getAds, createAd, updateAd, deleteAd };
