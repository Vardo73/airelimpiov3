import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sky_data'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('site_id').unsigned().references('sites.id').onDelete('CASCADE');
      table.string('weather_conditions',128);
      table.float('temperature',10,5);
      table.float('humidity',10,5);
      table.integer('visibility',10);
      table.float('zenith_visual_magnitude',10,5);
      table.float('zenith_equatorial_angular_distance',10,5);
      table.float('north_visual_magnitude',10,5);
      table.float('east_visual_magnitude',10,5);
      table.float('south_visual_magnitude',10,5);
      table.float('west_visual_magnitude',10,5);
      table.string('observers',128);
      table.integer('bortle_scale',10);
      table.integer('sqm_l_number',10);
      table.float('altitude',10,5);
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
