'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText
} from 'lucide-react'

interface Payment {
  id: string
  type: 'TUITION' | 'SUPPLIES' | 'SPORTS' | 'OTHER'
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  description?: string
  paymentMethod?: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOBILE_MONEY'
  paidAmount?: number
  paidDate?: string
  createdAt: string
  student: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
    class?: {
      name: string
    }
  }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  studentNumber: string
  class?: {
    name: string
  }
}

const mockPayments: Payment[] = [
  {
    id: '1',
    type: 'TUITION',
    amount: 25000,
    dueDate: '2024-01-31',
    status: 'PAID',
    description: 'Frais de scolarité - Janvier 2024',
    paymentMethod: 'CASH',
    paidAmount: 25000,
    paidDate: '2024-01-15',
    createdAt: '2024-01-01T00:00:00Z',
    student: {
      id: '1',
      firstName: 'Mohamed',
      lastName: 'Salem',
      studentNumber: '2024-001',
      class: { name: 'CM2' }
    }
  },
  {
    id: '2',
    type: 'TUITION',
    amount: 25000,
    dueDate: '2024-02-29',
    status: 'PENDING',
    description: 'Frais de scolarité - Février 2024',
    createdAt: '2024-02-01T00:00:00Z',
    student: {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Bint',
      studentNumber: '2024-002',
      class: { name: 'CE2' }
    }
  },
  {
    id: '3',
    type: 'SUPPLIES',
    amount: 5000,
    dueDate: '2024-01-15',
    status: 'OVERDUE',
    description: 'Fournitures scolaires',
    createdAt: '2024-01-01T00:00:00Z',
    student: {
      id: '3',
      firstName: 'Ahmed',
      lastName: 'Ould',
      studentNumber: '2024-003',
      class: { name: 'CP2' }
    }
  }
]

const mockStudents: Student[] = [
  { id: '1', firstName: 'Mohamed', lastName: 'Salem', studentNumber: '2024-001', class: { name: 'CM2' } },
  { id: '2', firstName: 'Fatima', lastName: 'Bint', studentNumber: '2024-002', class: { name: 'CE2' } },
  { id: '3', firstName: 'Ahmed', lastName: 'Ould', studentNumber: '2024-003', class: { name: 'CP2' } },
  { id: '4', firstName: 'Mariam', lastName: 'Sow', studentNumber: '2024-004', class: { name: 'CM1' } }
]

