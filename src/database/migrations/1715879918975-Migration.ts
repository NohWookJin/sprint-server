import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715879918975 implements MigrationInterface {
    name = 'Migration1715879918975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "completed" boolean NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "routineId" integer, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "routineId" integer, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analysis" ("id" SERIAL NOT NULL, "average" integer NOT NULL, "startWith" TIMESTAMP NOT NULL, "continuity" integer NOT NULL, "dailyCounts" text NOT NULL, "routineId" integer, CONSTRAINT "REL_2c793bbaca7c687de8aec8a3fd" UNIQUE ("routineId"), CONSTRAINT "PK_300795d51c57ef52911ed65851f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "routine" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "routineType" character varying NOT NULL, "targetCount" integer NOT NULL, "colorSelection" character varying NOT NULL, CONSTRAINT "PK_5f1178fd54059b2f9479d6141ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_9d46466ff91c038c24dffe6239c" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_864052121f5e6398291c9f91a0f" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analysis" ADD CONSTRAINT "FK_2c793bbaca7c687de8aec8a3fda" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_c45924a1b42b6620e435e677cb5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_c45924a1b42b6620e435e677cb5"`);
        await queryRunner.query(`ALTER TABLE "analysis" DROP CONSTRAINT "FK_2c793bbaca7c687de8aec8a3fda"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_864052121f5e6398291c9f91a0f"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_9d46466ff91c038c24dffe6239c"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "routine"`);
        await queryRunner.query(`DROP TABLE "analysis"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
