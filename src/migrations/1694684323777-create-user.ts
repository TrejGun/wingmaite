import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { ns } from '../common/constants';

export class CreateUser1694684323777 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: `${ns}.user`,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    default: 'uuid_generate_v4()',
                    isPrimary: true,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
            ],
        });

        await queryRunner.createTable(table, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(`${ns}.user`);
    }
}
