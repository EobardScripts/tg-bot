import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async create(user: CreateUserInput): Promise<User> {
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id:  number): Promise<User> {
        return await this.userRepository.findOne({where: {id: id}});
    }

    async update(user: UpdateUserInput): Promise<User> {
        const updated = await this.userRepository.save(user);
        return await this.findOne(user.id);
    }

    async remove(id: number): Promise<User> {
        const user = await this.findOne(id);
        console.log("user for remove: " + user);
        const deleted = await this.userRepository.delete(user);
        return user;
    }
}