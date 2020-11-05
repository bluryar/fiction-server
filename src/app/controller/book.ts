import { Context, inject, controller, get, provide, plugin } from 'midway';
import { IBookDetail } from '../../interface';
import { ExtendJoiRoot } from '../../interface/Extends';
import { BookService } from '../../service/book';

@provide()
@controller('/api/book')
export class BookController {
  @inject()
  ctx: Context;

  @inject()
  bookService: BookService;

  @plugin()
  Joi: ExtendJoiRoot;

  @get('/:id')
  async detail() {
    const { ctx, Joi } = this;

    const errors = ctx.validateJoi({
      params: {
        id: Joi.number().min(0).required(),
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const { id } = ctx.params;
    const res: IBookDetail = await this.bookService.getBookById(
      parseInt(id, 0)
    );

    if (res === null) {
      ctx.status = 204;
      return;
    }
    ctx.body = res;
  }

  @get('/bookshelf')
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
    let { ids } = ctx.params;
    ids = ids.map((ele) => parseInt(ele, 0));

    const res = await this.bookService.getBooksByIds(ids);
    if (!res || res.length === 0) {
      ctx.status = 204;
      return;
    }
    ctx.status = 200;
  }
}
