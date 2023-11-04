import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ailment_pollutants'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('pollutant_id').unsigned().references('pollutants.id').onDelete('CASCADE')
      table.integer('ailment_id').unsigned().references('ailments.id').onDelete('CASCADE')
      table.unique(['pollutant_id','ailment_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
