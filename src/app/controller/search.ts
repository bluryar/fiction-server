import { Context, controller, get, inject, plugin, provide } from 'midway';
import { ISearchBookResult } from '../../interface';
import { ExtendJoiRoot } from '../../interface/Extends';
import { BookService } from '../../service/book';

@provide()
@controller('/api/search')
export class SearchController {
  @inject()
  ctx: Context;

  @inject()
  bookService: BookService;

  @plugin()
  Joi: ExtendJoiRoot;

  @get()
  async query() {
    const { ctx, Joi } = this;
    const errors = ctx.validateJoi({
      query: {
        q: Joi.string()
          .max(100)
          .trim()
          .regex(/\s/, { invert: true, name: '字符中间不能有空格' })
          .required(),
        offset: Joi.number().min(0),
        limit: Joi.number().min(5).max(20), // 1次不能请求超过20本书
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }

    const { q, offset, limit } = ctx.request.query;
    const offsetNum = isNaN(parseInt(offset, 0)) ? 0 : parseInt(offset, 0);
    const limitNum = isNaN(parseInt(limit, 0)) ? 5 : parseInt(limit, 0);

    const res: ISearchBookResult = await this.bookService.searchBookNameAndAuthor(
      q,
      offsetNum,
      limitNum
    );

    ctx.body = res;
  }
}
