"use client";

import { CustomTooltipProvider } from "@/components/ui/custom-tooltip-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateMortgage } from "@/lib/mortgage-calculator";
import { mortgageSchema, type MortgageInput } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Info } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MortgageFormProps {
  onCalculate: (monthly: number, total: number, interest: number) => void;
}

type FieldConfig = {
  name: keyof MortgageInput;
  label: string;
  tooltip: string;
  inputConfig: {
    prefix?: string;
    suffix?: string;
    min: number;
    max: number;
    step: number;
    className?: string;
  };
};

const FormFieldWithTooltip = ({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <FormLabel className="text-base md:text-lg text-neutral-700">
      {label}
    </FormLabel>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="w-[200px] md:w-[250px]">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </div>
);

const FIELD_CONFIG: FieldConfig[] = [
  {
    name: "amount",
    label: "Mortgage Amount",
    tooltip: "Enter the total amount you wish to borrow for your mortgage",
    inputConfig: {
      prefix: "£",
      min: 1000,
      max: 1000000,
      step: 1000,
    },
  },
  {
    name: "years",
    label: "Mortgage Term",
    tooltip: "The duration of your mortgage in years",
    inputConfig: {
      suffix: "years",
      min: 5,
      max: 35,
      step: 1,
    },
  },
  {
    name: "interestRate",
    label: "Interest Rate",
    tooltip: "The annual interest rate for your mortgage",
    inputConfig: {
      suffix: "%",
      min: 0.1,
      max: 15,
      step: 0.01,
    },
  },
];

export function MortgageForm({ onCalculate }: MortgageFormProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const previousValuesRef = useRef<MortgageInput | null>(null);

  const form = useForm<MortgageInput>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      amount: 300000,
      years: 25,
      interestRate: 5.25,
      type: "repayment",
    },
  });

  const onSubmit = (data: MortgageInput) => {
    // Check if values have changed
    if (
      previousValuesRef.current &&
      JSON.stringify(previousValuesRef.current) === JSON.stringify(data)
    ) {
      return; // Skip calculation if values haven't changed
    }

    setIsCalculating(true);
    try {
      const { monthlyPayment, totalPayment, interestTotal } = calculateMortgage(
        data.amount,
        data.interestRate,
        data.years,
        data.type
      );
      onCalculate(monthlyPayment, totalPayment, interestTotal);
      previousValuesRef.current = data; // Store the new values
      toast.success("Calculation complete!", {
        description: "Your mortgage details have been calculated successfully.",
      });
    } catch (error) {
      console.error(`Mortgage calculation failed: ${error}`);
      toast.error("Calculation failed", {
        description:
          "An error occurred while calculating your mortgage details.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    form.reset({
      amount: 0,
      years: 0,
      interestRate: 0,
      type: "repayment", // Keep default type
    });
    previousValuesRef.current = null;
    // Clear the last calculation by calling onCalculate with zeros
    onCalculate(0, 0, 0);
    toast.info("Form cleared", {
      description: "All values have been reset to zero.",
    });
  };

  const renderNumberInput = (
    field: { onChange: (value: number) => void; value: number },
    config: {
      prefix?: string;
      suffix?: string;
      min: number;
      max: number;
      step: number;
      className?: string;
    }
  ) => (
    <div className="flex rounded relative overflow-hidden">
      {config.prefix && (
        <span className="absolute grid place-items-center left-0 h-full bg-blue-100 px-3 self-center">
          {config.prefix}
        </span>
      )}
      <Input
        type="number"
        className={cn(
          config.prefix && "pl-12",
          config.suffix && "pr-16",
          config.className
        )}
        {...field}
        // Convert 0 to empty string for display
        value={field.value === 0 ? "" : field.value}
        onChange={(e) => {
          const value = e.target.value === "" ? 0 : e.target.valueAsNumber;
          if (isNaN(value)) {
            field.onChange(0);
          } else {
            field.onChange(value);
          }
        }}
        min={config.min}
        max={config.max}
        step={config.step}
      />
      {config.suffix && (
        <span className="absolute grid place-items-center right-0 h-full bg-blue-100 px-3">
          {config.suffix}
        </span>
      )}
    </div>
  );

  const renderField = (config: FieldConfig) => (
    <FormField
      key={config.name}
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormFieldWithTooltip label={config.label} tooltip={config.tooltip}>
            {null}
          </FormFieldWithTooltip>
          <FormControl>
            {config.name !== "type" &&
              renderNumberInput(
                field as { onChange: (value: number) => void; value: number },
                config.inputConfig
              )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <CustomTooltipProvider>
      <Form {...form}>
        <div className="space-y-6 bg-card p-6">
          <div className="flex justify-between">
            <h1 className="card-heading">Mortgage Calculator</h1>
            <Button
              className="underline text-neutral-500 hover:text-neutral-800 transition-colors duration-200"
              type="button"
              variant="link"
              onClick={resetForm}
            >
              Clear All
            </Button>
          </div>

          <div className="">
            {renderField(FIELD_CONFIG[0])}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIELD_CONFIG.slice(1).map(renderField)}
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-base md:text-lg">
                    Mortgage Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormItem
                            className="cursor-pointer"
                            onClick={() => field.onChange("repayment")}
                          >
                            <FormControl>
                              <div
                                className={cn(
                                  "flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-primary/5",
                                  field.value === "repayment" &&
                                    "border-primary bg-primary/5"
                                )}
                              >
                                <RadioGroupItem value="repayment" />
                                <FormLabel className="font-normal cursor-pointer m-0">
                                  Repayment
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] md:w-[250px]">
                            Pay off the loan and interest over time
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormItem
                            className="cursor-pointer"
                            onClick={() => field.onChange("interest-only")}
                          >
                            <FormControl>
                              <div
                                className={cn(
                                  "flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-primary/5",
                                  field.value === "interest-only" &&
                                    "border-primary bg-primary/5"
                                )}
                              >
                                <RadioGroupItem value="interest-only" />
                                <FormLabel className="font-normal cursor-pointer m-0">
                                  Interest Only
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] md:w-[250px]">
                            Only pay the interest, loan amount due at end of
                            term
                          </p>
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
              className="w-[120px] md:w-[140px]"
              disabled={isCalculating}
              onClick={form.handleSubmit(onSubmit)}
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
        </div>
      </Form>
    </CustomTooltipProvider>
  );
}
