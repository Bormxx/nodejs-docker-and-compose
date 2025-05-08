import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/Wishlist.entity';
import { Wish } from '../wish/entities/Wish.entity';
import { UpdateWishlistDTO, WishlistDTO } from './dto/Wishlist.dto';
import { User } from '../users/entities/User.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  // Для каждого сервиса должны быть методы: create, findOne, updateOne, removeOne
  // Создание списка желаний (create)
  async create(wishlistDTO: WishlistDTO, user: User): Promise<Wishlist> {
    const items = await this.wishRepository.find({
      where: {
        id: In(wishlistDTO.itemsId),
        owner: { id: user.id },
      },
    });
    if (items.length !== wishlistDTO.itemsId.length) {
      throw new Error('Некоторые из желаний не принадлежат пользователю');
    }
    const wishlist = this.wishlistRepository.create({
      owner: user,
      name: wishlistDTO.name,
      image: wishlistDTO.image,
      items,
    });
    await this.wishlistRepository.save(wishlist);
    return wishlist;
  }
  // Получение списка желаний по идентификатору (findOne)
  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new Error('Такого списка желаний не существует');
    }
    return wishlist;
  }
  // Получение списков желаний пользователя (findAll)
  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }
  // Редактирование списка желаний (updateOne)
  async updateOne(
    id: number,
    updateWishlistDTO: UpdateWishlistDTO,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new Error('Такого списка желаний не существует');
    }
    if (wishlist.owner.id !== user.id) {
      throw new Error('Вы не являетесь владельцем этого списка');
    }
    const items = updateWishlistDTO.itemsId?.length
      ? await this.wishRepository.find({
          where: {
            id: In(updateWishlistDTO.itemsId),
          },
        })
      : [];
    return await this.wishlistRepository.save({
      ...wishlist,
      name: updateWishlistDTO.name,
      image: updateWishlistDTO.image,
      items: items.length === 0 ? wishlist.items : items,
    });
  }
  // Удаление списка желаний (removeOne)
  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wishlist) {
      throw new Error('Такого списка желаний не существует');
    }
    if (wishlist.owner.id !== user.id) {
      throw new Error('Вы не являетесь владельцем этого списка');
    }
    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
