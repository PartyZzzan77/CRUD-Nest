import { ReviewModel } from './review.model/review.model';
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewService } from './review.service';
import { JWTStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
	controllers: [ReviewController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ReviewModel,
				schemaOptions: {
					collection: 'Review',
				},
			},
		]),
	],
	providers: [ReviewService],
})
export class ReviewModule {}
