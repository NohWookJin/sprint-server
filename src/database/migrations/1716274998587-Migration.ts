import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716274998587 implements MigrationInterface {
    name = 'Migration1716274998587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "level" character varying NOT NULL DEFAULT 'lv1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "level" integer NOT NULL DEFAULT '1'`);
    }

}
