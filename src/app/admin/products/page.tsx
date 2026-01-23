"use client"

import { useEffect, useState } from "react"
import { getProducts, deleteProduct } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2, Box } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        const res = await getProducts()
        if (res.success) {
            setProducts(res.data || [])
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this product?")) return
        setDeletingId(id)
        const res = await deleteProduct(id)
        if (res.success) loadProducts()
        setDeletingId(null)
    }

    if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground mt-2">Manage your product landing pages.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-lg border border-dashed border-white/20">
                    <Box className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Products Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first product page to get started.</p>
                    <Link href="/admin/products/new">
                        <Button variant="secondary">Create Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card key={product.id} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium truncate">{product.title}</CardTitle>
                                {product.trust_client_count > 0 && (
                                    <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded-full">
                                        {product.trust_client_count} Clients
                                    </span>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                    {product.short_description || "No description"}
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/admin/products/${product.id}`} className="flex-1">
                                        <Button variant="secondary" className="w-full">
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/products/${product.slug}`} target="_blank">
                                        <Button variant="outline" size="icon">
                                            <Box className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(product.id)}
                                        disabled={deletingId === product.id}
                                    >
                                        {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
