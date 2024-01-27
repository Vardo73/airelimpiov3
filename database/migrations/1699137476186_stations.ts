import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug',10).unique().notNullable();
      table.integer('model_id').unsigned().references('models.id').onDelete('CASCADE');
      table.string('name',50)
      table.float('longitude',10,7)
      table.float('latitude',10,7)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
