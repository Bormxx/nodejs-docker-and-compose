import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/Wish.entity';
import { WishDTO } from './dto/Wish.dto';
import { User } from '../users/entities/User.entity';

@Injectable()
export class WishService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  // Для каждого сервиса должны быть методы: create, findOne, updateOne, removeOne
  // Создание желания (create)
  async create(wishDTO: WishDTO, owner: User): Promise<Wish> {
    const newWish = this.wishRepository.create({
      ...wishDTO,
      owner: { id: owner.id },
    });
    return await this.wishRepository.save(newWish);
  }
  // Получение желания по идентификатору (findOne)
  async findOne(id: number): Promise<Wish | undefined> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }
  // Получение всех желаний (findAll)
  async findAll(): Promise<Wish[]> {
    const wish = await this.wishRepository.find();
    wish.forEach((wl) => {
      delete wl.id;
      delete wl.raised;
      delete wl.copied;
      delete wl.createdAt;
      delete wl.updatedAt;
    });
    return wish;
  }
  // Изменение желания (updateOne)
  async updateOne(id: number, wishDTO: WishDTO, user: User): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user.id) {
      throw new Error('Вы не можете изменять чужие желания');
    }
    await this.wishRepository.update(id, wishDTO);
    return await this.wishRepository.findOne({ where: { id } });
  }
  // Удаление желания (removeOne)
  async removeOne(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user.id) {
      throw new Error('Вы не можете удалить это желание');
    }
    await this.wishRepository.delete(id);
    return wish;
  }
  // Получение желаний пользователя (findMyWishes)
  async findUserWishes(user: User) {
    const wish = await this.wishRepository.find({
      where: { owner: { id: user.id } },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
    });
    for (const n of Object.entries(wish)) {
      if (n[1].owner.password) {
        delete n[1].owner.password;
        delete n[1].owner.email;
        n[1].offers.forEach((wl) => {
          delete wl.user.password;
          wl.user.wishlists.forEach((wl) => {
            delete wl.owner.password;
            delete wl.owner.email;
          });
        });
      }
    }
    return wish;
  }
  // Копирование желания созданного другим пользователем (copyWish)
  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new Error('Желание не найдено');
    }
    const wishData: WishDTO = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newWish = await queryRunner.manager.insert(Wish, {
        ...wishData,
        owner: user,
        offers: [],
      });
      wish.copied += 1;
      await queryRunner.manager.save(wish);
      await queryRunner.commitTransaction();
      return await this.findOne(newWish.identifiers[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  // Найти последние 10 желаний (findLatestWishes)
  findLatestWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
  }
  // Найти топ 10 желаний (findTopWishes)
  findTopWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }
}
