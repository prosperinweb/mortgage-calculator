"use client"

import { useState } from "react"
import { MortgageForm } from "@/components/mortgage-form"
import { ResultsCard } from "@/components/results-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { SliderToggle } from "@/components/slider-toggle"
import { Calculator, Info } from "lucide-react"
import { useSliderPreference } from "@/hooks/use-slider-preference"
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

  const { showSliders, toggleSliders, isLoaded } = useSliderPreference()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Mortgage Calculator
              </h1>
              <p className="text-muted-foreground text-sm">
                Calculate your monthly mortgage payments and total costs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoaded && <SliderToggle checked={showSliders} onCheckedChange={toggleSliders} />}
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">About this calculator</h4>
                  <p className="text-sm text-muted-foreground">
                    This calculator provides an estimate of your monthly mortgage payments.
                    The actual amount may vary based on your lender's specific terms.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-hover bg-card p-6 rounded-xl border shadow-sm">
            <MortgageForm
              showSliders={showSliders}
              onCalculate={(monthly, total, interest) =>
                setResults({
                  monthlyPayment: monthly,
                  totalPayment: total,
                  interestTotal: interest,
                })
              }
            />
          </div>

          {results && (
            <div className="animate-in">
              <ResultsCard
                monthlyPayment={results.monthlyPayment}
                totalPayment={results.totalPayment}
                interestTotal={results.interestTotal}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}