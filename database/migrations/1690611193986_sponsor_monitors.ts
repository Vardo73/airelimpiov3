import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sponsor_monitors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sponsor_id').unsigned().references('sponsors.id').onDelete('CASCADE')
      table.integer('monitor_id').unsigned().references('monitors.id').onDelete('CASCADE')
      table.unique(['sponsor_id','monitor_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
