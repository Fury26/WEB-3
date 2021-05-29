import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    port: 5432,
    database: 'nestpostapp',
    username: 'postgres',
    password: '1928sfsf',
    host: 'localhost',
    //synchronize: true,
    
    entities: ["dist/**/*.entity{.ts,.js}"],
};