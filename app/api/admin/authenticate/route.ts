import { NextRequest, NextResponse } from 'next/server'
import { setAdminSession } from '@/lib/auth'

// Admin access token (should match NEXT_PUBLIC_ADMIN_ACCESS_TOKEN in env)
const REQUIRED_ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN || 'admin_access_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

export async function POST(request: NextRequest) {
  try {
    const { adminToken } = await request.json()
    
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token required' }, { status: 400 })
    }
    
    if (adminToken !== REQUIRED_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid admin token' }, { status: 401 })
    }
    
    // Admin token is valid - set session
    await setAdminSession()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

