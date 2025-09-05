import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from 'src/users/user/role.enum';
import { User } from 'src/users/user.entity';
import { PasswordService } from 'src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  it('should require auth', async () => {
    return request(testSetup.app.getHttpServer()).get('/tasks').expect(401);
  });

  it('should allow public route access', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(201);
  });

  it('/auth/register (POST)', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('should include roles in JWT token', async () => {
    const userRepo = testSetup.app.get(getRepositoryToken(User));

    await userRepo.save({
      ...testUser,
      roles: [Role.ADMIN],
      password: await testSetup.app
        .get(PasswordService)
        .hash(testUser.password),
    });

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const decoded = testSetup.app
      .get(JwtService)
      .verify(response.body.accessToken);

    expect(decoded.roles).toBeDefined();
    expect(decoded.roles).toContain(Role.ADMIN);
  });

  it('/auth/register (POST) - duplicate email', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    return await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(409);
  });

  it('/auth/login (POST)', async () => {
    // Register the test user first
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });

  it('/auth/profile (GET)', async () => {
    // Register the test user first
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = response.body.accessToken;

    return await request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });
});
