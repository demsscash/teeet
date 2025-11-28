'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  GraduationCap,
  BookOpen,
  Book,
  Calendar,
  Bell,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  UserX,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { EcolyLogo } from '@/components/ui/ecoly-logo'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import StudentManagement from '@/components/students/StudentManagement'
import GradeManagement from '@/components/grades/GradeManagement'
import ObservationManagement from '@/components/observations/ObservationManagement'
import AttendanceManagement from '@/components/attendance/AttendanceManagement'
import TeacherManagement from '@/components/teachers/TeacherManagement'
import FinanceManagement from '@/components/finance/FinanceManagement'
import DocumentGenerator from '@/components/documents/DocumentGenerator'
import MeetingManagement from '@/components/meetings/MeetingManagement'
import SubjectManagement from '@/components/subjects/SubjectManagement'
import ClassManagement from '@/components/classes/ClassManagement'
import SettingsManagement from '@/components/settings/SettingsManagement'
import UserMenu from '@/components/navigation/UserMenu'

// Interface pour les statistiques
interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalTeachers: number
  activeTeachers: number
  totalClasses: number
  attendancePercentage: number
  todayAttendances: number
  recentGrades: number
  recentActivities: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    icon: string
    color: string
  }>
}

const mockRecentActivities = [
  { id: 1, type: 'absence', student: 'Mohamed Salem', class: 'CM2', time: '08:30', status: 'urgent' },
  { id: 2, type: 'grade', student: 'Fatima Bint', class: 'CE1', time: '10:15', status: 'normal' },
  { id: 3, type: 'observation', student: 'Ahmed Ould', class: 'CP2', time: '11:45', status: 'important' },
  { id: 4, type: 'payment', student: 'Mariam Sow', class: 'CM1', time: '14:20', status: 'normal' },
]

