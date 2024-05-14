import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715673496107 implements MigrationInterface {
    name = 'Migration1715673496107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_98d2895affafeaea7ceefb64e19"`);
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "categoryId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_98d2895affafeaea7ceefb64e19" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
