import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { getUsers, deleteUser, updateUser } from '../controllers/userController.js';
import User from '../models/User.js';
import Ad from '../models/Ad.js';

const app = express();
app.use(express.json());

app.get('/api/users', getUsers);
app.delete('/api/users/:id', deleteUser);
app.put('/api/users/:id', updateUser);

describe('User Controller', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(4000);
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const users = [
                { name: 'User 1', email: 'user1@example.com', phone: '1234567890' },
                { name: 'User 2', email: 'user2@example.com', phone: '0987654321' }
            ];

            jest.spyOn(User, 'find').mockResolvedValue(users);

            const res = await request(app).get('/api/users');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(User, 'find').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/users');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user and their ads', async () => {
            const user = { _id: '1', name: 'User 1', email: 'user1@example.com' };

            jest.spyOn(User, 'findById').mockResolvedValue(user);
            jest.spyOn(Ad, 'deleteMany').mockResolvedValue({});
            jest.spyOn(User.prototype, 'remove').mockResolvedValue({});

            const res = await request(app).delete(`/api/users/${user._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'User deleted' });
        });

        it('should return 404 if user not found', async () => {
            jest.spyOn(User, 'findById').mockResolvedValue(null);

            const res = await request(app).delete('/api/users/1');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(User, 'findById').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).delete('/api/users/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user details', async () => {
            const user = { _id: '1', name: 'User 1', email: 'user1@example.com', phone: '1234567890', isActive: true };
            const updatedData = { name: 'Updated User', email: 'updated@example.com', phone: '0987654321', isActive: false };

            jest.spyOn(User, 'findById').mockResolvedValue(user);
            jest.spyOn(User.prototype, 'save').mockResolvedValue({ ...user, ...updatedData });

            const res = await request(app).put(`/api/users/${user._id}`).send(updatedData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ...user, ...updatedData });
        });

        it('should return 404 if user not found', async () => {
            jest.spyOn(User, 'findById').mockResolvedValue(null);

            const res = await request(app).put('/api/users/1').send({ name: 'Updated User' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should return 500 if an error occurs', async () => {
            jest.spyOn(User, 'findById').mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).put('/api/users/1').send({ name: 'Updated User' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal Server Error' });
        });
    });
});
