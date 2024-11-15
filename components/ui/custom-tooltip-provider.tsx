
import { TooltipProvider } from "@radix-ui/react-tooltip";

export function CustomTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      {children}
    </TooltipProvider>
  );
}