import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716274458917 implements MigrationInterface {
    name = 'Migration1716274458917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "badges" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "level" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "badges"`);
    }

}
