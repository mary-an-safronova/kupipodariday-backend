import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer';

@Entity()
export class Offer extends Base {
  // Сумма заявки
  @Column({
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @IsNumber()
  amount: number;

  // Флаг, который определяет показывать ли информацию о скидывающемся в списке
  @Column({ default: false })
  hidden: boolean;

  // Id желающего скинуться;
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // Ссылка на товар;
  @ManyToOne(() => Wish, (wish) => wish.offers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  item: Wish;
}
