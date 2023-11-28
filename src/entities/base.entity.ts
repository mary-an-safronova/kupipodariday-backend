import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  // Уникальный id
  @PrimaryGeneratedColumn()
  id: number;

  // Дата создания
  @CreateDateColumn()
  createdAt: Date;

  // Дата изменения
  @UpdateDateColumn()
  updatedAt: Date;
}
