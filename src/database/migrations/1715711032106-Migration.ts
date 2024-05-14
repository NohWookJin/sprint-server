import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715711032106 implements MigrationInterface {
    name = 'Migration1715711032106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analysis" ADD "dailyCounts" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analysis" DROP COLUMN "dailyCounts"`);
    }

}
