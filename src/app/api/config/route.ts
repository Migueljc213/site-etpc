import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Buscar configurações
export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany()
    
    // Converter array de configs em objeto
    const configObject: Record<string, string | number | boolean | object> = {}
    configs.forEach(config => {
      if (config.type === 'json') {
        configObject[config.key] = JSON.parse(config.value)
      } else if (config.type === 'boolean') {
        configObject[config.key] = config.value === 'true'
      } else if (config.type === 'number') {
        configObject[config.key] = parseFloat(config.value)
      } else {
        configObject[config.key] = config.value
      }
    })

    return NextResponse.json(configObject)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Salvar cada configuração
    for (const [key, value] of Object.entries(body)) {
      let type = 'string'
      let stringValue = String(value)

      if (typeof value === 'boolean') {
        type = 'boolean'
        stringValue = String(value)
      } else if (typeof value === 'number') {
        type = 'number'
        stringValue = String(value)
      } else if (typeof value === 'object') {
        type = 'json'
        stringValue = JSON.stringify(value)
      }

      await prisma.siteConfig.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    )
  }
}
