
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../../.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^"(.*)"$/, '$1')
        envVars[key] = value
    }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkSchema() {
    console.log('Checking service_portfolio schema...')
    // Try to select 'link' from service_portfolio
    const { data, error } = await supabase
        .from('service_portfolio')
        .select('link')
        .limit(1)

    if (error) {
        console.error('Error selecting link column:', error.message)
        if (error.message.includes('column "link" does not exist')) {
            console.log('Column "link" IS MISSING.')
        }
    } else {
        console.log('Column "link" exists.')
    }
}

checkSchema()
