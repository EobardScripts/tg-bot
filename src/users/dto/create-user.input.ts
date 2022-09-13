import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput{
    @Field()
    user_id: string;

    @Field()
    chat_id: string;
}