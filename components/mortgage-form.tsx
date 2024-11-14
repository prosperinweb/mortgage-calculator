"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { calculateMortgage } from "@/lib/mortgage-calculator"
import { mortgageSchema, type MortgageInput } from "@/lib/schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Info, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface MortgageFormProps {
  onCalculate: (monthly: number, total: number, interest: number) => void
}

export function MortgageForm({ onCalculate }: MortgageFormProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const form = useForm<MortgageInput>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      amount: 300000,
      years: 25,
      interestRate: 5.25,
      type: "repayment"
    }
  })

  function onSubmit(data: MortgageInput) {
    setIsCalculating(true)
    try {
      const { monthlyPayment, totalPayment, interestTotal } = calculateMortgage(
        data.amount,
        data.interestRate,
        data.years,
        data.type
      )
      onCalculate(monthlyPayment, totalPayment, interestTotal)
      toast.success("Calculation complete!", {
        description: "Your mortgage details have been calculated successfully."
      })
    } catch (error) {
      console.error(`Mortgage calculation failed: ${error}`)
      toast.error("Calculation failed", {
        description: "An error occurred while calculating your mortgage details."
      })
    } finally {
      setIsCalculating(false)
    }
  }

  function resetForm() {
    form.reset()
    toast.info("Form reset", {
      description: "All values have been reset to defaults."
    })
  }

  const renderNumberInput = (
    field: { onChange: (value: number) => void},
    config: {
      prefix?: string
      suffix?: string
      min: number
      max: number
      step: number
      className?: string
    }
  ) => (
    <div className="relative">
      {config.prefix && (
        <span className="absolute left-3 top-2.5 text-muted-foreground">{config.prefix}</span>
      )}
      <Input
        type="number"
        className={cn(
          "input-animation",
          config.prefix && "pl-6",
          config.suffix && "pr-16",
          config.className
        )}
        {...field}
        onChange={e => {
          const value = e.target.valueAsNumber
          if (isNaN(value)) {
            field.onChange(0)
          } else {
            field.onChange(value)
          }
        }}
        min={config.min}
        max={config.max}
        step={config.step}
      />
      {config.suffix && (
        <span className="absolute right-3 top-2.5 text-muted-foreground">
          {config.suffix}
        </span>
      )}
    </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border shadow-sm">
        <div className="space-y-4 md:space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base md:text-lg">Loan Amount</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] md:w-[250px]">Enter the total amount you wish to borrow for your mortgage</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  {renderNumberInput(field, {
                    prefix: "£",
                    min: 1000,
                    max: 1000000,
                    step: 1000
                  })}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base md:text-lg">Mortgage Term</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] md:w-[250px]">The duration of your mortgage in years</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    {renderNumberInput(field, {
                      suffix: "years",
                      min: 5,
                      max: 35,
                      step: 1
                    })}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base md:text-lg">Interest Rate</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] md:w-[250px]">The annual interest rate for your mortgage</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    {renderNumberInput(field, {
                      suffix: "%",
                      min: 0.1,
                      max: 15,
                      step: 0.01
                    })}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base md:text-lg">Mortgage Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormItem>
                          <FormControl>
                            <div className={cn(
                              "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-primary/5",
                              field.value === "repayment" && "border-primary bg-primary/5"
                            )}>
                              <RadioGroupItem value="repayment" />
                              <FormLabel className="font-normal cursor-pointer">
                                Repayment
                              </FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] md:w-[250px]">Pay off the loan and interest over time</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormItem>
                          <FormControl>
                            <div className={cn(
                              "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-primary/5",
                              field.value === "interest-only" && "border-primary bg-primary/5"
                            )}>
                              <RadioGroupItem value="interest-only" />
                              <FormLabel className="font-normal cursor-pointer">
                                Interest Only
                              </FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] md:w-[250px]">Only pay the interest, loan amount due at end of term</p>
                      </TooltipContent>
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between pt-6 md:pt-8">
          <Button
            type="button"
            variant="outline"
            className="w-[120px] md:w-[140px]"
            onClick={resetForm}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            type="submit"
            className="w-[120px] md:w-[140px]"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>Calculating...</>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}