import AbstractEntity from '@libs/db/abstract.base.entity';
import { Entity, Column } from 'typeorm';
import { ArticleDto } from './dto';
import { MaterialType } from './material-mapper';

export declare type LinkArticle = Article & {
  order: number;
  type: MaterialType.ARTICLE;
};

@Entity('articles')
export default class Article extends AbstractEntity {
  @Column({ type: 'json', nullable: false })
  data?: ArticleDto[];

  @Column()
  duration: number;
}
