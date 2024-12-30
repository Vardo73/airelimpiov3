import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SiteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug:schema.string({},[
      rules.minLength(2),
      rules.maxLength(25)
    ]),
    name:schema.string({},[
      rules.minLength(2),
      rules.maxLength(25)
    ]),
    municipality:schema.string({},[
      rules.minLength(2),
      rules.maxLength(25)
    ]),
    longitude:schema.number(),
    latitude:schema.number(),
  })

  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el modelo.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)'
  }
}
