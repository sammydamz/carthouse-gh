'use client'

import { useState, useEffect, useRef } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Supplier {
  id: string
  name: string
}

interface ProductVariant {
  id: string
  variantId: string
  size: string
  color: string
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  condition: string | null
  stock: number
  isAvailable: boolean
  media: string[]
  videoUrl: string | null
  categoryId: string | null
  supplierId: string | null
  category: Category | null
  supplier: Supplier | null
  variants: ProductVariant[]
}

interface FormData {
  name: string
  slug: string
  description: string
  price: string
  condition: string
  stock: string
  isAvailable: boolean
  media: string
  videoUrl: string
  categoryId: string
  supplierId: string
  hasVariants: boolean
  variants: { size: string; color: string; stock: string }[]
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/categories'),
      fetch('/api/admin/suppliers'),
    ])
    setProducts(await productsRes.json())
    setCategories(await categoriesRes.json())
    setSuppliers(await suppliersRes.json())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingProduct
      ? `/api/admin/products/${editingProduct.id}`
      : '/api/admin/products'
    const method = editingProduct ? 'PUT' : 'POST'

    const mediaArray = formData.media.split(',').map((m) => m.trim()).filter(Boolean)

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        condition: formData.condition || null,
        stock: parseInt(formData.stock),
        isAvailable: formData.isAvailable,
        media: mediaArray,
        videoUrl: formData.videoUrl || null,
        categoryId: formData.categoryId || null,
        supplierId: formData.supplierId || null,
        variants: formData.hasVariants
          ? formData.variants
              .filter((v) => v.size && v.color)
              .map((v) => ({ size: v.size, color: v.color, stock: parseInt(v.stock) }))
          : [],
      }),
    })

    setShowForm(false)
    setEditingProduct(null)
    resetForm()
    fetchData()
  }

  const resetForm = () => {
    setFormData({
      name: '', slug: '', description: '', price: '', condition: '', stock: '0',
      isAvailable: true, media: '', videoUrl: '', categoryId: '', supplierId: '',
      hasVariants: false, variants: [{ size: '', color: '', stock: '0' }],
    })
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      condition: product.condition || '',
      stock: product.stock.toString(),
      isAvailable: product.isAvailable,
      media: product.media.join(', '),
      videoUrl: product.videoUrl || '',
      categoryId: product.categoryId || '',
      supplierId: product.supplierId || '',
      hasVariants: product.variants.length > 0,
      variants: product.variants.length > 0
        ? product.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock.toString() }))
        : [{ size: '', color: '', stock: '0' }],
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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, isAvailable: !product.isAvailable }),
    })
    fetchData()
  }

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: '', color: '', stock: '0' }] })
  }

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  const removeVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); resetForm() }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Price (GH₵) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Supplier</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Available</label>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="ml-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Media URLs (comma separated)</label>
                  <input
                    type="text"
                    value={formData.media}
                    onChange={(e) => setFormData({ ...formData, media: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="https://..., https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Video URL</label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div className="col-span-2 border-t pt-4 mt-2">
                  <label className="flex items-center gap-2 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.hasVariants}
                      onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked, variants: e.target.checked ? formData.variants : [] })}
                    />
                    Has Size/Color Variants (Clothing)
                  </label>
                </div>

                {formData.hasVariants && (
                  <div className="col-span-2">
                    {formData.variants.map((variant, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          placeholder="Size (S, M, L...)"
                          value={variant.size}
                          onChange={(e) => updateVariant(i, 'size', e.target.value)}
                          className="border px-2 py-1 rounded flex-1"
                        />
                        <input
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => updateVariant(i, 'color', e.target.value)}
                          className="border px-2 py-1 rounded flex-1"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.stock}
                          onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                          className="border px-2 py-1 rounded w-24"
                        />
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-600">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={addVariant} className="text-blue-600 text-sm">+ Add Variant</button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => !p.isDeleted).map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="font-bold">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </td>
                  <td className="px-4 py-2">GH₵{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.category?.name || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => toggleAvailability(product)} className="text-yellow-600 hover:underline mr-2">
                      {product.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}