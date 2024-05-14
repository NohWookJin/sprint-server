import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715623006202 implements MigrationInterface {
    name = 'Migration1715623006202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_c45924a1b42b6620e435e677cb5"`);
        await queryRunner.query(`ALTER TABLE "routine" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_c45924a1b42b6620e435e677cb5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_c45924a1b42b6620e435e677cb5"`);
        await queryRunner.query(`ALTER TABLE "routine" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_c45924a1b42b6620e435e677cb5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
