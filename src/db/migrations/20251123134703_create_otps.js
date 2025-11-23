export async function up(knex) {
    await knex.schema.createTable("otps", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("code").notNullable();
        table.timestamp("expires_at").notNullable();
        table.boolean("is_used").defaultTo(false);
        table.timestamps(true, true);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("otps");
}
