import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
    try {
        const { data: s } = await supabaseAdmin.from('services').select('*').limit(1)

        return NextResponse.json({
            services_keys: s && s.length > 0 ? Object.keys(s[0]) : [],
        })
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message })
    }
}
