import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Grade } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const GradesView: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'student') {
      const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
      const studentGrades = allGrades.filter((grade: Grade) => grade.studentId === user.studentId);
      setGrades(studentGrades);
    }
  }, [user]);

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 4.5) return 'default';
    if (grade >= 3.5) return 'secondary';
    if (grade >= 2.5) return 'outline';
    return 'destructive';
  };

  const getGradeText = (grade: number) => {
    if (grade >= 4.5) return 'Отлично';
    if (grade >= 3.5) return 'Хорошо';
    if (grade >= 2.5) return 'Удовлетворительно';
    return 'Неудовлетворительно';
  };

  const averageGrade = grades.length > 0 
    ? (grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Общая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}</div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Количество оценок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades.length}</div>
            <p className="text-sm text-muted-foreground">Всего оценок</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мои оценки</CardTitle>
          <CardDescription>История всех полученных оценок</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Оценок пока нет</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Предмет</TableHead>
                  <TableHead>Оценка</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Преподаватель</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getGradeBadgeVariant(grade.grade)}>
                        {grade.grade} - {getGradeText(grade.grade)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(grade.date).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>{grade.teacherName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};