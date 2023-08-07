import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Station from './Station'
import Pollutant from './Pollutant'

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
  @hasMany(()=>Station)
  public stations:HasMany<typeof Station>


  @manyToMany(()=> Pollutant,{
    pivotTable:'model_pollutants'
  })
  public pollutans: ManyToMany<typeof Pollutant>
}
