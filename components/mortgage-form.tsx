"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Percent, PoundSterling, Calendar, RefreshCw, Info } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mortgageSchema, type MortgageInput } from "@/lib/schema"
import { calculateMortgage } from "@/lib/mortgage-calculator"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

interface MortgageFormProps {
  onCalculate: (monthly: number, total: number, interest: number) => void
  showSliders: boolean
}

export function MortgageForm({ onCalculate, showSliders }: MortgageFormProps) {
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
      toast.error("Error calculating mortgage payments", {
        description: "Please check your inputs and try again."
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
    field: any,
    config: {
      prefix?: string
      suffix?: string
      min: number
      max: number
      step: number
      className?: string
    }
  ) => (
    <div className="space-y-4">
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
            const value = parseFloat(e.target.value)
            field.onChange(value)
            form.trigger(field.name)
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
      {showSliders && (
        <Slider
          min={config.min}
          max={config.max}
          step={config.step}
          value={[field.value]}
          onValueChange={([value]) => {
            field.onChange(value)
            form.trigger(field.name)
          }}
          className="py-4"
        />
      )}
    </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <PoundSterling className="h-4 w-4 text-muted-foreground" />
                Mortgage Amount
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The total amount you wish to borrow for your mortgage
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
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
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Mortgage Term
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The duration of your mortgage in years
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
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
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  Interest Rate
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The annual interest rate for your mortgage
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  {renderNumberInput(field, {
                    suffix: "%",
                    min: 0.1,
                    max: 15,
                    step: 0.1
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
            <FormItem>
              <FormLabel>Mortgage Type</FormLabel>
              <FormDescription>
                Choose between repayment or interest-only mortgage
              </FormDescription>
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
                      Pay off the loan and interest over time
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
                      Only pay the interest, loan amount due at end of term
                    </TooltipContent>
                  </Tooltip>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isCalculating}
            className="flex-1 transition-all hover:scale-[1.02] relative overflow-hidden"
          >
            <span className={cn(
              "inline-flex items-center transition-opacity",
              isCalculating ? "opacity-0" : "opacity-100"
            )}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Repayments
            </span>
            {isCalculating && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              </span>
            )}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
                className="transition-all hover:scale-[1.02]"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Reset to defaults
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </Form>
  )
}