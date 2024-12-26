const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/userRoutes');

// ניצור אפליקציית Express לטסט
function createTestApp() {
    const app = express();
    app.use(express.json());
    app.use('/', userRouter);
    return app;
}

describe('User Routes Tests', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('POST /register', () => {
        it('should return 400 if fields are missing', async () => {
            const res = await request(app)
                .post('/register')
                .send({ email: 'test@example.com' }); // missing fullName, phone, password
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'All fields are required');
        });

        // ניתן למק את userRepository ברמת ה-Service או directly.
        // לצורך פשטות, נניח שיש DB אמיתי או שנצטרך mocking גלובלי יותר.
        // כאן רק מדגימים את מבנה ה-Supertest.

        it('should return 400 if email is already registered', async () => {
            // בהתאם ללוגיקה שלך, נניח שהבדיקה מחזירה 400 עם error מתאים
            const res = await request(app)
                .post('/register')
                .send({
                    fullName: 'Test User',
                    email: 'existing@example.com',
                    phone: '12345678',
                    password: 'password123',
                });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Email already registered');
        });

        it('should register a new user if data is valid', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    fullName: 'New User',
                    email: 'new@example.com',
                    phone: '1112222',
                    password: 'secret',
                });
            expect([200, 201]).toContain(res.status);
            // בהתאם לקוד שלך: res.status(201).json({...})
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body).toHaveProperty('userId');
        });
    });

    describe('POST /login', () => {
        it('should return 400 if fields are missing', async () => {
            const res = await request(app).post('/login').send({ email: '' });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Email or password are required');
        });

        it('should return 400 if invalid email', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'notfound@example.com', password: '123' });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Invalid email');
        });

        it('should return 400 if password is wrong', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrong' });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Invalid password');
        });

        it('should return 200 and userId if login is successful', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'correctPass' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('userId');
        });
    });

});
