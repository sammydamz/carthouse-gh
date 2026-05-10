'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  deliveryZones: string[]
  deliveryFee: number | null
  notes: string | null
  _count: { products: number; orderItems: number }
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', deliveryZones: '', deliveryFee: '', notes: '' })

  const fetchSuppliers = async () => {
    const res = await fetch('/api/admin/suppliers')
    setSuppliers(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchSuppliers() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingSupplier ? `/api/admin/suppliers/${editingSupplier.id}` : '/api/admin/suppliers'
    await fetch(url, {
      method: editingSupplier ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        deliveryZones: formData.deliveryZones.split(',').map((z) => z.trim()).filter(Boolean),
        deliveryFee: formData.deliveryFee ? parseFloat(formData.deliveryFee) : null,
      }),
    })
    setShowForm(false)
    setEditingSupplier(null)
    setFormData({ name: '', phone: '', email: '', address: '', deliveryZones: '', deliveryFee: '', notes: '' })
    fetchSuppliers()
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name, phone: supplier.phone, email: supplier.email || '',
      address: supplier.address || '', deliveryZones: supplier.deliveryZones.join(', '),
      deliveryFee: supplier.deliveryFee?.toString() || '', notes: supplier.notes || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return
    await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' })
    fetchSuppliers()
  }

  return (
    <div className="flex-col">
      <div className="flex-1 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Suppliers</h1>
            <p className="text-sm text-muted-foreground">Manage product suppliers and vendors</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingSupplier(null); setFormData({ name: '', phone: '', email: '', address: '', deliveryZones: '', deliveryFee: '', notes: '' }) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader><CardTitle>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryZones">Delivery Zones (comma separated)</Label>
                    <Input id="deliveryZones" value={formData.deliveryZones} onChange={(e) => setFormData({ ...formData, deliveryZones: e.target.value })} placeholder="Accra, Tema, Kumasi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">Default Delivery Fee (GH₵)</Label>
                    <Input id="deliveryFee" type="number" step="0.01" value={formData.deliveryFee} onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" rows={3} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">{editingSupplier ? 'Update' : 'Create'}</Button>
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
                    <th className="py-3 px-4 text-left font-medium">Phone</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Zones</th>
                    <th className="py-3 px-4 text-left font-medium">Products</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{supplier.name}</td>
                      <td className="py-3 px-4">{supplier.phone}</td>
                      <td className="py-3 px-4 text-muted-foreground">{supplier.email || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {supplier.deliveryZones.map((z) => <Badge key={z} variant="secondary" className="text-xs">{z}</Badge>)}
                        </div>
                      </td>
                      <td className="py-3 px-4">{supplier._count.products}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(supplier.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No suppliers yet</td></tr>
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