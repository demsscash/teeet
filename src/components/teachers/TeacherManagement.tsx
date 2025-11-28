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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  Upload,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  email: string
  phone?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  employeeId?: string
  teacherClasses?: {
    class: {
      id: string
      name: string
      level: string
    }
  }[]
  taughtSubjects?: {
    id: string
    name: string
    class: {
      name: string
    }
  }[]
}

interface Class {
  id: string
  name: string
  level: string
}

export default function TeacherManagement() {
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  // Delete modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)

  // Formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    email: '',
    phone: '',
    password: '',
    speciality: '',
    hireDate: '',
    classes: [] as string[],
    subjects: [] as any[],
    isActive: true
  })

  // Charger les données depuis l'API
  useEffect(() => {
    fetchTeachers()
    fetchClasses()
  }, [])

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchTerm, selectedStatus])

  const fetchTeachers = async () => {
    try {
      setLoading(true)

      // Utiliser l'API principale qui retourne tous les enseignants
      const response = await fetch('/api/teachers')
      if (!response.ok) throw new Error('Failed to fetch teachers')
      const data = await response.json()
      setTeachers(data.teachers)
      setFilteredTeachers(data.teachers)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les enseignants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Failed to fetch classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les classes",
        variant: "destructive",
      })
    }
  }

  const filterTeachers = () => {
    let filtered = teachers

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(teacher =>
        selectedStatus === 'active' ? teacher.isActive : !teacher.isActive
      )
    }

    setFilteredTeachers(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation client-side
    console.log('Form validation:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password ? 'provided' : 'missing'
    })

    // En mode modification, le mot de passe n'est pas requis
    // En mode création, le mot de passe n'est plus requis pour les enseignants
    if (!formData.firstName || !formData.lastName || !formData.email) {
      const missingFields = []
      if (!formData.firstName) missingFields.push('Prénom')
      if (!formData.lastName) missingFields.push('Nom')
      if (!formData.email) missingFields.push('Email')

      toast({
        title: "Erreur de validation",
        description: `Champs manquants: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingTeacher) {
        // Mode modification
        const response = await fetch(`/api/teachers/${editingTeacher.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            firstNameAr: formData.firstNameAr,
            lastNameAr: formData.lastNameAr,
            email: formData.email,
            phone: formData.phone,
            isActive: formData.isActive,
            classes: formData.classes,
            subjects: formData.subjects
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Teacher update error:', errorData)
          throw new Error(errorData.error || 'Failed to update teacher')
        }

        const updatedTeacher = await response.json()
        setTeachers(teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t))
        // Mettre à jour aussi la liste filtrée
        setFilteredTeachers(prev => prev.map(t => t.id === editingTeacher.id ? updatedTeacher : t))

        toast({
          title: "Enseignant modifié avec succès",
          description: `${formData.firstName} ${formData.lastName} a été modifié avec succès${formData.classes.length > 0 ? ` - Classes: ${formData.classes.map(id => classes.find(c => c.id === id)?.name).join(', ')}` : ''}${formData.subjects.length > 0 ? ` - Matières: ${formData.subjects.map(s => s.name).join(', ')}` : ''}`,
        })

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          firstNameAr: '',
          lastNameAr: '',
          email: '',
          phone: '',
          password: '',
          speciality: '',
          hireDate: '',
          classes: [],
          subjects: [],
          isActive: true
        })
        setEditingTeacher(null)
        setIsAddDialogOpen(false)
      } else {
        // Mode ajout
        console.log('Sending teacher data:', formData)
        const response = await fetch('/api/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Teacher creation error:', errorData)
          throw new Error(errorData.error || 'Failed to create teacher')
        }

        const newTeacher = await response.json()
        setTeachers([...teachers, newTeacher])

        toast({
          title: "Enseignant ajouté avec succès",
          description: `${formData.firstName} ${formData.lastName} a été ajouté avec succès${formData.email ? ` - Email: ${formData.email}` : ''}${formData.classes.length > 0 ? ` - Classes: ${formData.classes.map(id => classes.find(c => c.id === id)?.name).join(', ')}` : ''}${formData.subjects.length > 0 ? ` - Matières: ${formData.subjects.map(s => s.name).join(', ')}` : ''}`,
          variant: "success",
        })
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        firstNameAr: '',
        lastNameAr: '',
        email: '',
        phone: '',
        password: '',
        speciality: '',
        hireDate: '',
        classes: [],
        subjects: [],
        isActive: true
      })
      setEditingTeacher(null)
      setIsAddDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'enseignant",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      firstNameAr: teacher.firstNameAr || '',
      lastNameAr: teacher.lastNameAr || '',
      email: teacher.email,
      phone: teacher.phone || '',
      password: '',
      speciality: '',
      hireDate: '',
      classes: teacher.teacherClasses?.map(tc => tc.class.id) || [],
      subjects: teacher.taughtSubjects?.map(ts => ({
        name: ts.name,
        classId: ts.class.id || ''
      })) || [],
      isActive: teacher.isActive
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteTeacher = (teacher: Teacher) => {
    setTeacherToDelete(teacher)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTeacher = async () => {
    if (teacherToDelete) {
      try {
        const response = await fetch(`/api/teachers/${teacherToDelete.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete teacher')

        setTeachers(teachers.filter(teacher => teacher.id !== teacherToDelete.id))

        toast({
          title: "Enseignant supprimé",
          description: `${teacherToDelete.firstName} ${teacherToDelete.lastName} a été supprimé avec succès`,
          variant: "destructive",
        })

        setDeleteDialogOpen(false)
        setTeacherToDelete(null)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'enseignant",
          variant: "destructive",
        })
      }
    }
  }

  const toggleTeacherStatus = async (teacher: Teacher) => {
    try {
      const response = await fetch(`/api/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          firstNameAr: teacher.firstNameAr || '',
          lastNameAr: teacher.lastNameAr || '',
          email: teacher.email,
          phone: teacher.phone || '',
          isActive: !teacher.isActive
        }),
      })

      if (!response.ok) throw new Error('Failed to update teacher status')

      const updatedTeacher = await response.json()

      // Update the teacher in the list
      setTeachers(teachers.map(t =>
        t.id === teacher.id ? { ...t, isActive: !t.isActive } : t
      ))

      toast({
        title: "Statut mis à jour",
        description: `${teacher.firstName} ${teacher.lastName} est maintenant ${!teacher.isActive ? 'actif' : 'inactif'}`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'enseignant",
        variant: "destructive",
      })
    }
  }

  const cancelDeleteTeacher = () => {
    setDeleteDialogOpen(false)
    setTeacherToDelete(null)
  }

  const handleStatusChange = async (teacher: Teacher, newStatus: boolean) => {
    try {
      // Mode modification - à implémenter plus tard
      toast({
        title: "Fonctionnalité à venir",
        description: "La modification du statut sera bientôt disponible",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      })
    }
  }

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', classId: '', maxScore: 20, coefficient: 1 }]
    })
  }

  const updateSubject = (index: number, field: string, value: any) => {
    const updatedSubjects = [...formData.subjects]
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value }
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des enseignants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h2>
          <p className="text-gray-600">
            {teachers.length} enseignant{teachers.length > 1 ? 's' : ''} inscrit{teachers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un enseignant
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {teachers.length}
            </div>
            <p className="text-sm text-gray-600">Total enseignants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Enseignants actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {teachers.filter(t => !t.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Enseignants inactifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {teachers.filter(t => t.lastLogin && new Date(t.lastLogin).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-sm text-gray-600">Connectés aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des enseignants */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Liste des enseignants</CardTitle>
          <CardDescription className="text-sm">
            {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Nom</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Classes</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Matières</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-2.5 font-medium text-xs text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                          {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{teacher.firstName} {teacher.lastName}</p>
                          {teacher.firstNameAr && teacher.lastNameAr && (
                            <p className="text-xs text-gray-500" dir="rtl">
                              {teacher.firstNameAr} {teacher.lastNameAr}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center space-x-1.5">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{teacher.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {teacher.teacherClasses && teacher.teacherClasses.length > 0 ? (
                          teacher.teacherClasses.map((tc, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {tc.class.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Non assigné</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {teacher.taughtSubjects && teacher.taughtSubjects.length > 0 ? (
                          teacher.taughtSubjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                              {subject.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Aucune</span>
                        )}
                        {teacher.taughtSubjects && teacher.taughtSubjects.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{teacher.taughtSubjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${teacher.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <Badge className={`text-xs px-2 py-1 ${teacher.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                          {teacher.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 w-7 p-0 ${teacher.isActive ? 'hover:bg-orange-50 hover:text-orange-600' : 'hover:bg-green-50 hover:text-green-600'}`}
                          onClick={() => toggleTeacherStatus(teacher)}
                          title={teacher.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {teacher.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600" onClick={() => handleEdit(teacher)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteTeacher(teacher)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'ajout/modification */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? 'Modifiez les informations de l\'enseignant'
                : 'Remplissez les informations pour ajouter un nouvel enseignant'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informations de base</TabsTrigger>
                <TabsTrigger value="assignment">Affectations</TabsTrigger>
                <TabsTrigger value="account">Compte</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstNameAr">Prénom (arabe)</Label>
                    <Input
                      id="firstNameAr"
                      value={formData.firstNameAr}
                      onChange={(e) => setFormData({ ...formData, firstNameAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastNameAr">Nom (arabe)</Label>
                    <Input
                      id="lastNameAr"
                      value={formData.lastNameAr}
                      onChange={(e) => setFormData({ ...formData, lastNameAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="speciality">Spécialité</Label>
                    <Input
                      id="speciality"
                      value={formData.speciality}
                      onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hireDate">Date d'embauche</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="assignment" className="space-y-4">
                <div>
                  <Label>Classes assignées</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={classItem.id}
                          checked={formData.classes.includes(classItem.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                classes: [...formData.classes, classItem.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                classes: formData.classes.filter(id => id !== classItem.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={classItem.id} className="text-sm">
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Matières enseignées</Label>
                    <Button type="button" variant="outline" onClick={addSubject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une matière
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Input
                          placeholder="Nom de la matière"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, 'name', e.target.value)}
                          className="flex-1"
                        />
                        <Select
                          value={subject.classId}
                          onValueChange={(value) => updateSubject(index, 'classId', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Classe" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((classItem) => (
                              <SelectItem key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubject(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive">Compte actif</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingTeacher ? 'Modifier' : 'Ajouter'} l'enseignant
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'enseignant "{teacherToDelete?.firstName} {teacherToDelete?.lastName}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={cancelDeleteTeacher}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTeacher}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}