export async function up(knex) {
    await knex.schema.createTable("orders", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))

        table.uuid("client_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")

        table.string("product_link").notNullable()
        table.integer("quantity").notNullable()

        table.decimal("current_price", 12, 2).notNullable()

        table.enu("currency_type", ["UZS", "USD", "EUR"], {
            useNative: true,
            enumName: "currency_enum",
        }).notNullable()

        table.string("truck")
        table.enu("status", ["accepted", "in_progres", "delivered"], {
            useNative: true,
            enumName: "order_status_enum",
        }).notNullable().defaultTo("accepted")

        table.text("description")

        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("orders")
    await knex.raw('DROP TYPE IF EXISTS "currency_enum"')
    await knex.raw('DROP TYPE IF EXISTS "order_status_enum"')
}
