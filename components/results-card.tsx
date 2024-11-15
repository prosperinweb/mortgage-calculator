import { useCountUp } from "@/hooks/use-count-up";
import { ThemeToggle } from "./theme-toggle";

interface ResultsCardProps {
  monthlyPayment?: number;
  totalPayment?: number;
}

export function ResultsCard({
  monthlyPayment = 0,
  totalPayment = 0,
}: ResultsCardProps) {
  const animatedMonthly = useCountUp(monthlyPayment, 500);
  const animatedTotal = useCountUp(totalPayment, 500);

  return (
    <div className="bg-green-100 space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="card-heading">Your Results</h1>
        <ThemeToggle />
      </div>
      <div className="space-y-8 p-6">
        <p>
          Your results are shown below based on the informaton you provided. To
          adjust the results, edit the form and click &quot;calculate
          repayments&quot; again.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your monthly repayment
            </p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-primary slide-in">
                £
                {animatedMonthly.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <span className="text-sm text-muted-foreground mb-1">
                per month
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Total you&apos;ll repay over the term
            </p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-primary/90 slide-in">
                £
                {animatedTotal.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <span className="text-sm text-muted-foreground mb-0.5">
                total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
