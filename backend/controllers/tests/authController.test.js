
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/passwordUtils';
import User from '../models/User';
import app from '../app'; 

describe('Auth Controller', () => {
    let testUser;
    const mockToken = 'mocked.jwt.token';

    beforeAll(async () => {
        const password = await hashPassword('testpassword');
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            password,
        });
    });

    afterAll(async () => {
        await User.findByIdAndDelete(testUser._id);
    });

    it('should return 400 for login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for login with missing email or password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should successfully log in with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'testpassword' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(String(testUser._id));
        expect(decoded.role).toBe(testUser.role);
    });

    it('should handle server errors gracefully', async () => {
      
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Mocked database error');
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'testpassword' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
