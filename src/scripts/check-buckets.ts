
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

async function checkAndCreateBucket() {
    console.log('Checking buckets...')
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error)
        return
    }

    const bucketName = 'service-icons'
    const exists = buckets?.find(b => b.name === bucketName)

    if (exists) {
        console.log(`Bucket '${bucketName}' already exists.`)
    } else {
        console.log(`Bucket '${bucketName}' not found. Creating...`)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
        })

        if (createError) {
            console.error('Error creating bucket:', createError)
        } else {
            console.log(`Bucket '${bucketName}' created successfully.`)
        }
    }
}

checkAndCreateBucket()
