import { Context, inject, controller, get, provide, plugin } from 'midway';
import { ExtendJoiRoot } from '../../interface/Extends';
import { BookService } from '../../service/book';

@provide()
@controller('/api/bookshelf')
export class BookShelfController {
  @inject()
  ctx: Context;

  @inject()
  bookService: BookService;

  @plugin()
  Joi: ExtendJoiRoot;

  @get('/books')
  async getBookshelfBook() {
    const { ctx, Joi } = this;

    const errors = ctx.validateJoi({
      body: {
        ids: Joi.array().items(Joi.number().min(0)).required(),
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const { ids } = ctx.request.body;

    const res = await this.bookService.getBooksByIds(ids);
    if (!res || res.length === 0) {
      ctx.status = 204;
      return;
    }
    ctx.status = 200;
    ctx.body = res;
  }
}
