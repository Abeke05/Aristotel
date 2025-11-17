import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, Calendar, LogOut, Plus, Trash2 } from 'lucide-react';

interface TeacherDashboardProps {
  user: any;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  
  // Состояния для формы оценок
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  
  // Состояния для формы расписания
  const [scheduleSubject, setScheduleSubject] = useState('');
  const [scheduleDay, setScheduleDay] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleRoom, setScheduleRoom] = useState('');

  // Загружаем данные при открытии
  useEffect(() => {
    // Загружаем студентов
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = allUsers.filter((u: any) => u.role === 'student');
    setStudents(studentUsers);

    // Загружаем оценки
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    setGrades(allGrades);

    // Загружаем расписание
    const allSchedule = JSON.parse(localStorage.getItem('schedule') || '[]');
    setSchedule(allSchedule);
  }, []);

  // Функция добавления оценки
  const handleAddGrade = () => {
    if (!selectedStudent || !subject || !gradeValue) {
      alert('Заполните все поля');
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;

    const newGrade = {
      id: Date.now().toString(),
      studentName: student.name,
      subject: subject,
      grade: parseInt(gradeValue),
      date: new Date().toLocaleDateString('ru-RU'),
    };

    const updatedGrades = [...grades, newGrade];
    setGrades(updatedGrades);
    localStorage.setItem('grades', JSON.stringify(updatedGrades));

    // Очищаем форму
    setSelectedStudent('');
    setSubject('');
    setGradeValue('');
    
    alert('Оценка добавлена');
  };

  // Функция добавления расписания
  const handleAddSchedule = () => {
    if (!scheduleSubject || !scheduleDay || !scheduleTime || !scheduleRoom) {
      alert('Заполните все поля');
      return;
    }

    const newScheduleItem = {
      id: Date.now().toString(),
      subject: scheduleSubject,
      day: scheduleDay,
      time: scheduleTime,
      room: scheduleRoom,
      teacher: user.name,
    };

    const updatedSchedule = [...schedule, newScheduleItem];
    setSchedule(updatedSchedule);
    localStorage.setItem('schedule', JSON.stringify(updatedSchedule));

    // Очищаем форму
    setScheduleSubject('');
    setScheduleDay('');
    setScheduleTime('');
    setScheduleRoom('');
    
    alert('Занятие добавлено в расписание');
  };

  // Функция удаления занятия
  const handleDeleteSchedule = (scheduleId: string) => {
    const updatedSchedule = schedule.filter(s => s.id !== scheduleId);
    setSchedule(updatedSchedule);
    localStorage.setItem('schedule', JSON.stringify(updatedSchedule));
    alert('Занятие удалено');
  };

  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Преподавательский портал</h1>
                <p className="text-sm text-gray-500">Добро пожаловать, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Информация о преподавателе */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Информация о преподавателе</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Имя</p>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Вкладки */}
        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grades" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Управление оценками</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Управление расписанием</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Вкладка с оценками */}
          <TabsContent value="grades" className="mt-6 space-y-6">
            {/* Форма добавления оценки */}
            <Card>
              <CardHeader>
                <CardTitle>Выставить оценку</CardTitle>
                <CardDescription>Добавьте новую оценку студенту</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Студент</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите студента" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Предмет</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Название предмета"
                    />
                  </div>
                  <div>
                    <Label>Оценка</Label>
                    <Select value={gradeValue} onValueChange={setGradeValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите оценку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 - Отлично</SelectItem>
                        <SelectItem value="4">4 - Хорошо</SelectItem>
                        <SelectItem value="3">3 - Удовлетворительно</SelectItem>
                        <SelectItem value="2">2 - Неудовлетворительно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddGrade} className="w-full">
                      Добавить оценку
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Список оценок */}
            <Card>
              <CardHeader>
                <CardTitle>История оценок</CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Оценок пока нет</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Студент</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead>Дата</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.studentName}</TableCell>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>
                            <Badge variant={grade.grade >= 4 ? 'default' : grade.grade >= 3 ? 'secondary' : 'destructive'}>
                              {grade.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{grade.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Вкладка с расписанием */}
          <TabsContent value="schedule" className="mt-6 space-y-6">
            {/* Форма добавления занятия */}
            <Card>
              <CardHeader>
                <CardTitle>Добавить занятие</CardTitle>
                <CardDescription>Создайте новое занятие в расписании</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label>Предмет</Label>
                    <Input
                      value={scheduleSubject}
                      onChange={(e) => setScheduleSubject(e.target.value)}
                      placeholder="Название предмета"
                    />
                  </div>
                  <div>
                    <Label>День недели</Label>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите день" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Время</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Аудитория</Label>
                    <Input
                      value={scheduleRoom}
                      onChange={(e) => setScheduleRoom(e.target.value)}
                      placeholder="Номер аудитории"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddSchedule} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Список расписания */}
            <Card>
              <CardHeader>
                <CardTitle>Мое расписание</CardTitle>
              </CardHeader>
              <CardContent>
                {schedule.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Расписание пусто</p>
                ) : (
                  <div className="space-y-4">
                    {days.map((day) => {
                      const daySchedule = schedule.filter(s => s.day === day);
                      if (daySchedule.length === 0) return null;
                      
                      return (
                        <div key={day}>
                          <h3 className="font-semibold text-lg mb-2">{day}</h3>
                          <div className="space-y-2">
                            {daySchedule.map((item) => (
                              <div key={item.id} className="border rounded-lg p-3 flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{item.subject}</h4>
                                  <p className="text-sm text-gray-600">
                                    {item.time} • Аудитория {item.room}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSchedule(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};