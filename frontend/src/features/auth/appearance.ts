/**
 * Clerk styling. Clerk needs real colour values, so they are read from the design
 * tokens in index.css at render time; no colours are defined here.
 */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function clerkAppearance() {
  return {
    variables: {
      colorPrimary: token('--color-vermiglione-scuro'),
      colorText: token('--color-nero'),
      colorTextSecondary: token('--color-grigio'),
      colorBackground: token('--color-white'),
      colorInputBackground: token('--color-white'),
      colorInputText: token('--color-nero'),
      borderRadius: '0.625rem',
      fontFamily: "'Archivo Variable', system-ui, sans-serif",
    },
    elements: {
      card: 'shadow-none border border-border rounded-lg',
      headerTitle: 'font-display text-2xl text-foreground',
      headerSubtitle: 'text-muted-foreground',
      socialButtonsBlockButton: 'border-border hover:bg-vuoto rounded-lg',
      formButtonPrimary: 'bg-primary hover:bg-primary/90 rounded-lg font-bold',
      formFieldInput: 'border-border focus:border-cobalto focus:ring-cobalto rounded-lg',
      footerActionLink: 'text-cobalto hover:underline font-bold',
    },
  };
}
