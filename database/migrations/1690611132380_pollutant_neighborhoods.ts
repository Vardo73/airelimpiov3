import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pollutant_neighborhoods'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('pollutant_id').unsigned().references('pollutants.id').onDelete('CASCADE')
      table.integer('neighborhood_id').unsigned().references('neighborhoods.id').onDelete('CASCADE')
      table.unique(['pollutant_id','neighborhood_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
