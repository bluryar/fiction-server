import { EggContextLogger, logger, provide } from 'midway';
import { getRepository } from 'typeorm';
import { Chapter } from '../app/entity';
import { IChapterBrief, IChapterContent } from '../interface';

@provide()
export class ChapterService {
  @logger()
  logger: EggContextLogger;

  async getChapters(
    bookId: number,
    offset = 0,
    limit = 5
  ): Promise<IChapterBrief[]> {
    const chapterRep = getRepository(Chapter);

    const res = await chapterRep.find({
      select: ['id', 'index', 'title', 'updated_at'],
      where: { book: bookId },
      take: limit,
      skip: offset,
    });

    if (res.length === 0) {
      return null;
    }
    return res;
  }

  async getChapterContentByIndex(
    bookId: number,
    index: number
  ): Promise<IChapterContent> {
    const chapterRep = getRepository(Chapter);
    let findRes = await chapterRep.findOne({
      select: ['content', 'index', 'title'],
      where: { book: bookId, index },
    });

    if (!findRes) {
      return null;
    }

    findRes = Chapter.unzipChapterContent(findRes);
    return { ...findRes, ...{ content: findRes.content.toString() } };
  }
}
