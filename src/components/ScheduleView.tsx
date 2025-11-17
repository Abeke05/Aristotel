import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Schedule } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const ScheduleView: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'student') {
      const allSchedule = JSON.parse(localStorage.getItem('schedule') || '[]');
      // Для студента показываем расписание, где его группа включена
      const studentSchedule = allSchedule.filter((item: Schedule) => 
        item.studentGroups.includes(user.studentId || '')
      );
      setSchedule(studentSchedule);
    }
  }, [user]);

  const getScheduleByDay = (day: string) => {
    return schedule
      .filter(item => item.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Расписание занятий</CardTitle>
          <CardDescription>Ваше еженедельное расписание</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DAYS.map((day) => {
          const daySchedule = getScheduleByDay(day);
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                {daySchedule.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Нет занятий</p>
                ) : (
                  <div className="space-y-3">
                    {daySchedule.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{item.subject}</h4>
                          <Badge variant="outline">{item.time}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Аудитория: {item.room}</p>
                          <p>Преподаватель: {item.teacherName}</p>
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
    </div>
  );
};