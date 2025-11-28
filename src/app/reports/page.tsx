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
import { FileText, Download, Search, Calendar, TrendingUp, Users, BookOpen, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

interface Report {
  id: string
  title: string
  type: 'STUDENTS' | 'TEACHERS' | 'ATTENDANCE' | 'GRADES' | 'FINANCE' | 'OBSERVATIONS'
  description: string
  generatedDate: string
  generatedBy: string
  status: 'GENERATING' | 'READY' | 'FAILED'
  fileUrl?: string
}

interface ReportStats {
  totalReports: number
  thisMonth: number
  lastMonth: number
  mostGenerated: string
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const userRole = session?.user.role as any
  const { canPerform } = usePermissions(userRole)

  useEffect(() => {
    fetchReports()
    fetchStats()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reports/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching report stats:', error)
    }
  }

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'STUDENTS': return Users
      case 'TEACHERS': return Users
      case 'ATTENDANCE': return Calendar
      case 'GRADES': return BookOpen
      case 'FINANCE': return DollarSign
      case 'OBSERVATIONS': return AlertCircle
      default: return FileText
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Prêt</Badge>
      case 'GENERATING':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Échoué</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'STUDENTS': return 'Étudiants'
      case 'TEACHERS': return 'Enseignants'
      case 'ATTENDANCE': return 'Présence'
      case 'GRADES': return 'Notes'
      case 'FINANCE': return 'Finance'
      case 'OBSERVATIONS': return 'Observations'
      default: return type
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>
            <p className="text-gray-600 mt-1">Générez et consultez les rapports de l'établissement</p>
          </div>

          {canPerform('export', 'reports') && (
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Nouveau Rapport
            </Button>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="reports">Mes Rapports</TabsTrigger>
            {canPerform('export', 'reports') && (
              <TabsTrigger value="generate">Générer</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rapports</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalReports || 0}</div>
                  <p className="text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +{stats?.thisMonth || 0} ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.thisMonth || 0}</div>
                  <p className="text-xs text-gray-500">
                    Mois dernier: {stats?.lastMonth || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plus Demandé</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{stats?.mostGenerated || '-'}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Succès</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {reports.length > 0 ?
                      Math.round((reports.filter(r => r.status === 'READY').length / reports.length) * 100) : 0
                    }%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Rapports Récents</CardTitle>
                <CardDescription>
                  Les 5 derniers rapports générés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rapport</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Aucun rapport n'a été généré pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReports.slice(0, 5).map((report) => {
                      const Icon = getReportIcon(report.type)
                      return (
                        <div key={report.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{report.title}</p>
                              <p className="text-sm text-gray-500">
                                {getTypeLabel(report.type)} • par {report.generatedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">
                              {new Date(report.generatedDate).toLocaleDateString('fr-FR')}
                            </span>
                            {getStatusBadge(report.status)}
                            {report.status === 'READY' && report.fileUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un rapport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Tous les Rapports</CardTitle>
                <CardDescription>
                  {filteredReports.length} rapport(s) trouvé(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rapport</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Essayez une autre recherche' : 'Aucun rapport généré'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">Titre</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Généré par</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Statut</th>
                          <th className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => {
                          const Icon = getReportIcon(report.type)
                          return (
                            <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">{report.title}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline">
                                  {getTypeLabel(report.type)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">{report.generatedBy}</td>
                              <td className="px-6 py-4">
                                {new Date(report.generatedDate).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(report.status)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  {report.status === 'READY' && report.fileUrl && (
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canPerform('export', 'reports') && (
            <TabsContent value="generate">
              <Card>
                <CardHeader>
                  <CardTitle>Générer un Nouveau Rapport</CardTitle>
                  <CardDescription>
                    Choisissez le type de rapport à générer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Rapport Étudiants</span>
                        </CardTitle>
                        <CardDescription>
                          Liste complète des étudiants avec leurs informations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5" />
                          <span>Rapport Notes</span>
                        </CardTitle>
                        <CardDescription>
                          Statistiques des notes et performances académiques
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>Rapport Présence</span>
                        </CardTitle>
                        <CardDescription>
                          Taux de présence et absences par période
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5" />
                          <span>Rapport Financier</span>
                        </CardTitle>
                        <CardDescription>
                          État des paiements et revenus
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5" />
                          <span>Rapport Observations</span>
                        </CardTitle>
                        <CardDescription>
                          Résumé des observations et comportements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>Rapport Annuel</span>
                        </CardTitle>
                        <CardDescription>
                          Rapport complet de l'année scolaire
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Générer
                        </Button>
                      </CardContent>
                    </Card>
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