export default function FinanceManagement() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('payments')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [financeToDelete, setFinanceToDelete] = useState<Payment | null>(null)

  // Formulaire d'ajout
  const [formData, setFormData] = useState({
    studentId: '',
    type: '',
    amount: '',
    dueDate: '',
    description: '',
    paymentMethod: ''
  })

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, selectedType, selectedStatus])

  const filterPayments = () => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(payment => payment.type === selectedType)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === selectedStatus)
    }

    setFilteredPayments(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const student = mockStudents.find(s => s.id === formData.studentId)
    if (!student) return

    const newPayment: Payment = {
      id: Date.now().toString(),
      type: formData.type as any,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      status: 'PENDING',
      description: formData.description,
      paymentMethod: formData.paymentMethod as any,
      createdAt: new Date().toISOString(),
      student
    }

    setPayments([newPayment, ...payments])

    // Show success toast
    const typeLabels = {
      TUITION: 'Scolarité',
      SUPPLIES: 'Fournitures',
      SPORTS: 'Sports',
      OTHER: 'Autre'
    }

    toast({
      title: "Paiement ajouté avec succès",
      description: `Un paiement de ${parseFloat(formData.amount).toLocaleString()} MRU pour ${typeLabels[formData.type as keyof typeof typeLabels]} a été ajouté pour ${student.firstName} ${student.lastName}${formData.description ? ` - ${formData.description}` : ''}${formData.paymentMethod ? ` - Méthode: ${formData.paymentMethod === 'CASH' ? 'Espèces' : formData.paymentMethod === 'CARD' ? 'Carte' : formData.paymentMethod === 'BANK_TRANSFER' ? 'Virement' : 'Mobile Money'}` : ''}`,
      variant: "success",
    })

    // Reset form
    setFormData({
      studentId: '',
      type: '',
      amount: '',
      dueDate: '',
      description: '',
      paymentMethod: ''
    })
    setIsAddDialogOpen(false)
  }

  const updatePaymentStatus = (paymentId: string, status: string) => {
    const payment = payments.find(p => p.id === paymentId)
    if (!payment) return

    setPayments(payments.map(p =>
      p.id === paymentId
        ? {
            ...p,
            status: status as any,
            paidDate: status === 'PAID' ? new Date().toISOString() : undefined,
            paidAmount: status === 'PAID' ? p.amount : undefined
          }
        : p
    ))

    // Show status update toast
    const statusLabels = {
      PENDING: 'En attente',
      PAID: 'Payé',
      OVERDUE: 'En retard',
      CANCELLED: 'Annulé'
    }

    const typeLabels = {
      TUITION: 'Scolarité',
      SUPPLIES: 'Fournitures',
      SPORTS: 'Sports',
      OTHER: 'Autre'
    }

    if (status === 'PAID') {
      toast({
        title: "Paiement marqué comme payé",
        description: `Le paiement de ${payment.amount.toLocaleString()} MRU pour ${typeLabels[payment.type]} de ${payment.student.firstName} ${payment.student.lastName} a été marqué comme payé`,
        variant: "success",
      })
    } else if (status === 'OVERDUE') {
      toast({
        title: "Paiement marqué en retard",
        description: `Le paiement de ${payment.amount.toLocaleString()} MRU pour ${typeLabels[payment.type]} de ${payment.student.firstName} ${payment.student.lastName} est maintenant en retard`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Statut du paiement mis à jour",
        description: `Le statut du paiement a été changé vers "${statusLabels[status as keyof typeof statusLabels]}"`,
        variant: "default",
      })
    }
  }

  const handleDeleteFinance = (payment: Payment) => {
    setFinanceToDelete(payment)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteFinance = () => {
    if (!financeToDelete) return

    setPayments(payments.filter(payment => payment.id !== financeToDelete.id))

    toast({
      title: 'Paiement supprimé avec succès',
      description: `Le paiement de ${financeToDelete.amount.toLocaleString()} MRU pour ${financeToDelete.student.firstName} ${financeToDelete.student.lastName} a été supprimé.`,
      variant: 'success'
    })

    setDeleteDialogOpen(false)
    setFinanceToDelete(null)
  }

  const cancelDeleteFinance = () => {
    setDeleteDialogOpen(false)
    setFinanceToDelete(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TUITION': return <DollarSign className="h-4 w-4 text-blue-500" />
      case 'SUPPLIES': return <FileText className="h-4 w-4 text-green-500" />
      case 'SPORTS': return <Users className="h-4 w-4 text-orange-500" />
      default: return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TUITION': return 'Scolarité'
      case 'SUPPLIES': return 'Fournitures'
      case 'SPORTS': return 'Sports'
      default: return 'Autre'
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      PENDING: 'En attente',
      PAID: 'Payé',
      OVERDUE: 'En retard',
      CANCELLED: 'Annulé'
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'CASH': return <Banknote className="h-4 w-4 text-green-600" />
      case 'CARD': return <CreditCard className="h-4 w-4 text-blue-600" />
      case 'MOBILE_MONEY': return <Smartphone className="h-4 w-4 text-purple-600" />
      default: return <DollarSign className="h-4 w-4 text-gray-400" />
    }
  }

  // Calculer les statistiques
  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.paidAmount!, 0)
  const pendingRevenue = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0)
  const overdueRevenue = payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion Financière</h2>
          <p className="text-gray-600">
            Suivi des paiements et gestion des frais scolaires
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un paiement</DialogTitle>
                <DialogDescription>
                  Enregistrer un nouveau paiement ou frais scolaire
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Élève *</Label>
                    <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un élève" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} ({student.studentNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TUITION">Scolarité</SelectItem>
                        <SelectItem value="SUPPLIES">Fournitures</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="OTHER">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant (MRU) *</Label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date d'échéance *</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Description du paiement..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Méthode de paiement</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Espèces</SelectItem>
                      <SelectItem value="CARD">Carte bancaire</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
                      <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Ajouter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Statistiques financières */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} MRU</div>
                <p className="text-sm text-gray-600">Revenus encaissés</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingRevenue.toLocaleString()} MRU</div>
                <p className="text-sm text-gray-600">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{overdueRevenue.toLocaleString()} MRU</div>
                <p className="text-sm text-gray-600">En retard</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((totalRevenue / (totalRevenue + pendingRevenue + overdueRevenue)) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Taux de recouvrement</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un élève..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="TUITION">Scolarité</SelectItem>
                      <SelectItem value="SUPPLIES">Fournitures</SelectItem>
                      <SelectItem value="SPORTS">Sports</SelectItem>
                      <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="PAID">Payé</SelectItem>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="OVERDUE">En retard</SelectItem>
                      <SelectItem value="CANCELLED">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau des paiements */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des paiements</CardTitle>
              <CardDescription>
                {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} trouvé{filteredPayments.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Élève</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Montant</th>
                      <th className="text-left p-3 font-medium">Échéance</th>
                      <th className="text-left p-3 font-medium">Statut</th>
                      <th className="text-left p-3 font-medium">Méthode</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{payment.student.firstName} {payment.student.lastName}</p>
                            <p className="text-xs text-gray-500">{payment.student.studentNumber}</p>
                            {payment.student.class && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {payment.student.class.name}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(payment.type)}
                            <span>{getTypeLabel(payment.type)}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">{payment.amount.toLocaleString()} MRU</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            {payment.paymentMethod && getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-xs">
                              {payment.paymentMethod ? 
                                payment.paymentMethod === 'CASH' ? 'Espèces' :
                                payment.paymentMethod === 'CARD' ? 'Carte' :
                                payment.paymentMethod === 'BANK_TRANSFER' ? 'Virement' :
                                payment.paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : ''
                                : '-'
                              }
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === 'PENDING' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updatePaymentStatus(payment.id, 'PAID')}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {payment.status === 'PENDING' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updatePaymentStatus(payment.id, 'OVERDUE')}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFinance(payment)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun paiement trouvé
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                        ? 'Essayez de modifier vos filtres'
                        : 'Commencez par ajouter un nouveau paiement'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques financières</CardTitle>
              <CardDescription>
                Analyse détaillée des revenus et paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Statistiques en cours de développement
                </h3>
                <p className="text-gray-500">
                  Les graphiques et analyses financières détaillées seront bientôt disponibles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports financiers</CardTitle>
              <CardDescription>
                Génération de rapports et export de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Rapports en cours de développement
                </h3>
                <p className="text-gray-500">
                  Les rapports financiers détaillés seront bientôt disponibles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Professional Delete Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Supprimer le paiement
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          {financeToDelete && (
            <div className="py-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {financeToDelete.student.firstName[0]}{financeToDelete.student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {financeToDelete.student.firstName} {financeToDelete.student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {financeToDelete.student.studentNumber}
                      {financeToDelete.student.class && ` • ${financeToDelete.student.class.name}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type de paiement:</span>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(financeToDelete.type)}
                      <span className="font-medium">{getTypeLabel(financeToDelete.type)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Montant:</span>
                    <span className="font-medium text-red-600">
                      {financeToDelete.amount.toLocaleString()} MRU
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date d'échéance:</span>
                    <span className="font-medium">
                      {new Date(financeToDelete.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Méthode de paiement:</span>
                    <div className="flex items-center gap-1">
                      {financeToDelete.paymentMethod && getPaymentMethodIcon(financeToDelete.paymentMethod)}
                      <span className="text-sm">
                        {financeToDelete.paymentMethod ?
                          financeToDelete.paymentMethod === 'CASH' ? 'Espèces' :
                          financeToDelete.paymentMethod === 'CARD' ? 'Carte' :
                          financeToDelete.paymentMethod === 'BANK_TRANSFER' ? 'Virement' :
                          financeToDelete.paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : ''
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut:</span>
                    {getStatusBadge(financeToDelete.status)}
                  </div>
                  {financeToDelete.description && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">Description:</span>
                      <span className="text-sm text-right max-w-[180px]">
                        {financeToDelete.description}
                      </span>
                    </div>
                  )}
                  {financeToDelete.paidDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Date de paiement:</span>
                      <span className="font-medium">
                        {new Date(financeToDelete.paidDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Attention:</strong> La suppression de ce paiement affectera les enregistrements financiers et ne pourra pas être annulée.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={cancelDeleteFinance}
              className="border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDeleteFinance}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}