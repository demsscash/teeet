'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Class {
  id: string
  name: string
  level: string
  capacity: number
  teacherId?: string | null
  teacher?: {
    id: string
    firstName: string
    lastName: string
  } | null
  _count: {
    students: number
  }
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  _count: {
    managedClasses: number
  }
}

export default function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    capacity: 40,
    teacherId: 'none'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchClasses()
    fetchTeachers()
  }, [])

  useEffect(() => {
    const filtered = classes.filter(cls =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.teacher?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       cls.teacher?.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredClasses(filtered)
  }, [searchQuery, classes])

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
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers/available')
      if (!response.ok) throw new Error('Failed to fetch teachers')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      capacity: 40,
      teacherId: 'none'
    })
  }

  const handleCreateClass = async () => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teacherId: formData.teacherId === 'none' ? null : formData.teacherId
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create class')
      }

      const newClass = await response.json()
      setClasses([...classes, newClass])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Succès",
        description: "Classe créée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer la classe",
        variant: "destructive",
      })
    }
  }

  const handleEditClass = async () => {
    if (!editingClass) return

    try {
      const response = await fetch(`/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teacherId: formData.teacherId === 'none' ? null : formData.teacherId
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update class')
      }

      const updatedClass = await response.json()
      setClasses(classes.map(cls => cls.id === updatedClass.id ? updatedClass : cls))
      setIsEditDialogOpen(false)
      setEditingClass(null)
      resetForm()
      toast({
        title: "Succès",
        description: "Classe mise à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour la classe",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete class')
      }

      setClasses(classes.filter(cls => cls.id !== classId))
      toast({
        title: "Succès",
        description: "Classe supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer la classe",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls)
    setFormData({
      name: cls.name,
      level: cls.level,
      capacity: cls.capacity,
      teacherId: cls.teacherId || 'none'
    })
    setIsEditDialogOpen(true)
  }

  const getCapacityColor = (capacity: number, students: number) => {
    const percentage = (students / capacity) * 100
    if (percentage >= 100) return 'text-red-600 bg-red-50'
    if (percentage >= 90) return 'text-orange-600 bg-orange-50'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle classe
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle classe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle classe</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle classe.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la classe</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: CM1-A"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="Ex: Primaire, Secondaire"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                  min="1"
                  max="100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher">Enseignant responsable</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun enseignant</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={handleCreateClass} disabled={!formData.name || !formData.level}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une classe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucune classe trouvée' : 'Aucune classe créée'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par créer votre première classe'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une classe
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const fillPercentage = (cls._count.students / cls.capacity) * 100
            const isOverCapacity = fillPercentage > 100

            return (
              <Card key={cls.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <Badge variant="outline">{cls.level}</Badge>
                  </div>
                  <CardDescription>
                    {cls.teacher
                      ? `Professeur: ${cls.teacher.firstName} ${cls.teacher.lastName}`
                      : 'Aucun enseignant assigné'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Élèves:</span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${getCapacityColor(cls.capacity, cls._count.students)}`}>
                        {cls._count.students}/{cls.capacity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Taux de remplissage</span>
                        <span>{Math.round(fillPercentage)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverCapacity ? 'bg-red-500' :
                            fillPercentage >= 90 ? 'bg-orange-500' :
                            fillPercentage >= 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {isOverCapacity && (
                      <div className="flex items-center space-x-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>Capacité dépassée</span>
                      </div>
                    )}

                    {fillPercentage >= 90 && fillPercentage <= 100 && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>Presque pleine</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditDialog(cls)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Modifier la classe</DialogTitle>
                          <DialogDescription>
                            Mettez à jour les informations de la classe.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nom de la classe</Label>
                            <Input
                              id="edit-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ex: CM1-A"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-level">Niveau</Label>
                            <Input
                              id="edit-level"
                              value={formData.level}
                              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                              placeholder="Ex: Primaire, Secondaire"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-capacity">Capacité</Label>
                            <Input
                              id="edit-capacity"
                              type="number"
                              value={formData.capacity}
                              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                              min="1"
                              max="100"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-teacher">Enseignant responsable</Label>
                            <Select
                              value={formData.teacherId}
                              onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un enseignant" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Aucun enseignant</SelectItem>
                                {teachers.map((teacher) => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.firstName} {teacher.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="button" onClick={handleEditClass} disabled={!formData.name || !formData.level}>
                            Mettre à jour
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. La classe "{cls.name}" sera définitivement supprimée.
                            {cls._count.students > 0 && (
                              <span className="block mt-2 text-orange-600">
                                ⚠️ Attention: Cette classe contient {cls._count.students} élève(s).
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteClass(cls.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}