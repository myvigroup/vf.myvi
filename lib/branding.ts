import { headers } from 'next/headers'

export interface Brand {
  key: 'valuefactory' | 'mitnorm'
  name: string
  logo: string
  logoHeight: number
  primary: string
  primaryDark: string
  primaryLight: string
  loginBg: string
  loginHeadline: string
  loginSubtext: string
  loginFeatures: string[]
  loginLabel: string
}

const BRANDS: Record<string, Brand> = {
  valuefactory: {
    key: 'valuefactory',
    name: 'Value Factory',
    logo: '/logo.png',
    logoHeight: 28,
    primary: '#1BA5B5',
    primaryDark: '#148D9B',
    primaryLight: '#E6F7F8',
    loginBg: '#111520',
    loginHeadline: 'Kontakte vergolden.\nDeals verfolgen.',
    loginSubtext: 'Gib deine Firmenkontakte ins MYVI Netzwerk weiter und verfolge jeden Deal in Echtzeit.',
    loginFeatures: [
      'Firmenkontakte einfach ins MYVI Netzwerk weitergeben',
      'Jeden Deal-Status in Echtzeit verfolgen',
      'Direkte Kommunikation mit dem Firmenberater',
    ],
    loginLabel: 'BERATER LOGIN',
  },
  mitnorm: {
    key: 'mitnorm',
    name: 'mitNORM',
    logo: '/logo-myvi.png',
    logoHeight: 28,
    primary: '#0B3D6B',
    primaryDark: '#082D4F',
    primaryLight: '#E8EFF6',
    loginBg: '#0a1628',
    loginHeadline: 'Deine Deals.\nImmer im Blick.',
    loginSubtext: 'Das Berater-Dashboard für mitNORM Firmenkontakte — powered by MYVI Dialog.',
    loginFeatures: [
      'Alle eingereichten Deals auf einen Blick',
      'Status-Updates in Echtzeit',
      'Direkte Kommunikation mit dem Firmenberater',
    ],
    loginLabel: 'BERATER LOGIN',
  },
}

export async function getBrand(): Promise<Brand> {
  const h = await headers()
  const host = h.get('host') ?? ''

  if (host.includes('dialoge.myvi.de') || host.includes('mitnorm')) {
    return BRANDS.mitnorm
  }

  return BRANDS.valuefactory
}

/** Client-side brand detection (for 'use client' components) */
export function getBrandFromHost(host: string): Brand {
  if (host.includes('dialoge.myvi.de') || host.includes('mitnorm')) {
    return BRANDS.mitnorm
  }
  return BRANDS.valuefactory
}
