import { ObjectType, Field, Int, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID!)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    user_id: string;

    @Field()
    @Column({unique: true})
    chat_id: string;
}