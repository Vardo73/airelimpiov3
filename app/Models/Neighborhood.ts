import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Pollutant from './Pollutant'
import Station from './Station'

export default class Neighborhood extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public city:string

  @column()
  public longitude:number

  @column()
  public latitude:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  
  //relationship
  @hasMany(()=>Station)
  public stations:HasMany<typeof Station>

  @manyToMany(()=> Pollutant,{
    pivotTable:'pollutant_neighborhoods'
  })
  public pollutants: ManyToMany<typeof Pollutant>
}
