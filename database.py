import json
import os
import hashlib
from typing import List, Optional
from models import User, Grade, Schedule

class Database:
    """Класс для работы с данными в JSON файлах"""
    
    def __init__(self):
        self.data_dir = "data"
        self.users_file = os.path.join(self.data_dir, "users.json")
        self.grades_file = os.path.join(self.data_dir, "grades.json")
        self.schedule_file = os.path.join(self.data_dir, "schedule.json")
        
        self._ensure_data_directory()
        self._initialize_demo_data()
    
    def _ensure_data_directory(self):
        """Создание директории для данных если она не существует"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def _hash_password(self, password: str) -> str:
        """Хеширование пароля"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _load_json(self, filename: str) -> list:
        """Загрузка данных из JSON файла"""
        if os.path.exists(filename):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return []
        return []
    
    def _save_json(self, filename: str, data: list):
        """Сохранение данных в JSON файл"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def _initialize_demo_data(self):
        """Инициализация демо данных"""
        # Проверяем, есть ли уже пользователи
        users_data = self._load_json(self.users_file)
        if not users_data:
            # Создаем демо пользователей
            demo_users = [
                User("student@university.edu", "Иван Петров", "student", self._hash_password("password")),
                User("teacher@university.edu", "Мария Иванова", "teacher", self._hash_password("password")),
                User("student2@university.edu", "Анна Сидорова", "student", self._hash_password("password"))
            ]
            
            users_data = [user.to_dict() for user in demo_users]
            self._save_json(self.users_file, users_data)
            
            # Создаем демо оценки
            demo_grades = [
                Grade(demo_users[0].id, "Математика", 5, demo_users[1].id),
                Grade(demo_users[0].id, "Физика", 4, demo_users[1].id),
                Grade(demo_users[0].id, "Химия", 5, demo_users[1].id),
                Grade(demo_users[2].id, "Математика", 4, demo_users[1].id),
                Grade(demo_users[2].id, "Физика", 3, demo_users[1].id)
            ]
            
            grades_data = [grade.to_dict() for grade in demo_grades]
            self._save_json(self.grades_file, grades_data)
            
            # Создаем демо расписание
            demo_schedule = [
                Schedule("Математика", "Понедельник", "09:00-10:30", "101", demo_users[1].id),
                Schedule("Физика", "Понедельник", "11:00-12:30", "102", demo_users[1].id),
                Schedule("Химия", "Вторник", "09:00-10:30", "103", demo_users[1].id),
                Schedule("Математика", "Среда", "10:00-11:30", "101", demo_users[1].id),
                Schedule("Физика", "Четверг", "14:00-15:30", "102", demo_users[1].id)
            ]
            
            schedule_data = [item.to_dict() for item in demo_schedule]
            self._save_json(self.schedule_file, schedule_data)
    
    # Методы для работы с пользователями
    def get_all_users(self) -> List[User]:
        """Получение всех пользователей"""
        users_data = self._load_json(self.users_file)
        return [User.from_dict(data) for data in users_data]
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Поиск пользователя по email"""
        users = self.get_all_users()
        for user in users:
            if user.email == email:
                return user
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Поиск пользователя по ID"""
        users = self.get_all_users()
        for user in users:
            if user.id == user_id:
                return user
        return None
    
    def get_students(self) -> List[User]:
        """Получение всех студентов"""
        users = self.get_all_users()
        return [user for user in users if user.role == 'student']
    
    def get_teachers(self) -> List[User]:
        """Получение всех преподавателей"""
        users = self.get_all_users()
        return [user for user in users if user.role == 'teacher']
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Аутентификация пользователя"""
        user = self.get_user_by_email(email)
        if user and user.password_hash == self._hash_password(password):
            return user
        return None
    
    def register_user(self, email: str, name: str, role: str, password: str) -> bool:
        """Регистрация нового пользователя"""
        if self.get_user_by_email(email):
            return False  # Пользователь уже существует
        
        users_data = self._load_json(self.users_file)
        new_user = User(email, name, role, self._hash_password(password))
        users_data.append(new_user.to_dict())
        self._save_json(self.users_file, users_data)
        return True
    
    # Методы для работы с оценками
    def get_all_grades(self) -> List[Grade]:
        """Получение всех оценок"""
        grades_data = self._load_json(self.grades_file)
        return [Grade.from_dict(data) for data in grades_data]
    
    def get_student_grades(self, student_id: str) -> List[Grade]:
        """Получение оценок конкретного студента"""
        grades = self.get_all_grades()
        return [grade for grade in grades if grade.student_id == student_id]
    
    def add_grade(self, student_id: str, subject: str, grade: int, teacher_id: str) -> bool:
        """Добавление новой оценки"""
        try:
            grades_data = self._load_json(self.grades_file)
            new_grade = Grade(student_id, subject, grade, teacher_id)
            grades_data.append(new_grade.to_dict())
            self._save_json(self.grades_file, grades_data)
            return True
        except Exception:
            return False
    
    # Методы для работы с расписанием
    def get_all_schedule(self) -> List[Schedule]:
        """Получение всего расписания"""
        schedule_data = self._load_json(self.schedule_file)
        return [Schedule.from_dict(data) for data in schedule_data]
    
    def add_schedule(self, subject: str, day_of_week: str, time_slot: str, room: str, teacher_id: str) -> bool:
        """Добавление нового занятия в расписание"""
        try:
            schedule_data = self._load_json(self.schedule_file)
            new_schedule = Schedule(subject, day_of_week, time_slot, room, teacher_id)
            schedule_data.append(new_schedule.to_dict())
            self._save_json(self.schedule_file, schedule_data)
            return True
        except Exception:
            return False