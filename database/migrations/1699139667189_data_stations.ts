import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'data_stations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('station_id').unsigned().references('stations.id').onDelete('CASCADE')
      table.float('solarRadiation',10,2)
      table.float('uv',10,2)
      table.float('winddir',10,2)
      table.float('humidity',10,2)
      table.float('temp',10,2)
      table.float('dewpt',10,2)
      table.float('windSpeed',10,2)
      table.float('windGust',10,2)
      table.float('pressure',10,2)
      table.float('precipRate',10,2)
      table.float('precipTotal',10,2)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
