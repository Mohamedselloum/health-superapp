import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});



describe("Auth (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/auth/signup (POST) - should register a new user", () => {
    return request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" })
      .expect(201)
      .expect((res) => {
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toEqual("test@example.com");
      });
  });

  it("/auth/signin (POST) - should login a user", () => {
    return request(app.getHttpServer())
      .post("/auth/signin")
      .send({ email: "test@example.com", password: "password123" })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

