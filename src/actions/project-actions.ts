'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export type Project = {
    id: string
    title: string
    slug: string
    description: string
    image_url: string
    tags: string[]
    live_link?: string
    created_at: string
}

export async function getProjects() {
    // Note: Re-using the initialized 'supabase' which is actually 'supabaseAdmin'
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return { success: false, error: 'Failed to fetch projects' }
    }

    return { success: true, projects }
}

export async function getProjectBySlug(slug: string) {
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return { success: false, error: 'Project not found' }
    }

    return { success: true, project }
}

export async function createProject(data: Omit<Project, 'id' | 'created_at'>) {
    const { error } = await supabase
        .from('projects')
        .insert(data)

    if (error) {
        console.error('Error creating project:', error)
        return { success: false, error: error.message || 'Failed to create project' }
    }

    revalidatePath('/portfolio')
    revalidatePath('/admin/portfolio')
    return { success: true }
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'created_at'>>) {
    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating project:', error)
        return { success: false, error: error.message || 'Failed to update project' }
    }

    revalidatePath('/portfolio')
    revalidatePath('/admin/portfolio')
    return { success: true }
}

export async function deleteProject(id: string) {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting project:', error)
        return { success: false, error: 'Failed to delete project' }
    }

    revalidatePath('/portfolio')
    revalidatePath('/admin/portfolio')
    return { success: true }
}
