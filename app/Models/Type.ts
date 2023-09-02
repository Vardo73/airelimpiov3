import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Datum from './Datum'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //relationship
  @hasMany(()=>Datum, {
    foreignKey: 'type_id'
  })
  public datum:HasMany<typeof Datum>
}
