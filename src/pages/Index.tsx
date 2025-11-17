import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { StudentDashboard } from '@/components/StudentDashboard';
import { TeacherDashboard } from '@/components/TeacherDashboard';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Функция входа
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Функция выхода
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не вошел, показываем форму входа
  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Если пользователь студент, показываем панель студента
  if (currentUser.role === 'student') {
    return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // Если пользователь преподаватель, показываем панель преподавателя
  if (currentUser.role === 'teacher') {
    return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // В остальных случаях показываем форму входа
  return <AuthForm onLogin={handleLogin} />;
}