'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import * as z from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js/min'
import { Check } from 'lucide-react'
import { MultiStepForm } from '@/components/bahrawy/multi-step-form'
import type { MultiStepFormStep } from '@/components/bahrawy/multi-step-form'
import { PhoneInput } from '@/components/bahrawy/phone-input'
import { Input } from '@/components/ui/input'
import { CodeBlock } from '@/components/showcase/code-block'
import {
  DemoCard,
  DocsPage,
  DocsSection,
} from '@/components/showcase/docs-page'

type FormData = {
  name: string
  email: string
  phone: string
  password: string
  confirm: string
}

const accountSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
})
const contactSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone is required')
    .refine((v) => isValidPhoneNumber(v), 'Enter a valid phone number'),
})
const passwordSchema = z
  .object({
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string().min(1, 'Please confirm'),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords must match',
  })

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  )
}

function AccountStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>()
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Jane Doe"
          {...register('name')}
        />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register('email')}
        />
      </Field>
    </div>
  )
}

function ContactStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>()
  const phone = watch('phone')
  return (
    <div className="max-w-sm">
      <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <PhoneInput
          value={phone}
          onChange={(v) => setValue('phone', v ?? '', { shouldValidate: false })}
          defaultCountry="US"
          error={!!errors.phone}
          placeholder="Phone number"
        />
      </Field>
    </div>
  )
}

function PasswordStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>()
  return (
    <div className="grid max-w-md gap-5">
      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register('password')}
        />
      </Field>
      <Field
        label="Confirm password"
        htmlFor="confirm"
        error={errors.confirm?.message}
      >
        <Input
          id="confirm"
          type="password"
          placeholder="********"
          {...register('confirm')}
        />
      </Field>
    </div>
  )
}

const STEPS: MultiStepFormStep[] = [
  {
    title: 'Account',
    description: 'Who you are',
    schema: accountSchema,
    component: AccountStep,
  },
  {
    title: 'Contact',
    description: 'How to reach you',
    schema: contactSchema,
    component: ContactStep,
  },
  {
    title: 'Security',
    description: 'Pick a password',
    schema: passwordSchema,
    component: PasswordStep,
  },
]

const SNIPPET = `import { MultiStepForm } from '@/components/bahrawy'
import * as z from 'zod'

const steps = [
  {
    title: 'Account',
    schema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
    }),
    component: AccountStep, // uses useFormContext() inside
  },
  // ...more steps
]

<MultiStepForm
  steps={steps}
  submitLabel="Create account"
  onComplete={async (data) => {
    await createAccount(data)
  }}
/>`

export default function MultiStepFormDocs() {
  const [submitted, setSubmitted] = useState<FormData | null>(null)

  return (
    <DocsPage
      category="30 · form"
      title="Multi-step form"
      slug="multi-step-form"
      description="A wizard built on React Hook Form with per-step Zod validation. Slides between steps with Framer Motion and persists field values when navigating back."
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[460px] items-start">
          <div className="w-full">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Form submitted
                </h3>
                <pre className="max-w-full overflow-auto rounded-lg border border-white/10 bg-black/50 p-4 text-left text-xs text-white/80">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="text-xs text-white/60 underline-offset-2 hover:text-white hover:underline"
                >
                  Reset and try again
                </button>
              </div>
            ) : (
              <MultiStepForm<FormData>
                steps={STEPS}
                submitLabel="Create account"
                onComplete={async (data) => {
                  await new Promise((r) => setTimeout(r, 500))
                  setSubmitted(data)
                }}
                defaultValues={{
                  name: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirm: '',
                }}
              />
            )}
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['react-hook-form', 'zod', '@hookform/resolvers'].map((d) => (
            <code
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80"
            >
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
