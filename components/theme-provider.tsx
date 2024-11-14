import { ThemeProvider as NextThemeProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: 'class' | 'data-theme'
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}