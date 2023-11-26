import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { Base } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends Base {
  // Название списка подарков
  @Column()
  @Length(1, 250)
  name: string;

  // Описание подборки
  @Column({ default: null })
  @Length(0, 1500)
  description: string;

  // Обложка для подборки
  @Column()
  @IsUrl()
  image: string;

  // Ссылка на пользователя, который создал вишлист.
  @ManyToOne(() => User, (user) => user.wishlists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;

  // Набор ссылок на подарки.
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
