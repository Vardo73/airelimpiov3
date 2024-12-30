import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Site from './Site'

export default class SkyDatum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public site_id: number

  @column()
  public weather_conditions: string

  @column()
  public temperature: number

  @column()
  public humidity: number

  @column()
  public visibility: number

  @column()
  public zenith_visual_magnitude: number

  @column()
  public zenith_equatorial_angular_distance: number

  @column()
  public north_visual_magnitude: number

  @column()
  public east_visual_magnitude: number

  @column()
  public south_visual_magnitude: number

  @column()
  public west_visual_magnitude: number

  @column()
  public observers: string

  @column()
  public bortle_scale: number

  @column()
  public sqm_l_number: number

  @column()
  public altitude: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @belongsTo(()=> Site,{
    foreignKey: 'site_id',
  })
  public site: BelongsTo<typeof Site>

}
