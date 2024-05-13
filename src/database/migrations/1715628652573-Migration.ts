import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715628652573 implements MigrationInterface {
    name = 'Migration1715628652573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "date"`);
    }

}
