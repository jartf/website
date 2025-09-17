import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/motion-provider"
import { I18nProvider } from "@/components/i18n-provider"

export default function StargazeLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MotionProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
