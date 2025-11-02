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

// Mock data pour démonstration
const mockStats = {
  totalStudents: 245,
  presentToday: 232,
  absentToday: 13,
  totalTeachers: 18,
  totalClasses: 12,
  monthlyRevenue: 2450000,
  pendingPayments: 450000,
  unreadNotifications: 8
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    setTimeout(() => setIsLoading(false), 1500)

    return () => clearInterval(timer)
  }, [])

  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students', label: 'Élèves', icon: GraduationCap },
    { id: 'teachers', label: 'Enseignants', icon: Users },
    { id: 'classes', label: 'Classes', icon: BookOpen },
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
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Chargement...</h2>
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
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">ERP Scolaire Premium</h1>
                  <p className="text-sm text-gray-600 font-medium">École Excellence • Nouakchott</p>
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
                {mockStats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center text-xs font-bold text-white bg-gradient-primary rounded-full shadow-soft animate-pulse-soft">
                    {mockStats.unreadNotifications}
                  </span>
                )}
              </Button>

              <div className="hidden lg:block h-8 w-px bg-gray-300" />

              <div className="hidden lg:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      +12%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalStudents}</p>
                    <p className="text-sm text-gray-600">Total Élèves</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      95%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-green-600">{mockStats.presentToday}</p>
                    <p className="text-sm text-gray-600">Présents aujourd'hui</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-accent-600" />
                    </div>
                    <div className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                      Actif
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalTeachers}</p>
                    <p className="text-sm text-gray-600">Enseignants</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl hover:shadow-medium transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DollarSign className="h-6 w-6 text-accent-600" />
                    </div>
                    <div className="text-xs font-semibold text-danger-600 bg-danger-50 px-2 py-1 rounded-full">
                      -{Math.round((mockStats.pendingPayments / mockStats.monthlyRevenue) * 100)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{(mockStats.monthlyRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">Revenus mensuels (MRU)</p>
                  </div>
                </div>
              </div>

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
                    {mockRecentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-200 group cursor-pointer hover:shadow-soft"
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.status === 'urgent' ? 'bg-danger-100' :
                            activity.status === 'important' ? 'bg-accent-100' :
                            'bg-primary-100'
                          }`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {activity.student}
                            </p>
                            <p className="text-xs text-gray-500">{activity.class} • {activity.time}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          activity.status === 'urgent' ? 'bg-danger-100 text-danger-700' :
                          activity.status === 'important' ? 'bg-accent-100 text-accent-700' :
                          'bg-primary-100 text-primary-700'
                        }`}>
                          {activity.status === 'urgent' ? 'Urgent' :
                           activity.status === 'important' ? 'Important' : 'Normal'}
                        </span>
                      </div>
                    ))}
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
          {/* Classes */}
            <TabsContent value="classes" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle classe
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockClasses.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <Badge variant="outline">{classItem.level}</Badge>
                      </div>
                      <CardDescription>Professeur: {classItem.teacher}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Élèves inscrits:</span>
                          <span className="font-medium">{classItem.students}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Capacité:</span>
                          <span className="font-medium">{classItem.capacity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de remplissage:</span>
                          <span className="font-medium">
                            {Math.round((classItem.students / classItem.capacity) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(classItem.students / classItem.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
          {/* Autres onglets avec contenu placeholder */}
            {['notifications', 'settings'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(item => item.id === tab)?.label}
                  </h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Module {menuItems.find(item => item.id === tab)?.label}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Cette fonctionnalité est en cours de développement.
                      </p>
                      <p className="text-sm text-gray-400">
                        Le module complet sera disponible avec la gestion des {menuItems.find(item => item.id === tab)?.label.toLowerCase()},
                        les rapports détaillés et les fonctionnalités avancées.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}