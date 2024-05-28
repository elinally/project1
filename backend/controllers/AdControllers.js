import Ad from "../models/Ad.js";
import mongoose from "mongoose";

export const getAds = async (req, res) => {
    try {
        const ads = await Ad.find().populate('user', 'name email phone');
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createAd = async (req, res) => {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const ad = new Ad({
            title,
            description,
            price,
            user: req.user.id
        });
        await ad.save();
        res.status(201).json(ad);
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAd = async (req, res) => {
    const { title, description, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ad ID' });
    }

    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.price = price || ad.price;

        await ad.save();
        res.status(200).json(ad);
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAd = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ad ID' });
    }

    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await ad.remove();
        res.status(200).json({ message: 'Ad deleted' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
