import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715140524316 implements MigrationInterface {
    name = 'Migration1715140524316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "past" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "routineId" integer, CONSTRAINT "PK_05792e09c1408cdcf36d9a76389" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "routineType" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analysis" ("id" SERIAL NOT NULL, "average" integer NOT NULL, "startWith" TIMESTAMP NOT NULL, "continuity" integer NOT NULL, "routineId" integer, CONSTRAINT "REL_2c793bbaca7c687de8aec8a3fd" UNIQUE ("routineId"), CONSTRAINT "PK_300795d51c57ef52911ed65851f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "routine" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "past" ADD CONSTRAINT "FK_4e143d5c9b356bb00eeaa267cf7" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analysis" ADD CONSTRAINT "FK_2c793bbaca7c687de8aec8a3fda" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_98d2895affafeaea7ceefb64e19" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_98d2895affafeaea7ceefb64e19"`);
        await queryRunner.query(`ALTER TABLE "analysis" DROP CONSTRAINT "FK_2c793bbaca7c687de8aec8a3fda"`);
        await queryRunner.query(`ALTER TABLE "past" DROP CONSTRAINT "FK_4e143d5c9b356bb00eeaa267cf7"`);
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "analysis"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "past"`);
    }

}
