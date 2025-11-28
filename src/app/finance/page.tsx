'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppNavigation from '@/components/navigation/AppNavigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/lib/permissions'
import { DollarSign, Search, Plus, Edit, Eye, TrendingUp, TrendingDown, Calendar, Users, CreditCard, Clock, AlertTriangle, FileText, Settings } from 'lucide-react'

interface Payment {
  id: string
  studentId: string
  studentName: string
  className: string
  type: 'TUITION' | 'FEE' | 'PENALTY' | 'SCHOLARSHIP'
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL'
  paymentDate?: string
  description: string
}

interface FinanceStats {
  totalRevenue: number
  totalPending: number
  totalOverdue: number
  monthlyRevenue: number
  totalStudents: number
  paidStudents: number
}

export default function FinancePage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<FinanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const userRole = user?.role as any
  const { canPerform } = usePermissions(userRole)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        fetch('/api/finance/payments'),
        fetch('/api/finance/stats')
      ])

      if (paymentsRes.ok) {
        const data = await paymentsRes.json()
        setPayments(data)
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AppNavigation>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AppNavigation>
    )
  }

  return (
    <AppNavigation>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Financière</h1>
            <p className="text-gray-600 mt-1">Suivez les paiements et la gestion financière</p>
          </div>

          {canPerform('manage', 'finance') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Paiement
            </Button>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
            {canPerform('manage', 'finance') && (
              <TabsTrigger value="manage">Gérer</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalRevenue.toLocaleString('fr-FR')} XOF
                  </div>
                  <p className="text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +{stats?.monthlyRevenue.toLocaleString('fr-FR')} ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalPending.toLocaleString('fr-FR')} XOF
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Retard</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {stats?.totalOverdue.toLocaleString('fr-FR')} XOF
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Paiement</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalStudents > 0 ?
                      Math.round((stats.paidStudents / stats.totalStudents) * 100) : 0
                    }%
                  </div>
                  <p className="text-xs text-gray-500">
                    {stats?.paidStudents}/{stats?.totalStudents} étudiants
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>
                  Les 10 dernières transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Aucune transaction enregistrée
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPayments.slice(0, 10).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.studentName} - {payment.className}
                          </p>
                          <p className="text-sm text-gray-500">{payment.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {payment.amount.toLocaleString('fr-FR')} XOF
                          </p>
                          <Badge
                            variant={
                              payment.status === 'PAID' ? 'default' :
                              payment.status === 'OVERDUE' ? 'destructive' :
                              payment.status === 'PARTIAL' ? 'secondary' : 'outline'
                            }
                          >
                            {payment.status === 'PAID' && 'Payé'}
                            {payment.status === 'PENDING' && 'En attente'}
                            {payment.status === 'OVERDUE' && 'En retard'}
                            {payment.status === 'PARTIAL' && 'Partiel'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un paiement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des Paiements</CardTitle>
                <CardDescription>
                  {filteredPayments.length} paiement(s) trouvé(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Essayez une autre recherche' : 'Aucun paiement enregistré'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">Étudiant</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Montant</th>
                          <th className="px-6 py-3">Échéance</th>
                          <th className="px-6 py-3">Statut</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment) => (
                          <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{payment.studentName}</p>
                                <p className="text-xs text-gray-500">{payment.className}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">
                                {payment.type === 'TUITION' && 'Scolarité'}
                                {payment.type === 'FEE' && 'Frais'}
                                {payment.type === 'PENALTY' && 'Pénalité'}
                                {payment.type === 'SCHOLARSHIP' && 'Bourse'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 font-medium">
                              {payment.amount.toLocaleString('fr-FR')} XOF
                            </td>
                            <td className="px-6 py-4">
                              {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant={
                                  payment.status === 'PAID' ? 'default' :
                                  payment.status === 'OVERDUE' ? 'destructive' :
                                  payment.status === 'PARTIAL' ? 'secondary' : 'outline'
                                }
                              >
                                {payment.status === 'PAID' && 'Payé'}
                                {payment.status === 'PENDING' && 'En attente'}
                                {payment.status === 'OVERDUE' && 'En retard'}
                                {payment.status === 'PARTIAL' && 'Partiel'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {canPerform('manage', 'finance') && (
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Financiers</CardTitle>
                <CardDescription>
                  Générez des rapports financiers détaillés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Rapports à implémenter</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Les rapports financiers seront implémentés prochainement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canPerform('manage', 'finance') && (
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion Financière</CardTitle>
                  <CardDescription>
                    Gérez les paiements et les paramètres financiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Outils à implémenter</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Les outils de gestion seront implémentés prochainement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppNavigation>
  )
}