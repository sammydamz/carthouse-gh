import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export interface AdminUser {
  id: string
  email: string
  name: string
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'carthouse-gh-secret-key-change-in-production')

export async function createToken(admin: AdminUser) {
  return new SignJWT({ admin })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return (payload as any).admin as AdminUser
  } catch {
    return null
  }
}

export async function getAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin()
  if (!admin) throw new Error('Unauthorized')
  return admin
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}