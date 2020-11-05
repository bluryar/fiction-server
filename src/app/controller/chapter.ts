import { Context, inject, controller, get, provide, plugin } from 'midway';
import { IChapterBrief, IChapterContent } from '../../interface';
import { ExtendJoiRoot } from '../../interface/Extends';
import { ChapterService } from '../../service/chapter';

@provide()
@controller('/api/chapter')
export class ChapterController {
  @inject()
  ctx: Context;

  @inject()
  chapterService: ChapterService;

  @plugin()
  Joi: ExtendJoiRoot;

  @get('/')
  async index() {
    const { ctx, Joi } = this;

    const errors = ctx.validateJoi({
      query: {
        book_id: Joi.number().min(0).required(),
        offset: Joi.number().min(0),
        limit: Joi.number().min(5).max(20),
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const { limit, offset, book_id } = ctx.request.query;

    const res: IChapterBrief[] = await this.chapterService.getChapters(
      parseInt(book_id, 0),
      isNaN(parseInt(offset, 0)) ? 0 : parseInt(offset, 0),
      isNaN(parseInt(limit, 0)) ? 5 : parseInt(limit, 0)
    );

    if (!res) {
      ctx.status = 204;
      return;
    }
    ctx.status = 200;
    ctx.body = res;
  }

  @get('/:index')
  async content() {
    const { ctx, Joi } = this;

    const errors = ctx.validateJoi({
      query: {
        book_id: Joi.number().min(0).required(),
      },
      params: {
        index: Joi.number().min(0).required(),
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const { book_id } = ctx.request.query;
    const { index } = ctx.params;

    const res: IChapterContent = await this.chapterService.getChapterContentByIndex(
      parseInt(book_id, 0),
      parseInt(index, 0)
    );
    if (!res) {
      ctx.status = 204;
      return;
    }

    ctx.status = 200;
    ctx.body = res;
  }
}
