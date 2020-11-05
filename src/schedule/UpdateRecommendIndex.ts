import { CommonSchedule, inject, provide, schedule } from 'midway';
import { BookService } from '../service/book';

@provide()
@schedule({
  type: 'all',
  cron: '0 0 1 * * ?', // 每天凌晨点进行更新
})
export class UpdateRecommendIndex implements CommonSchedule {
  @inject('bookService')
  service: BookService;

  /**
   * 定时更新书本推荐顺序
   */
  async exec() {
    await this.service.updateRecommendIndex();
  }
}
