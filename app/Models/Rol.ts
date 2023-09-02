import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Rol extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //relationship
  @hasMany(()=>User, {
    foreignKey: 'rol_id'
  })
  public users:HasMany<typeof User>
}
