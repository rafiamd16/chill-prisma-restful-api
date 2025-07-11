import { ResponseError } from '../error/response-error.js'

export const requestValidate = (schema, data) => {
  const result = schema.safeParse(data)

  if (result.error) {
    throw new ResponseError(400, result.error.issues[0].message)
  } else {
    return result.data
  }
}
