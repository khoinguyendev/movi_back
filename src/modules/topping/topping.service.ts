import { Injectable } from '@nestjs/common';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from 'src/entities/Topping';
import { Repository } from 'typeorm';

@Injectable()
export class ToppingService {
  constructor(
    @InjectRepository(Topping)
    private toppingRepository: Repository<Topping>,
  ) {}
  create(createToppingDto: CreateToppingDto) {
    const { image, name, price, description } = createToppingDto;
    const toppingRecord = this.toppingRepository.create({
      image,
      name,
      price,
      description,
    });
    return this.toppingRepository.save(toppingRecord);
  }

  findAll() {
    return this.toppingRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} topping`;
  }

  update(id: number, updateToppingDto: UpdateToppingDto) {
    return `This action updates a #${id} topping`;
  }

  remove(id: number) {
    return this.toppingRepository.delete(id);
  }
}
