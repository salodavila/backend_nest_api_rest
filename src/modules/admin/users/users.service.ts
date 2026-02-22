import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>
    ){

  }

  async create(createUserDto: CreateUserDto) {
    const { rolesIds, email, username, ...rest} = createUserDto;

    //Verificar si ya existe el username
    const existeUsername = await this.userRepository.findOne({
      where: {username}
    });

    if(existeUsername){
      throw new BadRequestException(`El username "${username}" ya está en uso.`)
    }

    //Verificar si ya existe el email
    const existeEmail = await this.userRepository.findOne({
      where: {email}
    });
    
    if(existeEmail){
      throw new BadRequestException(`El email "${email}" ya está en uso.`)
    }

    //let roles: Role[] = []

    //Encriptar
    const hashPassword = await bcrypt.hash(rest.password, 12);
    
    //Nuevo usuario
    const newUser =  this.userRepository.create({
      username,
      email,
      password: hashPassword
      //roles
    });

    //Guardar
    this.userRepository.save(newUser);

    const {password, ... resto_datos} = newUser;

    return resto_datos;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string):Promise<User> {
    const user = await this.userRepository.findOneBy({id});

    if(!user){
      throw new NotFoundException(`El User con ID ${id} no se encuentra en la BD`);
    }

    return user;
  }

  async findOneByEmail(email: string):Promise<User> {
    const user = await this.userRepository.findOneBy({email});

    if(!user){
      throw new NotFoundException(`El User con email ${email} no se encuentra en la BD`);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    
    const user = await this.findOne(id);
    const {rolesIds, ...resto} = updateUserDto;

    Object.assign(user, resto);

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);

    if(result.affected === 0){
      throw new NotFoundException('User con ID '+ id + ' no encontrado.');
    }
  }
}
