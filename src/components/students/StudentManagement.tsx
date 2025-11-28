'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Filter,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react'

interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  dateOfBirth: string
  placeOfBirth?: string
  gender: 'MALE' | 'FEMALE'
  address?: string
  photo?: string
  isActive: boolean
  class?: {
    id: string
    name: string
    level: string
  }
  createdAt: string
}

interface Class {
  id: string
  name: string
  level: string
  capacity: number
  students: Student[]
}


export default function StudentManagement() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState('list')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  // Formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    address: '',
    classId: ''
  })

  // Charger les données depuis l'API
  useEffect(() => {
    fetchClasses()
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedClass])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data.students)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les élèves",
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

  const filterStudents = () => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class?.id === selectedClass)
    }

    setFilteredStudents(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingStudent) {
        // Mode modification
        const response = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            classId: formData.classId || null,
          }),
        })

        if (!response.ok) throw new Error('Failed to update student')

        const updatedStudent = await response.json()
        setStudents(students.map(student =>
          student.id === editingStudent.id ? updatedStudent : student
        ))

        toast({
          title: "Modification réussie",
          description: `Les informations de ${formData.firstName} ${formData.lastName} ont été mises à jour.`,
          variant: "success",
        })
      } else {
        // Mode ajout
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) throw new Error('Failed to create student')

        const newStudent = await response.json()
        setStudents([...students, newStudent])

        toast({
          title: "Ajout réussi",
          description: `${formData.firstName} ${formData.lastName} a été ajouté(e) avec succès à la classe ${classes.find(c => c.id === formData.classId)?.name}.`,
          variant: "success",
        })
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        firstNameAr: '',
        lastNameAr: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        address: '',
        classId: ''
      })
      setEditingStudent(null)
      setIsAddDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'élève",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      firstNameAr: student.firstNameAr || '',
      lastNameAr: student.lastNameAr || '',
      dateOfBirth: student.dateOfBirth,
      placeOfBirth: student.placeOfBirth || '',
      gender: student.gender,
      address: student.address || '',
      classId: student.class?.id || ''
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      setStudentToDelete(student)
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        const response = await fetch(`/api/students/${studentToDelete.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete student')

        setStudents(students.filter(student => student.id !== studentToDelete.id))

        toast({
          title: "Suppression réussie",
          description: `${studentToDelete.firstName} ${studentToDelete.lastName} a été supprimé(e) avec succès.`,
          variant: "success",
        })

        setDeleteDialogOpen(false)
        setStudentToDelete(null)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'élève",
          variant: "destructive",
        })
      }
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setStudentToDelete(null)
  }

  const getGenderBadge = (gender: string) => {
    return gender === 'MALE' 
      ? <Badge className="bg-blue-100 text-blue-800">Garçon</Badge>
      : <Badge className="bg-pink-100 text-pink-800">Fille</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des élèves...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h2>
          <p className="text-gray-600">
            {students.length} élève{students.length > 1 ? 's' : ''} inscrit{students.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingStudent(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel élève
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Modifier un élève' : 'Ajouter un nouvel élève'}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations de l'élève
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="french" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="french">Informations (FR)</TabsTrigger>
                    <TabsTrigger value="arabic">Informations (AR)</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="french" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="arabic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstNameAr">الاسم الأول</Label>
                        <Input
                          id="firstNameAr"
                          value={formData.firstNameAr}
                          onChange={(e) => setFormData({...formData, firstNameAr: e.target.value})}
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastNameAr">اسم العائلة</Label>
                        <Input
                          id="lastNameAr"
                          value={formData.lastNameAr}
                          onChange={(e) => setFormData({...formData, lastNameAr: e.target.value})}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexe *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Garçon</SelectItem>
                        <SelectItem value="FEMALE">Fille</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classId">Classe</Label>
                    <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id}>
                            {classItem.name} ({classItem.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingStudent ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, prénom ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des élèves */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des élèves</CardTitle>
          <CardDescription>
            {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">Numéro</th>
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Nom (Arabe)</th>
                  <th className="text-left p-3 font-medium">Date de naissance</th>
                  <th className="text-left p-3 font-medium">Sexe</th>
                  <th className="text-left p-3 font-medium">Classe</th>
                  <th className="text-left p-3 font-medium">Adresse</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{student.studentNumber}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                      </div>
                    </td>
                    <td className="p-3" dir="rtl">
                      <p className="font-medium">{student.firstNameAr} {student.lastNameAr}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </td>
                    <td className="p-3">{getGenderBadge(student.gender)}</td>
                    <td className="p-3">
                      {student.class ? (
                        <Badge variant="outline">{student.class.name}</Badge>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="truncate max-w-32">{student.address || '-'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun élève trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedClass !== 'all' 
                    ? 'Essayez de modifier vos filtres de recherche'
                    : 'Commencez par ajouter un nouvel élève'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{studentToDelete?.firstName} {studentToDelete?.lastName}</strong> ?
              <br />
              <span className="text-red-600">
                Cette action est irréversible et toutes les données associées à cet élève seront perdues.
              </span>
            </DialogDescription>
          </DialogHeader>

          {studentToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Numéro :</span>
                  <span className="text-sm text-gray-900">{studentToDelete.studentNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Classe :</span>
                  <span className="text-sm text-gray-900">{studentToDelete.class?.name || 'Non assigné'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Sexe :</span>
                  <span className="text-sm text-gray-900">
                    {studentToDelete.gender === 'MALE' ? 'Garçon' : 'Fille'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex-1 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}