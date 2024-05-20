import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716245131389 implements MigrationInterface {
    name = 'Migration1716245131389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "isDeleted"`);
    }

}
