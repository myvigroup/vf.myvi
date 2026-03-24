import { getBrand } from '@/lib/branding'
import { LoginForm } from './login-form'

export default async function LoginPage() {
  const brand = await getBrand()

  return (
    <LoginForm
      logo={brand.logo}
      name={brand.name}
      primary={brand.primary}
      loginBg={brand.loginBg}
      headline={brand.loginHeadline}
      subtext={brand.loginSubtext}
      features={brand.loginFeatures}
      label={brand.loginLabel}
    />
  )
}
