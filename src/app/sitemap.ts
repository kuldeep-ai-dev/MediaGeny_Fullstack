import { MetadataRoute } from 'next'
import { getServices } from "@/actions/public-actions"
import { getProducts } from "@/actions/product-actions"
import { getPublishedBlogs } from "@/actions/blog-actions"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mediageny.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [servicesRes, productsRes, blogs] = await Promise.all([
        getServices(),
        getProducts(),
        getPublishedBlogs()
    ])

    const services = servicesRes.success ? (servicesRes.services || []) : []
    const products = productsRes.success ? (productsRes.data || []) : []

    // Static Routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/legal',
        '/careers',
        '/services',
        '/blogs',
        '/products',
        '/site-map',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Services
    const serviceRoutes = services.map((service: any) => ({
        url: `${BASE_URL}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Dynamic Products
    const productRoutes = products.map((product: any) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Dynamic Blogs
    const blogRoutes = blogs.map((blog: any) => ({
        url: `${BASE_URL}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    return [...routes, ...serviceRoutes, ...productRoutes, ...blogRoutes]
}
