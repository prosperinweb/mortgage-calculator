import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useCountUp } from "@/hooks/use-count-up"
import { ArrowUpRight, ArrowDownRight, Banknote } from "lucide-react"

export function ResultsCard({
  monthlyPayment,
  totalPayment,
  interestTotal,
}: {
  monthlyPayment: number
  totalPayment: number
  interestTotal: number
}) {
  const [progress, setProgress] = useState(0)
  const principal = totalPayment - interestTotal
  const interestPercentage = (interestTotal / totalPayment) * 100

  const animatedMonthly = useCountUp(monthlyPayment)
  const animatedTotal = useCountUp(totalPayment)
  const animatedPrincipal = useCountUp(principal)
  const animatedInterest = useCountUp(interestTotal)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="bg-primary/5 dark:bg-primary/10 overflow-hidden">
      <CardHeader className="border-b bg-card">
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" />
          Your Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Monthly Repayment
            </p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-primary slide-in">
                £{animatedMonthly.toLocaleString('en-GB', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
              <span className="text-sm text-muted-foreground mb-1">per month</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Total Repayment
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-primary/90 slide-in">
                £{animatedTotal.toLocaleString('en-GB', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
              <span className="text-sm text-muted-foreground mb-0.5">total</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Principal</span>
              </div>
              <span className="font-medium">
                £{animatedPrincipal.toLocaleString('en-GB', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Total Interest</span>
              </div>
              <span className="font-medium">
                £{animatedInterest.toLocaleString('en-GB', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
            <Progress 
              value={interestPercentage} 
              className="h-2 bg-primary/20"
            />
            <p className="text-xs text-muted-foreground text-right">
              {interestPercentage.toFixed(1)}% of total payment
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-secondary/50 p-4 text-sm">
          <p className="text-muted-foreground">
            This is an estimate based on the information you provided. Actual payments
            may vary depending on your lender's terms and conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}