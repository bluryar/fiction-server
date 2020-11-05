import { Context, inject, controller, get, provide, plugin } from "midway";
import { IIndexBookResult } from "../../interface";
import { ExtendJoiRoot } from "../../interface/Extends";
import { BookService } from "../../service/book";

@provide()
@controller("/api/index")
export class HomeController {
  @inject()
  ctx: Context;

  @inject()
  bookService: BookService;

  @plugin()
  Joi: ExtendJoiRoot;

  @get()
  async index() {
    const { ctx, Joi } = this;

    const errors = ctx.validateJoi({
      query: {
        offset: Joi.number().min(0),
        limit: Joi.number().min(5).max(20),
      },
    });
    if (errors) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const { limit, offset } = ctx.request.query;

    const res: IIndexBookResult[] = await this.bookService.getRecommendBooks(
      !isNaN(parseInt(limit, 0)) ? parseInt(limit, 0) : 5,
      !isNaN(parseInt(offset, 0)) ? parseInt(offset, 0) : 0
    );

    ctx.body = res;
  }
}
