import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ailment_clinics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ailment_id').unsigned().references('ailments.id').onDelete('CASCADE')
      table.integer('clinic_id').unsigned().references('clinics.id').onDelete('CASCADE')
      table.unique(['ailment_id','clinic_id','year'])
      table.integer('year',4).unsigned();
      table.integer('total',4).unsigned();
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
