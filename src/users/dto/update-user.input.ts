import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "./create-user.input";


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field(() => ID!)
    id: number;

    @Field(() => String, { nullable: true })
    user_id: string;

    @Field(() => String, { nullable: true })
    chat_id: string;
}