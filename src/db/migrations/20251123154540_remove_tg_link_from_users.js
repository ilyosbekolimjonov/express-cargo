export async function up(knex) {
    await knex.schema.table("users", (table) => {
        table.dropColumn("tg_link")
    })
}

export async function down(knex) {
    await knex.schema.table("users", (table) => {
        table.string("tg_link").nullable()
    })
}
