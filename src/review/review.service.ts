import { Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { ReviewModel } from './review.model/review.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel)
		private readonly reviewModel: ModelType<ReviewModel>,
	) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async deleteByProductId(id: string) {
		return this.reviewModel
			.deleteMany({ id: new Types.ObjectId(id) })
			.exec();
	}

	async findByProductId(id: string): Promise<DocumentType<ReviewModel>[]> {
		return this.reviewModel.find({ id: new Types.ObjectId(id) }).exec();
	}
}
