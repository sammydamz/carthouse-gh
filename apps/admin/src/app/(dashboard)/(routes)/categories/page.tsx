'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  parentId: string | null
  children: Category[]
  _count: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', imageUrl: '', parentId: '' })

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    setCategories(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
    await fetch(url, {
      method: editingCategory ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, parentId: formData.parentId || null }),
    })
    setShowForm(false)
    setEditingCategory(null)
    setFormData({ name: '', slug: '', imageUrl: '', parentId: '' })
    fetchCategories()
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, slug: category.slug, imageUrl: category.imageUrl || '', parentId: category.parentId || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  const rootCategories = categories.filter((c) => !c.parentId)

  return (
    <div className="flex-col">
      <div className="flex-1 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-sm text-muted-foreground">Manage product categories and subcategories</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingCategory(null); setFormData({ name: '', slug: '', imageUrl: '', parentId: '' }) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-[450px] mx-4">
              <CardHeader>
                <CardTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentId">Parent Category</Label>
                    <select
                      id="parentId"
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">None (Top Level)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">{editingCategory ? 'Update' : 'Create'}</Button>
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
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">Slug</th>
                    <th className="py-3 px-4 text-left font-medium">Products</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rootCategories.map((category) => (
                    <>
                      <tr key={category.id} className="border-b bg-muted/30 font-semibold">
                        <td className="py-3 px-4">{category.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{category.slug}</td>
                        <td className="py-3 px-4">{category._count.products}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                        </td>
                      </tr>
                      {category.children.map((child) => (
                        <tr key={child.id} className="border-b last:border-0">
                          <td className="py-3 px-4 pl-8 text-muted-foreground">└─ {child.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{child.slug}</td>
                          <td className="py-3 px-4">{child._count.products}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(child)}><Pencil className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(child.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                  {rootCategories.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No categories yet</td></tr>
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