import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { getAds, createAd, updateAd, deleteAd } from '../controllers/adController.js';
import Ad from '../models/Ad.js';
import User from '../models/User.js';

const app = express();
app.use(express.json());

app.get('/api/ads', getAds);
app.post('/api/ads', createAd);
app.put('/api/ads/:id', updateAd);
app.delete('/api/ads/:id', deleteAd);

describe('Ad Controller', () => {
    let server;
    let userId;
    let adId;

    beforeAll(async () => {
        server = app.listen(4000);
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    beforeEach(async () => {
        
        await User.deleteMany({});
        await Ad.deleteMany({});

        const user = await User.create({ name: 'Test User', email: 'test@example.com', phone: '1234567890' });
        userId = user._id.toString();

        const ad = await Ad.create({ title: 'Test Ad', description: 'Test Description', price: 100, createdBy: userId });
        adId = ad._id.toString();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/ads', () => {
        it('should return all ads', async () => {
            const res = await request(app).get('/api/ads');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1); 
            expect(res.body[0].title).toBe('Test Ad'); 
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(Ad, 'find').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/ads');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error getting ads' });
        });
    });

    describe('POST /api/ads', () => {
        it('should create a new ad', async () => {
            const newAd = {
                title: 'New Ad',
                description: 'New Description',
                price: 200
            };

            const res = await request(app)
                .post('/api/ads')
                .send(newAd)
                .set('user', { _id: userId });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe(newAd.title);
            expect(res.body.description).toBe(newAd.description);
            expect(res.body.price).toBe(newAd.price);
            expect(res.body.createdBy).toBe(userId);
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(Ad.prototype, 'save').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app)
                .post('/api/ads')
                .send({ title: 'New Ad', description: 'New Description', price: 200 })
                .set('user', { _id: userId });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error creating ad' });
        });
    });

    describe('PUT /api/ads/:id', () => {
        it('should update an ad', async () => {
            const updatedAd = {
                title: 'Updated Ad',
                description: 'Updated Description',
                price: 150
            };

            const res = await request(app)
                .put(`/api/ads/${adId}`)
                .send(updatedAd)
                .set('user', { _id: userId });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe(updatedAd.title);
            expect(res.body.description).toBe(updatedAd.description);
            expect(res.body.price).toBe(updatedAd.price);
            expect(res.body.createdBy).toBe(userId);
        });

        it('should return 404 if ad not found', async () => {
            const res = await request(app)
                .put(`/api/ads/${mongoose.Types.ObjectId()}`)
                .send({ title: 'Updated Ad' })
                .set('user', { _id: userId });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Ad not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const res = await request(app)
                .put(`/api/ads/${adId}`)
                .send({ title: 'Updated Ad' });

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ message: 'Access denied' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(Ad, 'findByIdAndUpdate').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app)
                .put(`/api/ads/${adId}`)
                .send({ title: 'Updated Ad' })
                .set('user', { _id: userId });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error updating ad' });
        });
    });

    describe('DELETE /api/ads/:id', () => {
        it('should delete an ad', async () => {
            const res = await request(app)
                .delete(`/api/ads/${adId}`)
                .set('user', { _id: userId });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Ad deleted' });
        });

        it('should return 404 if ad not found', async () => {
            const res = await request(app)
                .delete(`/api/ads/${mongoose.Types.ObjectId()}`)
                .set('user', { _id: userId });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Ad not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const res = await request(app)
                .delete(`/api/ads/${adId}`);

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ message: 'Access denied' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(Ad, 'findByIdAndDelete').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app)
                .delete(`/api/ads/${adId}`)
                .set('user', { _id: userId });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error deleting ad' });
        });
    });
});
