import { JWTAuthGuard } from './../auth/guards/jwt.guard';
import { REVIEW_NOT_FOUND } from './review.constants';
import { CreateReviewDto } from './dto/create-review.dto';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UseGuards(JWTAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deleteDoc = await this.reviewService.delete(id);
		if (!deleteDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async get(@Param('productId') productId: string) {
		return this.reviewService.findByProductId(productId);
	}
}
