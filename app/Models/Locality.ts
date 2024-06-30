import { DateTime } from 'luxon'
import { BaseModel, column , hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Community from './Community'

export default class Locality extends BaseModel {
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
  @hasMany(()=>Community, {
    foreignKey: 'locality_id'
  })
  public communities:HasMany<typeof Community>
}
