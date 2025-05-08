import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/Offer.enity';
import { Wish } from '../wish/entities/Wish.entity';
import { OfferDto } from './dto/offer.dto';
import { User } from '../users/entities/User.entity';

@Injectable()
export class OfferService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}
  // Для каждого сервиса должны быть методы: create, findOne, updateOne, removeOne
  // Создание нового предложения скинуться (create)
  async create(offerDto: OfferDto, user: User): Promise<Offer> {
    const wish = await this.wishRepository.findOne({
      where: { id: offerDto.itemId },
      relations: { owner: true },
    });
    if (!wish) {
      throw new Error('Не найден предмет в желаниях');
    }
    if (wish.owner.id === user.id) {
      throw new Error('Вы не можете скинуться свой предмет');
    }
    const raised = +wish.raised + +offerDto.amount;
    if (raised > wish.price) {
      throw new Error(
        'Размер предложения скинуться превышает стоимость предмета',
      );
    }
    wish.raised = raised;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const contributionOffer = await queryRunner.manager.insert(Offer, {
        amount: offerDto.amount,
        hidden: offerDto.hidden,
        user,
        item: wish,
      });
      await queryRunner.manager.save(wish);
      await queryRunner.commitTransaction();
      return await this.findOne(contributionOffer.identifiers[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Ошибка сохранения предложения скинуться');
    } finally {
      await queryRunner.release();
    }
  }
  // Получение информации о предложении скинуться (findOne)
  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.wishes',
        'user.offers',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items',
      ],
    });
    if (!offer) {
      throw new Error('Такого предложения скинуться не существует');
    }
    delete offer.user.password;
    return offer;
  }
  // Получение списка предложений скинуться по предмету (findAll)
  async findAll() {
    const offers = await this.offerRepository.find({
      relations: [
        'user',
        'user.wishes',
        'user.offers',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items',
      ],
    });
    for (const n of Object.entries(offers)) {
      if (n[1].user.password) {
        delete n[1].user.password;
        n[1].user.wishlists.forEach((wl) => {
          delete wl.owner.password;
          delete wl.owner.email;
        });
      }
    }
    return offers;
  }
}
