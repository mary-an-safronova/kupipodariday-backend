import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import { Base } from 'src/entities/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User extends Base {
  // Имя пользователя
  @Column({ unique: true })
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  // Информация о пользователе
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  // Ссылка на аватар
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  // Почта пользователя
  @Column({ unique: true })
  @IsEmail()
  email: string;

  // Пароль пользователя
  @Column({ select: false })
  password: string;

  // Список желаемых подарков пользователя.
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // Список подарков, на которые скидывается пользователь.
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // Список вишлистов, которые создал пользователь.
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];
}
