import { AuthDto } from './../src/auth/dto/auth.dto';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	name: 'Test',
	title: 'Title',
	rating: 5,
	description: 'lorem ipsum',
	productId,
};

const loginDto: AuthDto = {
	login: 'news@news.com',
	password: '1',
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);

		token = body.access_token;
	});

	it('/review/create (POST) - Ok', async (done) => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }) => {
				createdId = body._id;
				expect(createdId).toBeDefined();

				done();
			});
	});

	it('/review/create (POST) - Fail', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(400);
	});

	it('/review/byProduct/:productId (GET) - OK', async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + createdId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
				done();
			});
	});

	it('/review/:id (DELETE)', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', 'Bearer' + token)
			.expect(200);
	});

	it('/review/byProduct/:productId (GET) - ERR', async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);

				done();
			});
	});

	it('/review/:id (DELETE)', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer' + token)
			.expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
	});

	afterAll(() => {
		disconnect();
	});
});
