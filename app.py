import streamlit as st
import json
import os
from datetime import datetime
import pandas as pd

# Импорт модулей
from database import Database
from models import User, Grade, Schedule

# Настройка страницы
st.set_page_config(
    page_title="Aristotel",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Инициализация базы данных
db = Database()

def init_session_state():
    """Инициализация состояния сессии"""
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    if 'user' not in st.session_state:
        st.session_state.user = None
    if 'page' not in st.session_state:
        st.session_state.page = 'login'

def login_page():
    """Страница авторизации"""
    st.title("🎓 Aristotel")
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.subheader("Вход в систему")
        
        # Форма входа
        with st.form("login_form"):
            email = st.text_input("Email", placeholder="student@university.edu")
            password = st.text_input("Пароль", type="password", placeholder="password")
            login_button = st.form_submit_button("Войти", use_container_width=True)
            
            if login_button:
                user = db.authenticate_user(email, password)
                if user:
                    st.session_state.authenticated = True
                    st.session_state.user = user
                    st.session_state.page = f"{user.role}_dashboard"
                    st.rerun()
                else:
                    st.error("Неверный email или пароль")
        
        st.markdown("---")
        
        # Форма регистрации
        st.subheader("Регистрация")
        with st.form("register_form"):
            reg_name = st.text_input("Имя", placeholder="Иван Петров")
            reg_email = st.text_input("Email для регистрации", placeholder="new@university.edu")
            reg_password = st.text_input("Пароль для регистрации", type="password")
            reg_role = st.selectbox("Роль", ["student", "teacher"], format_func=lambda x: "Студент" if x == "student" else "Преподаватель")
            register_button = st.form_submit_button("Зарегистрироваться", use_container_width=True)
            
            if register_button:
                if reg_name and reg_email and reg_password:
                    success = db.register_user(reg_email, reg_name, reg_role, reg_password)
                    if success:
                        st.success("Регистрация успешна! Теперь можете войти в систему.")
                    else:
                        st.error("Пользователь с таким email уже существует")
                else:
                    st.error("Заполните все поля")
        
        # Демо данные
        st.markdown("---")
        st.info("""
        **Демо аккаунты для тестирования:**
        
        **Студент:**
        - Email: student@university.edu
        - Пароль: password
        
        **Преподаватель:**
        - Email: teacher@university.edu  
        - Пароль: password
        """)

def student_dashboard():
    """Панель студента"""
    st.title(f"👨‍🎓 Панель студента: {st.session_state.user.name}")
    
    # Боковая панель
    with st.sidebar:
        st.write(f"**Пользователь:** {st.session_state.user.name}")
        st.write(f"**Роль:** Студент")
        st.write(f"**Email:** {st.session_state.user.email}")
        
        if st.button("Выйти", use_container_width=True):
            st.session_state.authenticated = False
            st.session_state.user = None
            st.session_state.page = 'login'
            st.rerun()
    
    # Вкладки
    tab1, tab2 = st.tabs(["📊 Мои оценки", "📅 Расписание"])
    
    with tab1:
        st.subheader("Мои оценки")
        grades = db.get_student_grades(st.session_state.user.id)
        
        if grades:
            # Создаем DataFrame для отображения
            grades_data = []
            for grade in grades:
                teacher = db.get_user_by_id(grade.teacher_id)
                grades_data.append({
                    "Предмет": grade.subject,
                    "Оценка": grade.grade,
                    "Преподаватель": teacher.name if teacher else "Неизвестно",
                    "Дата": grade.created_at.strftime("%d.%m.%Y")
                })
            
            df = pd.DataFrame(grades_data)
            st.dataframe(df, use_container_width=True, hide_index=True)
            
            # Статистика
            col1, col2, col3 = st.columns(3)
            with col1:
                avg_grade = sum(g.grade for g in grades) / len(grades)
                st.metric("Средний балл", f"{avg_grade:.2f}")
            with col2:
                st.metric("Всего оценок", len(grades))
            with col3:
                excellent_grades = len([g for g in grades if g.grade == 5])
                st.metric("Отличных оценок", excellent_grades)
        else:
            st.info("У вас пока нет оценок")
    
    with tab2:
        st.subheader("Расписание занятий")
        schedule = db.get_all_schedule()
        
        if schedule:
            # Группируем по дням недели
            days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
            
            for day in days:
                day_schedule = [s for s in schedule if s.day_of_week == day]
                if day_schedule:
                    st.write(f"**{day}**")
                    for item in sorted(day_schedule, key=lambda x: x.time_slot):
                        teacher = db.get_user_by_id(item.teacher_id)
                        teacher_name = teacher.name if teacher else "Неизвестно"
                        st.write(f"- {item.time_slot}: {item.subject} (ауд. {item.room}) - {teacher_name}")
                    st.write("")
        else:
            st.info("Расписание пока не составлено")

def teacher_dashboard():
    """Панель преподавателя"""
    st.title(f"👩‍🏫 Панель преподавателя: {st.session_state.user.name}")
    
    # Боковая панель
    with st.sidebar:
        st.write(f"**Пользователь:** {st.session_state.user.name}")
        st.write(f"**Роль:** Преподаватель")
        st.write(f"**Email:** {st.session_state.user.email}")
        
        if st.button("Выйти", use_container_width=True):
            st.session_state.authenticated = False
            st.session_state.user = None
            st.session_state.page = 'login'
            st.rerun()
    
    # Вкладки
    tab1, tab2, tab3 = st.tabs(["📊 Управление оценками", "📅 Управление расписанием", "👥 Студенты"])
    
    with tab1:
        st.subheader("Управление оценками")
        
        # Добавление новой оценки
        st.write("**Выставить оценку:**")
        col1, col2 = st.columns(2)
        
        with col1:
            students = db.get_students()
            student_options = {f"{s.name} ({s.email})": s.id for s in students}
            selected_student = st.selectbox("Выберите студента", list(student_options.keys()))
            subject = st.text_input("Предмет", placeholder="Математика")
        
        with col2:
            grade = st.selectbox("Оценка", [1, 2, 3, 4, 5])
            if st.button("Выставить оценку", use_container_width=True):
                if selected_student and subject:
                    student_id = student_options[selected_student]
                    success = db.add_grade(student_id, subject, grade, st.session_state.user.id)
                    if success:
                        st.success("Оценка успешно выставлена!")
                        st.rerun()
                    else:
                        st.error("Ошибка при выставлении оценки")
                else:
                    st.error("Заполните все поля")
        
        st.markdown("---")
        
        # Список всех оценок
        st.write("**Все оценки:**")
        all_grades = db.get_all_grades()
        
        if all_grades:
            grades_data = []
            for grade in all_grades:
                student = db.get_user_by_id(grade.student_id)
                teacher = db.get_user_by_id(grade.teacher_id)
                grades_data.append({
                    "Студент": student.name if student else "Неизвестно",
                    "Предмет": grade.subject,
                    "Оценка": grade.grade,
                    "Преподаватель": teacher.name if teacher else "Неизвестно",
                    "Дата": grade.created_at.strftime("%d.%m.%Y")
                })
            
            df = pd.DataFrame(grades_data)
            st.dataframe(df, use_container_width=True, hide_index=True)
        else:
            st.info("Оценок пока нет")
    
    with tab2:
        st.subheader("Управление расписанием")
        
        # Добавление нового занятия
        st.write("**Добавить занятие:**")
        col1, col2 = st.columns(2)
        
        with col1:
            subject = st.text_input("Предмет для расписания", placeholder="Физика")
            day = st.selectbox("День недели", ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"])
        
        with col2:
            time_slot = st.text_input("Время", placeholder="09:00-10:30")
            room = st.text_input("Аудитория", placeholder="101")
        
        if st.button("Добавить в расписание", use_container_width=True):
            if subject and day and time_slot and room:
                success = db.add_schedule(subject, day, time_slot, room, st.session_state.user.id)
                if success:
                    st.success("Занятие добавлено в расписание!")
                    st.rerun()
                else:
                    st.error("Ошибка при добавлении занятия")
            else:
                st.error("Заполните все поля")
        
        st.markdown("---")
        
        # Текущее расписание
        st.write("**Текущее расписание:**")
        schedule = db.get_all_schedule()
        
        if schedule:
            schedule_data = []
            for item in schedule:
                teacher = db.get_user_by_id(item.teacher_id)
                schedule_data.append({
                    "День": item.day_of_week,
                    "Время": item.time_slot,
                    "Предмет": item.subject,
                    "Аудитория": item.room,
                    "Преподаватель": teacher.name if teacher else "Неизвестно"
                })
            
            df = pd.DataFrame(schedule_data)
            st.dataframe(df, use_container_width=True, hide_index=True)
        else:
            st.info("Расписание пока не составлено")
    
    with tab3:
        st.subheader("Список студентов")
        students = db.get_students()
        
        if students:
            students_data = []
            for student in students:
                grades = db.get_student_grades(student.id)
                avg_grade = sum(g.grade for g in grades) / len(grades) if grades else 0
                students_data.append({
                    "Имя": student.name,
                    "Email": student.email,
                    "Количество оценок": len(grades),
                    "Средний балл": f"{avg_grade:.2f}" if avg_grade > 0 else "Нет оценок"
                })
            
            df = pd.DataFrame(students_data)
            st.dataframe(df, use_container_width=True, hide_index=True)
        else:
            st.info("Студентов пока нет")

def main():
    """Главная функция приложения"""
    init_session_state()
    
    # Маршрутизация
    if not st.session_state.authenticated:
        login_page()
    else:
        if st.session_state.user.role == 'student':
            student_dashboard()
        elif st.session_state.user.role == 'teacher':
            teacher_dashboard()

if __name__ == "__main__":
    main()