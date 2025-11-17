import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, Calendar, LogOut } from 'lucide-react';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  // Загружаем данные при открытии
  useEffect(() => {
    // Загружаем оценки студента
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    const myGrades = allGrades.filter((grade: any) => grade.studentName === user.name);
    setGrades(myGrades);

    // Загружаем расписание
    const allSchedule = JSON.parse(localStorage.getItem('schedule') || '[]');
    setSchedule(allSchedule);
  }, [user]);

  // Функция для цвета оценки
  const getGradeColor = (grade: number) => {
    if (grade >= 4) return 'default';
    if (grade >= 3) return 'secondary';
    return 'destructive';
  };

  // Дни недели
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Студенческий портал</h1>
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
        {/* Информация о студенте */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Информация о студенте</span>
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
              <span>Успеваемость</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Расписание</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Вкладка с оценками */}
          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Мои оценки</CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Оценок пока нет</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Оценка</TableHead>
                        <TableHead>Дата</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>
                            <Badge variant={getGradeColor(grade.grade)}>
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
          <TabsContent value="schedule" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {days.map((day) => {
                const daySchedule = schedule.filter(item => item.day === day);
                return (
                  <Card key={day}>
                    <CardHeader>
                      <CardTitle className="text-lg">{day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {daySchedule.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Нет занятий</p>
                      ) : (
                        <div className="space-y-3">
                          {daySchedule.map((item) => (
                            <div key={item.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">{item.subject}</h4>
                                <Badge variant="outline">{item.time}</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-2">
                                <p>Аудитория: {item.room}</p>
                                <p>Преподаватель: {item.teacher}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};