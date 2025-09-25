import { MigrationInterface, QueryRunner } from 'typeorm';

import { ns } from '../common/constants';

export class CreateSchema1561991000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createSchema(ns, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropSchema(ns);
    }
}
