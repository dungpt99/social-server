import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../configs.constants";

export const typeOrmConfig: TypeOrmModule = {
  host: databaseConfig.host,
  type: databaseConfig.type,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [`${__dirname}/../../**/*.entity.{js,ts}`],
  synchronize: true,
  ssl: { rejectUnauthorized: false }
};
