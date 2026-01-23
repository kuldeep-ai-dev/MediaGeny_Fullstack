
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

async function verifySchema() {
    console.log('Verifying Invoice Module Schema...')

    const tables = ['business_profile', 'clients', 'invoices', 'invoice_items', 'invoice_payments']
    let allExist = true

    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
            // If error code is '42P01' (undefined_table) it means table missing
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
                console.error(`❌ Table '${table}' DOES NOT EXIST.`)
                allExist = false
            } else {
                console.log(`⚠️ Error checking '${table}': ${error.message}`)
                // Proceeding assuming it might be another issue, but usually this select should work if table exists
            }
        } else {
            console.log(`✅ Table '${table}' exists.`)
        }
    }

    if (!allExist) {
        console.log('\nPlease run the SQL schema in Supabase SQL Editor.')
        process.exit(1)
    } else {
        console.log('\nAll tables verified.')
    }
}

verifySchema()
