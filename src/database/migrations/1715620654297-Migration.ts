import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715620654297 implements MigrationInterface {
    name = 'Migration1715620654297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "leftCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" ADD "leftCount" integer NOT NULL`);
    }

}
