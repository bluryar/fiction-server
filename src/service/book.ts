import { EggContextLogger, logger, provide } from 'midway';
import { getRepository, Like, MoreThan } from 'typeorm';
import { Book, Chapter, TYPE } from '../app/entity';
import {
  IBookDetail,
  IIndexBookResult,
  IRankListResult,
  ISearchBookResult,
} from '../interface';

@provide('bookService')
export class BookService {
  @logger()
  logger: EggContextLogger;

  static bookTypeMap = [
    { type_id: 0, type_name: '全部分类' },
    { type_id: 1, type_name: TYPE.未分类 },
    { type_id: 2, type_name: TYPE.玄幻 },
    { type_id: 3, type_name: TYPE.奇幻 },
    { type_id: 4, type_name: TYPE.修真 },
    { type_id: 5, type_name: TYPE.仙侠 },
    { type_id: 6, type_name: TYPE.都市 },
    { type_id: 7, type_name: TYPE.青春 },
    { type_id: 8, type_name: TYPE.历史 },
    { type_id: 9, type_name: TYPE.穿越 },
    { type_id: 10, type_name: TYPE.网游 },
    { type_id: 11, type_name: TYPE.竞技 },
    { type_id: 12, type_name: TYPE.科幻 },
    { type_id: 13, type_name: TYPE.灵异 },
  ];

  static getBookType(id: number) {
    for (const typeObj of BookService.bookTypeMap) {
      if (id === typeObj.type_id) {
        return typeObj;
      }
    }
  }

  /**
   * 随机更新数据库中所有Book实体的推荐序号
   * @returns 返回被更新的书本数
   */
  public async updateRecommendIndex(): Promise<number> {
    // 获取book.id
    const rep = getRepository(Book);
    const bookLength = await rep.count({ select: ['id'] });
    const zeroIndex = await rep.count({ where: { recommendIndex: 0 } });
    const updateSql = () =>
      zeroIndex === bookLength
        ? 'book.id'
        : `((recommendIndex + 17) % ${bookLength})+1`;

    try {
      const res = await rep
        .createQueryBuilder()
        .update(Book)
        .set({ recommendIndex: updateSql })
        .execute();
      this.logger.info('[typeorm] 更新书本推荐顺序');
      return res.affected;
    } catch (error) {
      this.logger.info('[typeorm] 更新推荐顺序失败');
      this.logger.info(error);
      throw error;
    }
  }

  public async getRecommendBooks(
    limit = 5,
    offset = 0
  ): Promise<IIndexBookResult[]> {
    const bookRepository = getRepository(Book);

    const zeroCount = await bookRepository.count({ recommendIndex: 0 }); // 如果所有推荐顺序等于零，则返回前N个即可
    const allCount = await bookRepository.count();
    let res: IIndexBookResult[];
    if (zeroCount === allCount) {
      res = await bookRepository.find({
        select: ['id', 'author', 'title', 'summary', 'coverImgLink'],
        skip: offset,
        take: limit,
      });
    } else {
      res = await bookRepository.find({
        select: ['id', 'author', 'title', 'summary', 'coverImgLink'],
        where: { recommendIndex: MoreThan(offset) },
        order: { recommendIndex: 'ASC' },
        take: limit,
      });
    }
    return res;
  }

  /**
   * 搜索作者
   */
  private async searchAuthor(
    q: string,
    offset = 0,
    limit = 5
  ): Promise<IIndexBookResult[] | null> {
    const bookRepository = getRepository(Book);

    const res: IIndexBookResult[] = await bookRepository.find({
      select: ['id', 'author', 'title', 'summary', 'coverImgLink'],
      where: {
        author: Like(`%${q}%`),
      },
      take: limit,
      skip: offset,
    });
    if (res.length === 0) {
      return null;
    }
    return res;
  }

  /**
   * 搜索书名
   */
  private async searchBookName(
    q: string,
    offset = 0,
    limit = 5
  ): Promise<IIndexBookResult[] | null> {
    const bookRepository = getRepository(Book);

    const res: IIndexBookResult[] = await bookRepository.find({
      select: ['id', 'author', 'title', 'summary', 'coverImgLink'],
      where: {
        title: Like(`%${q}%`),
      },
      take: limit,
      skip: offset,
    });
    if (res.length === 0) {
      return null;
    }
    return res;
  }

  public async searchBookNameAndAuthor(
    q: string,
    offset = 0,
    limit = 5
  ): Promise<ISearchBookResult> {
    const title: IIndexBookResult[] = await this.searchBookName(
      q,
      offset,
      limit
    );
    const author: IIndexBookResult[] = await this.searchAuthor(
      q,
      offset,
      limit
    );
    return {
      title,
      author,
    };
  }

  public async getExistsRank(){
    const bookRepository = getRepository(Book);
    let res = await bookRepository.createQueryBuilder().groupBy("type").select("type").execute()
    return res
  }
  
  public async getRankList(
    typeId: number,
    offset = 0,
    limit = 5
  ): Promise<IRankListResult[]> {
    const bookRepository = getRepository(Book);

    const typeObj = BookService.getBookType(typeId);
    let res: IRankListResult[];
    if (typeId === 0) {
      res = await bookRepository.find({
        select: ['id', 'author', 'title', 'summary', 'coverImgLink', 'type'],
        take: limit,
        skip: offset,
      });
    } else {
      res = await bookRepository.find({
        select: ['id', 'author', 'title', 'summary', 'coverImgLink', 'type'],
        where: { type: typeObj.type_name },
        take: limit,
        skip: offset,
      });
    }
    return res;
  }

  public async getBookById(id: number): Promise<IBookDetail | null> {
    const bookRepository = getRepository(Book);
    const chapterRepository = getRepository(Chapter);

    const book: Book = await bookRepository.findOne({
      select: [
        'id',
        'click',
        'title',
        'author',
        'coverImgLink',
        'summary',
        'finish',
        'type',
        'updated_at',
      ],
      where: { id },
    });
    if (!book) {
      return null;
    }

    const chaptersNum = await chapterRepository.count({
      where: {
        book,
      },
    });

    return {
      ...book,
      chaptersNum,
    };
  }

  public async getBooksByIds(ids: number[]): Promise<IIndexBookResult[]> {
    const bookRepository = getRepository(Book);

    const res = await bookRepository.findByIds(ids, {
      select: ['id', 'title', 'author', 'coverImgLink', 'summary'],
    });
    return res;
  }
}
