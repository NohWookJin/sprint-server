import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716177119033 implements MigrationInterface {
    name = 'Migration1716177119033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "imagePath" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "imagePath"`);
    }

}
