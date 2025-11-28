'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppNavigation from '@/components/navigation/AppNavigation'
import { useSession } from 'next-auth/react'
import { usePermissions } from '@/lib/permissions'
import { MessageSquare, Search, Plus, Edit, Eye, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

interface Observation {
  id: string
  studentId: string
  studentName: string
  className: string
  teacherId: string
  teacherName: string
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  subject: string
  description: string
  date: string
  status: 'ACTIVE' | 'RESOLVED'
}

export default function ObservationsPage() {
  const { data: session } = useSession()
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const userRole = session?.user.role as any
  const { canPerform } = usePermissions(userRole)

  useEffect(() => {
    fetchObservations()
  }, [])

  const fetchObservations = async () => {
    try {
      const response = await fetch('/api/observations')
      if (response.ok) {
        const data = await response.json()
        setObservations(data)
      }
    } catch (error) {
      console.error('Error fetching observations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredObservations = observations.filter(obs =>
    obs.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obs.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obs.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: observations.length,
    positive: observations.filter(o => o.type === 'POSITIVE').length,
    negative: observations.filter(o => o.type === 'NEGATIVE').length,
    neutral: observations.filter(o => o.type === 'NEUTRAL').length,
    resolved: observations.filter(o => o.status === 'RESOLVED').length
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Observations</h1>
            <p className="text-gray-600 mt-1">Suivez et gérez les observations sur les étudiants</p>
          </div>

          {canPerform('create', 'observations') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Observation
            </Button>
          )}
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste des observations</TabsTrigger>
            {canPerform('create', 'observations') && (
              <TabsTrigger value="create">Créer une observation</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une observation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Positives</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Négatives</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Neutres</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Résolues</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.resolved}</div>
                </CardContent>
              </Card>
            </div>

            {/* Observations List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des observations</CardTitle>
                <CardDescription>
                  {filteredObservations.length} observation(s) trouvée(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredObservations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune observation</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Essayez une autre recherche' : 'Aucune observation enregistrée'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredObservations.map((observation) => (
                      <div key={observation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge
                                variant={
                                  observation.type === 'POSITIVE' ? 'default' :
                                  observation.type === 'NEGATIVE' ? 'destructive' : 'secondary'
                                }
                              >
                                {observation.type === 'POSITIVE' && 'Positif'}
                                {observation.type === 'NEGATIVE' && 'Négatif'}
                                {observation.type === 'NEUTRAL' && 'Neutre'}
                              </Badge>
                              <Badge variant={observation.status === 'RESOLVED' ? 'secondary' : 'default'}>
                                {observation.status === 'RESOLVED' ? 'Résolu' : 'Actif'}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              {observation.studentName} - {observation.className}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Matière:</span> {observation.subject}
                            </p>
                            <p className="text-gray-700 mb-2">{observation.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Prof: {observation.teacherName}</span>
                              <span>•</span>
                              <span>{new Date(observation.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canPerform('edit', 'observations') && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canPerform('create', 'observations') && (
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Créer une nouvelle observation</CardTitle>
                  <CardDescription>
                    Enregistrez une observation sur un étudiant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Formulaire à implémenter</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Le formulaire de création sera implémenté prochainement
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