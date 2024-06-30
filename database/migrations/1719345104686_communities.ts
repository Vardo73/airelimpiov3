import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'communities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('locality_id').unsigned().references('localities.id').onDelete('CASCADE');
      table.string('name',25).notNullable();
      table.string('population',25).notNullable();
      table.string('municipality',50).notNullable();
      table.string('photos_link',255).notNullable();
      table.boolean('electrical_network');
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
