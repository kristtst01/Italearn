import { SignIn } from '@clerk/clerk-react'
import { Logo, Shapes } from '@/shared/components/design'
import { clerkAppearance } from './appearance'

/** Sign-in for signed-out visitors. Clerk's form also handles sign-up. */
export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden">
      <Shapes
        shapes={[
          { kind: 'half', color: 'ocra', size: 360, position: { left: -60, bottom: -80 } },
          { kind: 'circle', color: 'vermiglione', size: 280, position: { right: -80, top: -80 } },
          { kind: 'circle', color: 'cobalto', size: 160, position: { right: -40, bottom: -60 } },
        ]}
      />
      <Logo large />
      <SignIn routing="hash" appearance={clerkAppearance()} />
    </div>
  )
}
