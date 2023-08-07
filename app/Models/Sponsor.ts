import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Station from './Station'


export default class Sponsor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string 

  @column()
  public logo:string 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(()=> Station,{
    pivotTable:'sponsor_stations'
  })
  public stations: ManyToMany<typeof Station>
}
