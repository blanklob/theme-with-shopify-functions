import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  Target,
} from "../generated/api";
import isEven from "is-even";

type Configuration = {
  percentage: number
}

export default (input: InputQuery): FunctionResult => {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  )

  const targets: Target[] = input.cart.lines
    .filter((line) => isEven(line.quantity))
    .filter((line) => line.merchandise.__typename == "ProductVariant")
    .map((line) => (line.merchandise))
    .map((variant) => {
      return {
        productVariant: {
          id: variant.id
        }
      }
    })

    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets,
          value: {
            percentage: {
              value: configuration.percentage,
            }
          }
        }
      ]
    }
}