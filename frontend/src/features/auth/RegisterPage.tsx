import { SignUp } from '@clerk/clerk-react'
import { clerkAppearance } from './appearance'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp routing="hash" appearance={clerkAppearance} />
    </div>
  )
}
