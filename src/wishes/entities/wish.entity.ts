import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl, IsInt, Min } from 'class-validator';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { ColumnNumericTransformer } from 'src/utils/column-numeric-transformer';

@Entity()
export class Wish extends Base {
  // Название подарка
  @Column()
  @Length(1, 250)
  name: string;

  // Ссылка на интернет-магазин, в котором можно приобрести подарок
  @Column()
  @IsUrl()
  link: string;

  // Ссылка на изображение подарка
  @Column()
  @IsUrl()
  image: string;

  // Стоимость подарка
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @Min(1)
  price: number;

  // Сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок
  @Column({
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  raised: number;

  // Ссылка на пользователя, который добавил пожелание подарка.
  @ManyToOne(() => User, (user) => user.wishes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;

  // Описание подарка
  @Column()
  @Length(1, 1024)
  description: string;

  // Массив ссылок на заявки скинуться от других пользователей.
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // Счётчик тех, кто скопировал подарок себе
  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
