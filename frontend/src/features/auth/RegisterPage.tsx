import { SignUp } from '@clerk/clerk-react'
import { clerkAppearance } from './appearance'

export default function RegisterPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden">
      <div aria-hidden className="absolute -bottom-20 -left-15 -z-10 h-45 w-90 rounded-t-full bg-ocra" />
      <div aria-hidden className="absolute -top-20 -right-20 -z-10 size-70 rounded-full bg-vermiglione" />
      <div aria-hidden className="absolute -right-10 -bottom-15 -z-10 size-40 rounded-full bg-cobalto" />
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex items-end">
          <span className="size-7 rounded-full bg-vermiglione" />
          <span className="-ml-2 h-3.5 w-7 rounded-t-full bg-ocra" />
        </span>
        <span className="font-display text-3xl">ItaLearn</span>
      </div>
      <SignUp routing="hash" appearance={clerkAppearance()} />
    </div>
  )
}
