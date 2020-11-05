import 'reflect-metadata';
import { Boot, IBoot } from 'midway';
import { Connection, createConnection } from 'typeorm';

export default class AppBootHook extends Boot implements IBoot {
  public mysql: Connection;

  public async willReady() {
    // 连接数据库
    this.mysql = await createConnection(this.config.typeorm);
    this.app.logger.info(
      `[typerom] 数据库已经连接. isConnected: ${this.mysql.isConnected} => database: ${this.mysql.options.database}`
    );
  }

  public async beforeClose() {
    // 关闭数据库
    await this.mysql.close();
    this.app.logger.info(
      `[typerom] 数据库连接已关闭. isConnected:${this.mysql.isConnected} => database: ${this.mysql.options.database}`
    );
  }
}
