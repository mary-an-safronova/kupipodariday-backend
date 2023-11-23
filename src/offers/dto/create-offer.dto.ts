import { IsNotEmpty, IsBoolean, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
