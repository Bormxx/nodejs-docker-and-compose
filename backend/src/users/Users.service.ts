import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Like, Not, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // Для каждого сервиса должны быть методы: create, findOne, updateOne, removeOne
  // Создание пользователя (create)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    // Проверка на наличие пользователя с таким email или username в базе данных
    const checkUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (checkUser) {
      // Если такой пользователь существует, то выбрасываем ошибку
      throw new Error(
        `Пользователь с таким email или username уже существует!`,
      );
    }
    // Если такого пользователя нет, то создаем нового пользователя в базе данных
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }
  // Получение пользователя по id (findOne)
  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }
  // Получение пользователя по username или по email (findOneByUsernameOrEmail)
  async findOneByUsernameOrEmail(
    username?: string,
    email?: string,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }
  // Ищем пользователя по имени пользователя (findUserByUsername)
  async findUserForLogin(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('Пользователь не найден!');
    }
    return user;
  }
  // Ищем пользователя по имени пользователя (findUserByUsername)
  async findMe(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('Пользователь не найден!');
    }
    delete user.password;
    return user;
  }
  // Ищем пользователя по имени пользователя (findUserByUsername)
  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new Error('Пользователь не найден!');
    }
    // Удаляем почту и пароль и возвращаем объект пользователя
    delete user.email;
    delete user.password;
    return user;
  }
  // Обновление пользователя по id (updateOne)
  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username } = updateUserDto;
    const checkUser = await this.userRepository.findOne({
      where: [
        { email, id: Not(id) },
        { username, id: Not(id) },
      ],
    });
    if (checkUser) {
      throw new Error(
        `Пользователь с таким email или username уже существует!`,
      );
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }
  // // Удаление пользователя по id (removeOne)
  // async removeOne(id: number): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
  // Получение всех пользователей (findAll)
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  // Получение пользователей по запросам (findAllByQuery)
  async findAllByQuery(query: string) {
    const array = await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
    array.forEach((item) => {
      delete item.password;
    });
    return array;
  }
}
