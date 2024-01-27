import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Monitor from './Monitor'
import Pollutant from './Pollutant'
import Station from './Station'

export default class Model extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public description:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationship
  @hasMany(()=>Monitor, {
    foreignKey: 'model_id'
  })
  public monitors:HasMany<typeof Monitor>

  @hasMany(()=>Station, {
    foreignKey: 'model_id'
  })
  public stations:HasMany<typeof Station>


  @manyToMany(()=> Pollutant,{
    pivotTable:'model_pollutants'
  })
  public pollutants: ManyToMany<typeof Pollutant>
}
