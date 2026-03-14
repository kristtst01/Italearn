import { SignIn } from '@clerk/clerk-react'
import { clerkAppearance } from './appearance'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn routing="hash" appearance={clerkAppearance} />
    </div>
  )
}
