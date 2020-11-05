import { provide, scope, ScopeEnum } from 'midway';
import { Connection, getConnection } from 'typeorm';

@scope(ScopeEnum.Singleton)
@provide('DBC')
export class DBConnector {
  public mysql: Connection;

  public constructor() {
    this.mysql = getConnection();
    if (!this.mysql.isConnected) { throw new Error('[typeorm] 数据库未连接'); }
  }
}
