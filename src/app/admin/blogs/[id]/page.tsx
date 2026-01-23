import { BlogEditor } from "@/components/admin/BlogEditor"
import { getBlogBySlug, getAllBlogs } from "@/actions/blog-actions"
import { notFound } from "next/navigation"

// Note: We need to fetch by ID for the admin editor usually, but our logic in page.tsx linked by ID.
// However `getBlogBySlug` was in implementation plan. I should probably add `getBlogById` or just fetch all and find.
// For efficiency, I will use `getAllBlogs` and filter for now, or add `getBlogById` to actions.
// Let's add `getBlogById` to actions in next step if needed, but for now let's just use `getAllBlogs` locally or fix `getBlogBySlug`.
// Actually, I can just fetch the single blog using supabase directly here since it's a server component?
// No, better to keep logic in actions. I'll use getAllBlogs().find() for quick prototype or update actions.
// Better: update actions to include `getBlogById`. 

// Waiting on that action update. For now I will assume I can fetch it. I'll mock the fetch or add the function.
// Actually, I'll just add `getBlogById` to the actions file in the next step.

import { createClient } from "@supabase/supabase-js"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
    const { id } = await params

    // Direct fetch for Admin (bypass published check)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: blog } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single()

    if (!blog) {
        return notFound()
    }

    return <BlogEditor blog={blog} />
}
