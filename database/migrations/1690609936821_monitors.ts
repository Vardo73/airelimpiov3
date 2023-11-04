import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'monitors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('slug').unsigned().unique().notNullable();
      table.integer('model_id').unsigned().references('models.id').onDelete('CASCADE')
      table.integer('neighborhood_id').unsigned().references('neighborhoods.id').onDelete('CASCADE')
      table.string('name',25).notNullable()
      table.string('apikey',50).unique()
      table.float('longitude',10,7)
      table.float('latitude',10,7)
      table.boolean('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
