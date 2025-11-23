export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"))

        table.string("full_name").notNullable()
        table.string("email").notNullable().unique()
        table.string("password").notNullable()
        table.string("phone_number")
        table.string("tg_link")

        table.enu("role", ["admin", "client", "supplier"], {
            useNative: true,
            enumName: "user_role_enum",
        }).notNullable().defaultTo("client")

        table.boolean("is_active").notNullable().defaultTo(true)

        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("users")
    await knex.raw('DROP TYPE IF EXISTS "user_role_enum"')
}
