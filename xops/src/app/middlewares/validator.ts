import { Response, Request, NextFunction } from "express"
import { validate, ValidationError } from "class-validator"
import { plainToClass, ClassConstructor } from "class-transformer"
import { baseLogger } from "../../utils/logger"
const logger = baseLogger.child({ name: "OpsBackend:Middleware:Validator" })

function getChildrenErrors(children: ValidationError[]): unknown {
  return children?.flatMap((childError) => {
    if (childError.children?.length) {
      return getChildrenErrors(childError.children)
    }
    return [childError.constraints]
  })
}

export function extractErrors(errors: ValidationError[]) {
  // eslint-disable-next-line
  let errorTexts: any = []
  for (const errorItem of errors) {
    const childErrors = getChildrenErrors(errorItem.children || [])
    // add errors from the main root level
    if (errorItem.constraints) {
      errorTexts = errorTexts.concat(errorItem.constraints)
    }
    // add errors from nested objects
    if (childErrors) {
      errorTexts = errorTexts.concat(childErrors)
    }
  }
  return errorTexts
}

//eslint-disable-next-line
const validator = (dtoClass: ClassConstructor<any>) => {
  return function (req: Request, res: Response, next: NextFunction) {
    //eslint-disable-next-line
    const output: any = plainToClass(dtoClass, req.body);

    validate(output, { skipMissingProperties: false }).then((errors) => {
      // errors is an array of validation errors to be sent back
      if (errors.length > 0) {
        logger.error(
          errors,
          `Middleware Validate error <dtoClass: ${dtoClass.name}>`
        )

        const errorTexts = extractErrors(errors)

        res.status(400).send(errorTexts)
        return
      } else {
        next()
      }
    })
  }
}
export default validator
