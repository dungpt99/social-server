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
<<<<<<< HEAD
=======
  ssl: { rejectUnauthorized: false }
>>>>>>> 4c593b10e0e07854926e64bc5b7e22dfb199c91f
};