const mockClasses = [
  { id: 1, name: 'CP1', level: 'Primaire', students: 38, teacher: 'Mme. Diop', capacity: 40 },
  { id: 2, name: 'CP2', level: 'Primaire', students: 42, teacher: 'M. Ba', capacity: 40 },
  { id: 3, name: 'CE1', level: 'Primaire', students: 35, teacher: 'Mme. Fall', capacity: 40 },
  { id: 4, name: 'CE2', level: 'Primaire', students: 39, teacher: 'M. Ndiaye', capacity: 40 },
  { id: 5, name: 'CM1', level: 'Primaire', students: 41, teacher: 'Mme. Sarr', capacity: 40 },
  { id: 6, name: 'CM2', level: 'Primaire', students: 40, teacher: 'M. Sy', capacity: 40 },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    fetchDashboardStats()

    return () => clearInterval(timer)
  }, [])

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats from /api/stats...')
      const response = await fetch('/api/stats')
      console.log('API response status:', response.status)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      console.log('API response data:', data)
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students', label: 'Élèves', icon: GraduationCap },
    { id: 'teachers', label: 'Enseignants', icon: Users },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'subjects', label: 'Matières', icon: Book },
    { id: 'grades', label: 'Notes', icon: FileText },
    { id: 'attendance', label: 'Présences', icon: UserCheck },
    { id: 'observations', label: 'Observations', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'important': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'absence': return <UserX className="h-4 w-4 text-red-500" />
      case 'grade': return <FileText className="h-4 w-4 text-blue-500" />
      case 'observation': return <MessageSquare className="h-4 w-4 text-orange-500" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 animate-bounce-soft">
            <EcolyLogo size="lg" className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Ecoly - Chargement...</h2>
          <p className="text-gray-600">Préparation de votre espace de travail</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header moderne avec glass effect */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4 text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-6">
                <EcolyLogo size="md" className="shadow-soft hover:shadow-medium transition-all duration-300" />
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Ecoly</h1>
                  <p className="text-sm text-gray-600 font-medium">Système de Gestion Scolaire</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Heure locale</p>
                  <p className="text-lg font-bold text-primary-600">
                    {currentTime.toLocaleTimeString('fr-MR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher élèves, classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 lg:w-80 transition-all duration-200 hover:bg-white hover:shadow-soft focus:shadow-medium"
                />
              </div>

              <Button variant="ghost" size="sm" className="relative group hover:bg-primary-50 transition-all duration-200">
                <Bell className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
              </Button>

              <div className="hidden lg:block h-8 w-px bg-gray-300" />

              <div className="flex items-center space-x-3">
                <UserMenu onSettingsClick={() => setActiveTab('settings')} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
          {/* Sidebar moderne */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-72 glass border-r border-white/20 min-h-screen`}>
            <nav className="p-6 space-y-2">
              <div className="mb-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation principale</p>
              </div>
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <Button
                    key={item.id}
                    className={`w-full justify-start group transition-all duration-200 mb-2 ${
                      isActive
                        ? 'bg-gradient-primary text-white shadow-soft hover:shadow-medium'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:translate-x-1'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <Icon className={`h-5 w-5 mr-3 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse-soft" />
                    )}
                  </Button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content moderne */}
          <main className="flex-1 p-6 lg:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tableau de bord moderne */}
            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gradient mb-2">Tableau de bord</h2>
                  <p className="text-gray-600">Vue d'ensemble de votre établissement</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-primary text-white border-0 px-4 py-2 shadow-soft">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Année 2024-2025
                  </Badge>
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="text-xs font-medium text-primary-600">
                      {currentTime.toLocaleDateString('fr-MR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards modernes */}
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Actifs
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                      <p className="text-sm text-gray-600">Total Élèves</p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {stats.attendancePercentage}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-green-600">{stats.todayAttendances}</p>
                      <p className="text-sm text-gray-600">Présents aujourd'hui</p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6 text-accent-600" />
                      </div>
                      <div className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                        Actifs
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
                      <p className="text-sm text-gray-600">Enseignants</p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="h-6 w-6 text-accent-600" />
                      </div>
                      <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        Total
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                      <p className="text-sm text-gray-600">Classes</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass p-6 rounded-2xl">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activités récentes modernes */}
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Activités récentes</h3>
                      <p className="text-sm text-gray-600 mt-1">Dernières activités du système</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                      Voir tout
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {stats && stats.recentActivities.length > 0 ? (
                      stats.recentActivities.map((activity, index) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-200 group cursor-pointer hover:shadow-soft"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-primary-100`}>
                              <div className={`w-2 h-2 bg-${activity.color}-600 rounded-full`}></div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {activity.title}
                              </p>
                              <p className="text-xs text-gray-500">{activity.description}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                          {stats ? 'Aucune activité récente' : 'Chargement des activités...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Classes modernes */}
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                      <p className="text-sm text-gray-600 mt-1">Aperçu des classes</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                      Gérer
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {mockClasses.map((classItem, index) => {
                      const fillPercentage = (classItem.students / classItem.capacity) * 100
                      const isOverCapacity = fillPercentage > 100
                      return (
                        <div
                          key={classItem.id}
                          className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-200 group cursor-pointer hover:shadow-soft"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {classItem.name}
                              </p>
                              <p className="text-xs text-gray-500">{classItem.teacher}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
                              isOverCapacity ? 'text-danger-600' :
                              fillPercentage > 90 ? 'text-accent-600' :
                              'text-primary-600'
                            }`}>
                              {classItem.students}/{classItem.capacity}
                            </p>
                            <div className="w-20 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isOverCapacity ? 'bg-gradient-danger' :
                                  fillPercentage > 90 ? 'bg-gradient-accent' :
                                  'bg-gradient-primary'
                                }`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(fillPercentage)}%
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Élèves */}
            <TabsContent value="students" className="space-y-6">
              <StudentManagement />
            </TabsContent>

            {/* Enseignants */}
            <TabsContent value="teachers" className="space-y-6">
              <TeacherManagement />
            </TabsContent>

            {/* Matières */}
            <TabsContent value="subjects" className="space-y-6">
              <SubjectManagement />
            </TabsContent>

          {/* Classes */}
            <TabsContent value="classes" className="space-y-6">
              <ClassManagement />
            </TabsContent>

            {/* Notes */}
            <TabsContent value="grades" className="space-y-6">
              <GradeManagement />
            </TabsContent>
            {/* Observations */}
            <TabsContent value="observations" className="space-y-6">
              <ObservationManagement />
            </TabsContent>
          {/* Présences */}
            <TabsContent value="attendance" className="space-y-6">
              <AttendanceManagement />
            </TabsContent>
          {/* Finance */}
            <TabsContent value="finance" className="space-y-6">
              <FinanceManagement />
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle notification
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Centre de notifications
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Gérez toutes les notifications de l'établissement
                    </p>
                    <p className="text-sm text-gray-400">
                      Recevez des alertes sur les présences, les notes, les paiements et plus encore.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <SettingsManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}