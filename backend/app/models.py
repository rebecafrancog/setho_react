from datetime import date, datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


class SerializerMixin:
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    organization = db.relationship("Organization", back_populates="owner", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        data = super().to_dict()
        data.pop("password_hash", None)
        data["organization_id"] = self.organization.id if self.organization else None
        return data


class Organization(db.Model, SerializerMixin):
    __tablename__ = "organizations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    mission = db.Column(db.Text, nullable=False, default="")
    history = db.Column(db.Text, nullable=False, default="")
    image = db.Column(db.String(255), default="/setho.jpeg")
    cover = db.Column(db.String(255), default="/community.jpg")
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    owner = db.relationship("User", back_populates="organization")
    projects = db.relationship("Project", back_populates="organization", cascade="all, delete-orphan")
    opportunities = db.relationship("Opportunity", back_populates="organization", cascade="all, delete-orphan")


class Project(db.Model, SerializerMixin):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    objective = db.Column(db.Text, default="")
    audience = db.Column(db.String(180), default="")
    goal = db.Column(db.Float, nullable=False, default=0)
    raised = db.Column(db.Float, nullable=False, default=0)
    deadline = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(30), default="Ativo")
    image = db.Column(db.String(255), default="/setho.jpeg")

    organization = db.relationship("Organization", back_populates="projects")


class Opportunity(db.Model, SerializerMixin):
    __tablename__ = "opportunities"

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    activity_date = db.Column(db.Date, nullable=False)
    activity_time = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(180), nullable=False)
    slots = db.Column(db.Integer, nullable=False)
    requirements = db.Column(db.Text, default="")
    status = db.Column(db.String(30), default="Ativo")

    organization = db.relationship("Organization", back_populates="opportunities")
    registrations = db.relationship("Registration", back_populates="opportunity", cascade="all, delete-orphan")


class Registration(db.Model, SerializerMixin):
    __tablename__ = "registrations"
    __table_args__ = (db.UniqueConstraint("user_id", "opportunity_id"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"), nullable=False)
    status = db.Column(db.String(30), default="Inscrito")
    registered_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User")
    opportunity = db.relationship("Opportunity", back_populates="registrations")


class Donation(db.Model, SerializerMixin):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default="Confirmada")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User")
    organization = db.relationship("Organization")
    project = db.relationship("Project")
