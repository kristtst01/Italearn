import type { Appearance } from '@clerk/types'

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#2563eb',       // blue-600
    colorText: '#111827',          // gray-900
    colorTextSecondary: '#6b7280', // gray-500
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#111827',
    borderRadius: '0.625rem',      // matches --radius
    fontFamily: "'Geist Variable', sans-serif",
  },
  elements: {
    card: 'shadow-lg border border-gray-200 rounded-xl',
    headerTitle: 'text-2xl font-bold text-gray-900',
    headerSubtitle: 'text-gray-500',
    socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50 rounded-lg',
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold',
    formFieldInput: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg',
    footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
  },
}
