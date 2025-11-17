// Простые типы данных для нашего приложения
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface Grade {
  id: string;
  studentName: string;
  subject: string;
  grade: number;
  date: string;
}

export interface Schedule {
  id: string;
  subject: string;
  time: string;
  day: string;
  room: string;
  teacher: string;
}