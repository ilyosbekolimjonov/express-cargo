export async function up(knex) {
    await knex.schema.createTable("client_addresses", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid("client_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.string("title").notNullable();
        table.string("country").notNullable();
        table.string("city").notNullable();
        table.string("province");
        table.string("street");
        table.string("zip_code");

        table.boolean("is_default").notNullable().defaultTo(false);

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("client_addresses");
}
