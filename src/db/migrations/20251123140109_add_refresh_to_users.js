export async function up(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.text("refresh_token")
    })
}

export async function down(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("refresh_token")
    })
}
