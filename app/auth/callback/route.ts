import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Successful email verification
        return NextResponse.redirect(new URL(`${next}?verified=true`, requestUrl.origin))
      } else {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL(`/login?error=verification_failed`, requestUrl.origin))
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(new URL(`/login?error=verification_failed`, requestUrl.origin))
    }
  }

  // Return the user to the home page if no code is present
  return NextResponse.redirect(new URL('/', requestUrl.origin))
} 