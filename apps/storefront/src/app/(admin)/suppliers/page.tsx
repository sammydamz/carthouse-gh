'use client'

import { useState, useEffect } from 'react'

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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryZones: '',
    deliveryFee: '',
    notes: '',
  })

  const fetchSuppliers = async () => {
    const res = await fetch('/api/admin/suppliers')
    const data = await res.json()
    setSuppliers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingSupplier
      ? `/api/admin/suppliers/${editingSupplier.id}`
      : '/api/admin/suppliers'
    const method = editingSupplier ? 'PUT' : 'POST'

    await fetch(url, {
      method,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return
    await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' })
    fetchSuppliers()
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      deliveryZones: supplier.deliveryZones.join(', '),
      deliveryFee: supplier.deliveryFee?.toString() || '',
      notes: supplier.notes || '',
    })
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingSupplier(null)
            setFormData({ name: '', phone: '', email: '', address: '', deliveryZones: '', deliveryFee: '', notes: '' })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Phone *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Delivery Zones (comma separated)</label>
                <input
                  type="text"
                  value={formData.deliveryZones}
                  onChange={(e) => setFormData({ ...formData, deliveryZones: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Accra, Tema, Kumasi"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Default Delivery Fee (GH₵)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
                  {editingSupplier ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Delivery Zones</th>
                <th className="px-4 py-2 text-left">Products</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t">
                  <td className="px-4 py-2 font-bold">{supplier.name}</td>
                  <td className="px-4 py-2">{supplier.phone}</td>
                  <td className="px-4 py-2">{supplier.email || '-'}</td>
                  <td className="px-4 py-2">{supplier.deliveryZones.join(', ') || '-'}</td>
                  <td className="px-4 py-2">{supplier._count.products}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:underline"
                    >
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