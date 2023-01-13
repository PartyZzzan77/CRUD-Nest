import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
	return {
		uri: getMongoString(configService),
		...getMongoOptions()
	}
}

const getMongoString = (configService: ConfigService) => `mongodb://${configService.get('MONGO_HOST')}:${configService.get('PORT')}/${configService.get('MONGO_AUTH_DB')}`

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true
})