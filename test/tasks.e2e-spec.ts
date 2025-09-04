import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    const userData = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const userResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    userId = userResponse.body.id;

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    authToken = loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  const createTestTask = () => ({
    title: 'testing',
    description: 'just testing',
    status: 'OPEN',
    userId: userId,
    labels: [
      {
        name: 'testing',
      },
    ],
  });

  it('/tasks (POST)', async () => {
    const testTask = createTestTask();

    await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testTask)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe(testTask.title);
        expect(res.body.description).toBe(testTask.description);
        expect(res.body.status).toBe(testTask.status);

        expect(res.body.userId).toBe(userId);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
      });
  });
});
