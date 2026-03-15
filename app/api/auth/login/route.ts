// POST /api/auth/login

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, updateLastLogin } from '@/lib/db'
import { signToken, getSessionCookieConfig } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    updateLastLogin(user.id)

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    })

    const cookieConfig = getSessionCookieConfig(token)
    res.cookies.set(cookieConfig)

    return res
  } catch (err) {
    console.error('[auth/login]', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
