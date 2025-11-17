from datetime import datetime
from typing import Optional
import uuid

class User:
    """Модель пользователя (студент или преподаватель)"""
    
    def __init__(self, email: str, name: str, role: str, password_hash: str, user_id: str = None):
        self.id = user_id or str(uuid.uuid4())
        self.email = email
        self.name = name
        self.role = role  # 'student' или 'teacher'
        self.password_hash = password_hash
        self.created_at = datetime.now()
    
    def to_dict(self) -> dict:
        """Преобразование объекта в словарь для JSON"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'password_hash': self.password_hash,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        """Создание объекта из словаря"""
        user = cls(
            email=data['email'],
            name=data['name'],
            role=data['role'],
            password_hash=data['password_hash'],
            user_id=data['id']
        )
        user.created_at = datetime.fromisoformat(data['created_at'])
        return user

class Grade:
    """Модель оценки"""
    
    def __init__(self, student_id: str, subject: str, grade: int, teacher_id: str, grade_id: str = None):
        self.id = grade_id or str(uuid.uuid4())
        self.student_id = student_id
        self.subject = subject
        self.grade = grade
        self.teacher_id = teacher_id
        self.created_at = datetime.now()
    
    def to_dict(self) -> dict:
        """Преобразование объекта в словарь для JSON"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'subject': self.subject,
            'grade': self.grade,
            'teacher_id': self.teacher_id,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Grade':
        """Создание объекта из словаря"""
        grade = cls(
            student_id=data['student_id'],
            subject=data['subject'],
            grade=data['grade'],
            teacher_id=data['teacher_id'],
            grade_id=data['id']
        )
        grade.created_at = datetime.fromisoformat(data['created_at'])
        return grade

class Schedule:
    """Модель расписания"""
    
    def __init__(self, subject: str, day_of_week: str, time_slot: str, room: str, teacher_id: str, schedule_id: str = None):
        self.id = schedule_id or str(uuid.uuid4())
        self.subject = subject
        self.day_of_week = day_of_week
        self.time_slot = time_slot
        self.room = room
        self.teacher_id = teacher_id
        self.created_at = datetime.now()
    
    def to_dict(self) -> dict:
        """Преобразование объекта в словарь для JSON"""
        return {
            'id': self.id,
            'subject': self.subject,
            'day_of_week': self.day_of_week,
            'time_slot': self.time_slot,
            'room': self.room,
            'teacher_id': self.teacher_id,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Schedule':
        """Создание объекта из словаря"""
        schedule = cls(
            subject=data['subject'],
            day_of_week=data['day_of_week'],
            time_slot=data['time_slot'],
            room=data['room'],
            teacher_id=data['teacher_id'],
            schedule_id=data['id']
        )
        schedule.created_at = datetime.fromisoformat(data['created_at'])
        return schedule