from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from database import Base
from sqlalchemy import String

class Posts(Base):
    __tablename__='Posts'

    id_post: Mapped[int] = mapped_column(primary_key=True)
    foto: Mapped[str]
    headerP: Mapped[str]
    contentP: Mapped[str]

class Specialty(Base):
    __tablename__='Specialty'
    id_specialty: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]
    Teacher: Mapped[list['Teacher']] = relationship(back_populates="specialty")

class Teacher(Base):
    __tablename__='Teacher'
    id_teacher: Mapped[int] = mapped_column(primary_key=True)
    surname: Mapped[str]
    name: Mapped[str]
    id_specialty: Mapped[int] = mapped_column(ForeignKey('Specialty.id_specialty'))
    specialty: Mapped['Specialty'] = relationship(back_populates='Teacher')