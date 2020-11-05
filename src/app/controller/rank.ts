import { Context, controller, get, inject, plugin, provide } from 'midway';
import { IRankListResult } from '../../interface';
import { ExtendJoiRoot } from '../../interface/Extends';
import { BookService } from '../../service/book';

@provide()
@controller('/api/rank')
export class RankController {
  @inject()
  ctx: Context;

  @inject()
  bookService: BookService;

  @plugin()
  Joi: ExtendJoiRoot;

  /**
   * 获取类型及其映射id值
   */
  @get('/types')
  async getRankTypeMap() {
    this.ctx.body = BookService.bookTypeMap;
  }

  @get('/types/exists') 
  async getExistsType(){
    const res = await this.bookService.getExistsRank()
    this.ctx.body = res
  }
  
  @get('/:type_id')
  async getRankList() {
    const errors = this.ctx.validateJoi({
      params: {
        type_id: this.Joi.number().min(0).max(13).required(),
      },
      query: {
        offset: this.Joi.number().min(0),
        limit: this.Joi.number().min(5).max(20),
      },
    });
    if (errors) {
      this.ctx.status = 400;
      this.ctx.body = errors;
      return;
    }

    const type_id = parseInt(this.ctx.params['type_id'], 0);
    const offset = isNaN(parseInt(this.ctx.query['offset'], 0))
      ? 0
      : parseInt(this.ctx.query['offset'], 0);
    const limit = isNaN(parseInt(this.ctx.query['limit'], 0))
      ? 5
      : parseInt(this.ctx.query['limit'], 0);

    const res: IRankListResult[] = await this.bookService.getRankList(
      type_id,
      offset,
      limit
    );

    this.ctx.body = res;
  }
}
