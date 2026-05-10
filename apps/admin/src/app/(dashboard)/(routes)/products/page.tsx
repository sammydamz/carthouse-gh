'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, EyeOff, Eye } from 'lucide-react'

interface Category { id: string; name: string; slug: string }
interface Supplier { id: string; name: string }
interface ProductVariant { id: string; variantId: string; size: string; color: string; stock: number }
interface Product {
  id: string; name: string; slug: string; description: string | null
  price: number; condition: string | null; stock: number; isAvailable: boolean
  isDeleted: boolean; media: string[]; videoUrl: string | null
  categoryId: string | null; supplierId: string | null
  category: Category | null; supplier: Supplier | null; variants: ProductVariant[]
}

interface FormData {
  name: string; slug: string; description: string; price: string; condition: string
  stock: string; isAvailable: boolean; media: string; videoUrl: string
  categoryId: string; supplierId: string
  hasVariants: boolean; variants: { size: string; color: string; stock: string }[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '', slug: '', description: '', price: '', condition: '', stock: '0',
    isAvailable: true, media: '', videoUrl: '', categoryId: '', supplierId: '',
    hasVariants: false, variants: [{ size: '', color: '', stock: '0' }],
  })

  const fetchData = async () => {
    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      fetch('/api/admin/products'), fetch('/api/admin/categories'), fetch('/api/admin/suppliers'),
    ])
    setProducts(await productsRes.json())
    setCategories(await categoriesRes.json())
    setSuppliers(await suppliersRes.json())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
    const method = editingProduct ? 'PUT' : 'POST'
    const mediaArray = formData.media.split(',').map((m) => m.trim()).filter(Boolean)
    await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name, slug: formData.slug, description: formData.description || null,
        price: parseFloat(formData.price), condition: formData.condition || null,
        stock: parseInt(formData.stock), isAvailable: formData.isAvailable,
        media: mediaArray, videoUrl: formData.videoUrl || null,
        categoryId: formData.categoryId || null, supplierId: formData.supplierId || null,
        variants: formData.hasVariants ? formData.variants.filter((v) => v.size && v.color).map((v) => ({ size: v.size, color: v.color, stock: parseInt(v.stock) })) : [],
      }),
    })
    setShowForm(false); setEditingProduct(null); resetForm(); fetchData()
  }

  const resetForm = () => setFormData({
    name: '', slug: '', description: '', price: '', condition: '', stock: '0',
    isAvailable: true, media: '', videoUrl: '', categoryId: '', supplierId: '',
    hasVariants: false, variants: [{ size: '', color: '', stock: '0' }],
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name, slug: product.slug, description: product.description || '',
      price: product.price.toString(), condition: product.condition || '', stock: product.stock.toString(),
      isAvailable: product.isAvailable, media: product.media.join(', '), videoUrl: product.videoUrl || '',
      categoryId: product.categoryId || '', supplierId: product.supplierId || '',
      hasVariants: product.variants.length > 0,
      variants: product.variants.length > 0 ? product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock.toString() })) : [{ size: '', color: '', stock: '0' }],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const toggleAvailability = async (product: Product) => {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    })
    fetchData()
  }

  const addVariant = () => setFormData({ ...formData, variants: [...formData.variants, { size: '', color: '', stock: '0' }] })
  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }
  const removeVariant = (index: number) => setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })

  return (
    <div className="flex-col">
      <div className="flex-1 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingProduct(null); resetForm() }}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
            <Card className="w-[600px] mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader><CardTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (GH₵) *</Label>
                      <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <select id="condition" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select</option>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category</Label>
                      <select id="categoryId" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierId">Supplier</Label>
                      <select id="supplierId" value={formData.supplierId} onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2 flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} className="h-4 w-4" />
                        Available for sale
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media">Media URLs (comma separated)</Label>
                    <Input id="media" value={formData.media} onChange={(e) => setFormData({ ...formData, media: e.target.value })} placeholder="https://..., https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input id="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                  </div>

                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" checked={formData.hasVariants} onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })} className="h-4 w-4" />
                      Has Size/Color Variants (Clothing)
                    </label>
                    {formData.hasVariants && (
                      <div className="mt-3 space-y-2">
                        {formData.variants.map((variant, i) => (
                          <div key={i} className="flex gap-2">
                            <Input placeholder="Size (S, M, L...)" value={variant.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} className="flex-1" />
                            <Input placeholder="Color" value={variant.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} className="flex-1" />
                            <Input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="w-24" />
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)} className="text-destructive">✕</Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Add Variant</Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">{editingProduct ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Product</th>
                    <th className="py-3 px-4 text-left font-medium">Price</th>
                    <th className="py-3 px-4 text-left font-medium">Stock</th>
                    <th className="py-3 px-4 text-left font-medium">Category</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => !p.isDeleted).map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.slug}</div>
                      </td>
                      <td className="py-3 px-4">GH₵{product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">{product.category?.name || <span className="text-muted-foreground">-</span>}</td>
                      <td className="py-3 px-4">
                        <Badge variant={product.isAvailable ? 'default' : 'secondary'} className="text-xs">
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => toggleAvailability(product)} title={product.isAvailable ? 'Disable' : 'Enable'}>
                          {product.isAvailable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No products yet</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}