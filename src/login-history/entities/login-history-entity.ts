import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class LoginHistory extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, (user) => user.loginHistories, { onDelete: 'CASCADE' } )
    user: User;

    @Column()
    event: 'LOGIN' | 'LOGOUT' | 'REFRESH';

    @CreateDateColumn()
    timestamp: Date;
}