import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionPivotTable1771442207062 implements MigrationInterface {
    name = 'CreatePermissionPivotTable1771442207062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "subject" character varying NOT NULL, "visibleInMenu" boolean NOT NULL DEFAULT true, "label" character varying, "route" character varying, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_2cbc1fbbb2f66d5558b9658eea4" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df46160e6aa79943b83c81e496" ON "role" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96c8f1fd25538d3692024115b4" ON "role" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_df46160e6aa79943b83c81e496e" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_96c8f1fd25538d3692024115b47" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_96c8f1fd25538d3692024115b47"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_df46160e6aa79943b83c81e496e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96c8f1fd25538d3692024115b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df46160e6aa79943b83c81e496"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
