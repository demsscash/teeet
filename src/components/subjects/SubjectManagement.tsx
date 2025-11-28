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
  Book,
  Users,
  FileText,
  Award
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  nameAr: string
  maxScore: number
  coefficient: number
  classId: string
  teacherId: string | null
  class: {
    id: string
    name: string
    level: string
  }
  teacher?: {
    id: string
    firstName: string
    lastName: string
  } | null
  _count: {
    grades: number
  }
}

interface Class {
  id: string
  name: string
  level: string
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    maxScore: 20,
    coefficient: 1,
    classId: '',
    teacherId: 'none'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSubjects()
    fetchClasses()
    fetchTeachers()
  }, [])

  useEffect(() => {
    const filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.class.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredSubjects(filtered)
  }, [searchQuery, subjects])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (!response.ok) throw new Error('Failed to fetch subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les matières",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Failed to fetch classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
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
      nameAr: '',
      maxScore: 20,
      coefficient: 1,
      classId: '',
      teacherId: 'none'
    })
  }

  const handleCreateSubject = async () => {
    try {
      const response = await fetch('/api/subjects', {
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
        throw new Error(error.error || 'Failed to create subject')
      }

      const newSubject = await response.json()
      setSubjects([...subjects, newSubject])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Succès",
        description: "Matière créée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer la matière",
        variant: "destructive",
      })
    }
  }

  const handleEditSubject = async () => {
    if (!editingSubject) return

    try {
      const response = await fetch(`/api/subjects/${editingSubject.id}`, {
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
        throw new Error(error.error || 'Failed to update subject')
      }

      const updatedSubject = await response.json()
      setSubjects(subjects.map(subject => subject.id === updatedSubject.id ? updatedSubject : subject))
      setIsEditDialogOpen(false)
      setEditingSubject(null)
      resetForm()
      toast({
        title: "Succès",
        description: "Matière mise à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour la matière",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete subject')
      }

      setSubjects(subjects.filter(subject => subject.id !== subjectId))
      toast({
        title: "Succès",
        description: "Matière supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer la matière",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      nameAr: subject.nameAr,
      maxScore: subject.maxScore,
      coefficient: subject.coefficient,
      classId: subject.classId,
      teacherId: subject.teacherId || 'none'
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Matières</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle matière
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
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Matières</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle matière
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle matière</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle matière.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la matière</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mathématiques"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameAr">Nom en arabe (optionnel)</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="الرياضيات"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maxScore">Note maximale</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 20 })}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coefficient">Coefficient</Label>
                  <Input
                    id="coefficient"
                    type="number"
                    value={formData.coefficient}
                    onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="classId">Classe</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Enseignant responsable</Label>
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
              <Button type="button" onClick={handleCreateSubject} disabled={!formData.name || !formData.classId}>
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
          placeholder="Rechercher une matière..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Book className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucune matière trouvée' : 'Aucune matière créée'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par créer votre première matière'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une matière
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Badge variant="outline">{subject.class.name}</Badge>
                      <Badge variant="secondary">Coef. {subject.coefficient}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{subject.maxScore}</span>
                    </div>
                    <p className="text-xs text-gray-500">max</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subject.teacher && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Enseignant:</span> {subject.teacher.firstName} {subject.teacher.lastName}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Notes:</span>
                    </div>
                    <span className="font-medium">{subject._count.grades}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(subject)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Modifier la matière</DialogTitle>
                        <DialogDescription>
                          Mettez à jour les informations de la matière.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Nom de la matière</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Mathématiques"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-nameAr">Nom en arabe (optionnel)</Label>
                          <Input
                            id="edit-nameAr"
                            value={formData.nameAr}
                            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                            placeholder="الرياضيات"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-maxScore">Note maximale</Label>
                            <Input
                              id="edit-maxScore"
                              type="number"
                              value={formData.maxScore}
                              onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 20 })}
                              min="1"
                              max="100"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-coefficient">Coefficient</Label>
                            <Input
                              id="edit-coefficient"
                              type="number"
                              value={formData.coefficient}
                              onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) || 1 })}
                              min="1"
                              max="10"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-classId">Classe</Label>
                          <Select
                            value={formData.classId}
                            onValueChange={(value) => setFormData({ ...formData, classId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une classe" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name} - {cls.level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-teacherId">Enseignant responsable</Label>
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
                        <Button type="button" onClick={handleEditSubject} disabled={!formData.name || !formData.classId}>
                          Mettre à jour
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={subject._count.grades > 0}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. La matière "{subject.name}" sera définitivement supprimée.
                          {subject._count.grades > 0 && (
                            <span className="block mt-2 text-red-600">
                              ⚠️ Attention: Cette matière contient {subject._count.grades} note(s).
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={subject._count.grades > 0}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}