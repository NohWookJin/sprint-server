import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715628107363 implements MigrationInterface {
    name = 'Migration1715628107363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "content" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "content" character varying NOT NULL`);
    }

}
