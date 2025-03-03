import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilteringOptionsDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	username?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	email?: string;
}
