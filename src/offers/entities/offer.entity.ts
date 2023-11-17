import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends Base {
  //  Сумма заявки
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amount: number;

  // Флаг, который определяет показывать ли информацию о скидывающемся в списке
  @Column({ default: false })
  hidden: boolean;

  // Id желающего скинуться;
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // Ссылка на товар;
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
