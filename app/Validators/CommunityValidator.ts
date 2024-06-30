import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommunityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    locality_id:schema.number(),
    name:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    population:schema.string({},[
      rules.minLength(1),
      rules.maxLength(25)
    ]),
    municipality:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    photos_link: schema.string([
      rules.url()
    ]),
    electrical_network:schema.number(),
    longitude:schema.number(),
    latitude:schema.number()
  })

  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el modelo.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)'
  }
}
