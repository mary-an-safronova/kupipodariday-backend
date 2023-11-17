import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends Base {
  //  Сумма заявки
  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
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
