# exemplo de modelos para o banco de dados usando SQLAlchemy
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(50), nullable=False)  # ex: 'educação', 'saúde', 'meio ambiente'
    description = db.Column(db.Text, nullable=False)
    mission = db.Column(db.Text, nullable=True)
    history = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True, default='/setho.jpeg')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relacionamentos
    needs = db.relationship('Need', backref='organization', cascade='all, delete-orphan', lazy=True)
    opportunities = db.relationship('Opportunity', backref='organization', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "city": self.city,
            "district": self.district,
            "category": self.category,
            "description": self.description,
            "mission": self.mission,
            "history": self.history,
            "image": self.image_url
        }


class Need(db.Model):
    """Campanhas de arrecadação e doação"""
    __tablename__ = 'needs'

    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    goal = db.Column(db.Float, nullable=False)           # meta financeira em reais
    raised = db.Column(db.Float, default=0.0)            # valor arrecadado
    deadline = db.Column(db.String(20), nullable=True)   # ex: '2026-12-20'
    category = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='Ativo')   # 'ativo', 'concluído'
    image_url = db.Column(db.String(255), nullable=True, default='/setho.jpeg')

    def to_dict(self):
        return {
            "id": self.id,
            "org_id": self.org_id,
            "title": self.title,
            "description": self.description,
            "goal": self.goal,
            "raised": self.raised,
            "deadline": self.deadline,
            "category": self.category,
            "status": self.status,
            "image": self.image_url
        }


class Opportunity(db.Model):
    """Vagas e ações de voluntariado"""
    __tablename__ = 'opportunities'

    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(20), nullable=False)       # Ex: '2026-10-17'
    time = db.Column(db.String(10), nullable=False)       # Ex: '09:00'
    location = db.Column(db.String(200), nullable=False)
    slots = db.Column(db.Integer, nullable=False)        # quantidade de vagas
    requirements = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='Ativo')

    # Relacionamento de inscrições de voluntários
    registrations = db.relationship('Registration', backref='opportunity', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "org_id": self.org_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "date": self.date,
            "time": self.time,
            "location": self.location,
            "slots": self.slots,
            "requirements": self.requirements,
            "status": self.status,
            "available_slots": self.slots - len(self.registrations)
        }


class Registration(db.Model):
    """Inscrição de usuários em vagas de voluntariado"""
    __tablename__ = 'registrations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    status = db.Column(db.String(20), default='Confirmado')
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)