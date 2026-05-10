'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
   const router = useRouter()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      setLoading(true)
      setError('')

      try {
         const res = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         })

         if (!res.ok) {
            const data = await res.json()
            setError(data.error || 'Login failed')
            return
         }

         router.push('/')
      } catch {
         setError('Network error. Please try again.')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <Card className="w-full max-w-sm mx-4">
            <CardHeader className="space-y-1 text-center">
               <CardTitle className="text-2xl">CarHouse GH</CardTitle>
               <CardDescription>Admin login</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                     <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                        {error}
                     </div>
                  )}
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input id="email" type="email" placeholder="admin@carthousegh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}