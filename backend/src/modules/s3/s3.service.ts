import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
	private client: S3Client;
	private bucket: string;
	private endpoint: string;

	constructor(private readonly configService: ConfigService) {
		this.bucket = this.configService.get<string>('AWS_S3_BUCKET')!;
		this.endpoint = this.configService.get<string>('AWS_S3_ENDPOINT')!;

		this.client = new S3Client({
			region: this.configService.get<string>('AWS_REGION'),
			credentials: {
				accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
				secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
			},
			endpoint: this.endpoint,
			forcePathStyle: true,
		});
	}

	async uploadFile(
		path: string,
		file: Express.Multer.File
	): Promise<{ key: string; url: string }> {
		try {
			const params = {
				Bucket: this.bucket,
				Key: `${path}/${uuid()}-${file.originalname}`,
				Body: file.buffer,
				ContentType: file.mimetype,
			};

			await this.client.send(new PutObjectCommand(params));

			return {
				key: params.Key,
				url: this.getFileUrl(params.Key),
			};
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async deleteFile(url: string): Promise<void> {
		try {
			const params = {
				Bucket: this.bucket,
				Key: this.getKeyFromUrl(url),
			};

			await this.client.send(new DeleteObjectCommand(params));
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	getFileUrl(key: string): string {
		return `${this.endpoint}/${this.bucket}/${key}`;
	}

	getKeyFromUrl(url: string): string {
		return url.split(`${this.endpoint}/${this.bucket}/`)[1];
	}
}
