"use client";

import { MortgageForm } from "@/components/mortgage-form";
import { ResultsCard } from "@/components/results-card";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
  } | null>(null);

  return (
    <main className="grid place-items-center min-h-screen p-4 md:p-12 lg:p-16 bg-slate-300">
      <div className="max-w-7xl rounded-3xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <MortgageForm
          onCalculate={(monthly, total) =>
            setResults({
              monthlyPayment: monthly,
              totalPayment: total,
            })
          }
        />
        <ResultsCard {...results} />
      </div>
    </main>
  );
}
