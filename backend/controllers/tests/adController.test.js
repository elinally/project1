import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { getAds, createAd, updateAd, deleteAd } from '../AdControllers.js';
import Ad from '../../models/Ad.js';
import mockingoose from 'mockingoose';

const app = express();
app.use(express.json());

// Mock route to handle requests
app.get('/api/ads', getAds);
app.post('/api/ads', createAd);
app.put('/api/ads/:id', updateAd);
app.delete('/api/ads/:id', deleteAd);

describe('Ad Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn().mockReturnValue(res),
            status: jest.fn().mockReturnValue(res),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAds', () => {
        it('should return all ads', async () => {
            const mockAds = [{ id: '1', title: 'Ad 1' }, { id: '2', title: 'Ad 2' }];
            mockingoose(Ad).toReturn(mockAds, 'find');

            await getAds(req, res, next);

            expect(Ad.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAds);
        });

        it('should return a 500 error if something goes wrong', async () => {
            mockingoose(Ad).toReturn(new Error('Server error'), 'find');

            await getAds(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error getting ads' });
        });
    });

    describe('createAd', () => {
        it('should create a new ad', async () => {
            req.body = { title: 'New Ad', description: 'Ad Description', price: 100 };
            req.user = { _id: 'user1' };

            const mockAd = { _id: '1', ...req.body, createdBy: req.user._id };
            mockingoose(Ad).toReturn(mockAd, 'save');

            await createAd(req, res, next);

            expect(Ad.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAd);
        });

        it('should return a 500 error if something goes wrong', async () => {
            mockingoose(Ad).toReturn(new Error('Server error'), 'save');

            await createAd(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating ad' });
        });
    });

    describe('updateAd', () => {
        it('should update an ad', async () => {
            req.body = { title: 'Updated Ad' };
            req.params = { id: '1' };
            req.user = { _id: 'user1', role: 'user' };

            const mockAd = { _id: '1', title: 'Original Ad', description: 'Ad Description', price: 100, createdBy: req.user._id };
            mockingoose(Ad).toReturn(mockAd, 'findOne');
            mockingoose(Ad).toReturn({ ...mockAd, ...req.body }, 'save');

            await updateAd(req, res, next);

            expect(Ad.findOne).toHaveBeenCalled();
            expect(Ad.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ ...mockAd, ...req.body });
        });

        it('should return a 500 error if something goes wrong', async () => {
            req.body = { title: 'Updated Ad' };
            req.params = { id: '1' };

            mockingoose(Ad).toReturn(new Error('Server error'), 'findOne');

            await updateAd(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error updating ad' });
        });
    });

    describe('deleteAd', () => {
        it('should delete an ad', async () => {
            req.params = { id: '1' };
            req.user = { _id: 'user1', role: 'user' };

            const mockAd = { _id: '1', title: 'Ad to be deleted', createdBy: req.user._id };
            mockingoose(Ad).toReturn(mockAd, 'findOne');
            mockingoose(Ad).toReturn({}, 'deleteOne');

            await deleteAd(req, res, next);

            expect(Ad.findOne).toHaveBeenCalled();
            expect(Ad.deleteOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ad deleted' });
        });

        it('should return a 500 error if something goes wrong', async () => {
            req.params = { id: '1' };

            mockingoose(Ad).toReturn(new Error('Server error'), 'findOne');

            await deleteAd(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting ad' });
        });
    });
});
