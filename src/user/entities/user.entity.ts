import { LoginHistory } from 'src/login-history/entities/login-history-entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column( {nullable: true})
    refreshToken?: string

    @OneToMany(() => LoginHistory, (loginHistories) => loginHistories.user)
    loginHistories: LoginHistory[];

    @CreateDateColumn()
    createdAt: Date 

    @UpdateDateColumn()
    updatedAt: Date 
}
