import * as z from "zod"

export const mortgageSchema = z.object({
  amount: z.number()
    .min(1000, "Minimum amount is £1,000")
    .max(10000000, "Maximum amount is £10,000,000")
    .transform(val => Math.round(val * 100) / 100),
  years: z.number()
    .min(5, "Minimum term is 5 years")
    .max(35, "Maximum term is 35 years")
    .transform(val => Math.round(val)),
  interestRate: z.number()
    .min(0.1, "Minimum rate is 0.1%")
    .max(15, "Maximum rate is 15%")
    .transform(val => Math.round(val * 100) / 100),
  type: z.enum(["repayment", "interest-only"])
})

export type MortgageInput = z.infer<typeof mortgageSchema>