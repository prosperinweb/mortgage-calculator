"use client"

import { useState } from "react"
import { MortgageForm } from "@/components/mortgage-form"
import { ResultsCard } from "@/components/results-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Calculator, Info } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function Home() {
  const [results, setResults] = useState<{
    monthlyPayment: number
    totalPayment: number
    interestTotal: number
  } | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Mortgage Calculator
              </h1>
              <p className="text-muted-foreground text-lg md:text-lg">
                Calculate your monthly mortgage payments and total costs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button 
                   className="p-2 hover:bg-secondary rounded-full transition-colors"
                   aria-label="About this calculator"
                   title="About this calculator"
                   type="button"
                   >
                  <Info className="h-5 w-5 text-muted-foreground" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">About this calculator</h4>
                  <p className="text-sm text-muted-foreground">
                    This calculator provides an estimate of your monthly mortgage payments.
                    The actual amount may vary based on your lender&apos;s specific terms.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MortgageForm
            onCalculate={(monthly, total, interest) =>
              setResults({
                monthlyPayment: monthly,
                totalPayment: total,
                interestTotal: interest,
              })
            }
          />
          {results && <ResultsCard {...results} />}
        </div>
      </div>
    </main>
  )
}