from datetime import date

from .extensions import db
from .models import Opportunity, Organization, Project, User


def seed_database():
    """Cria contas e registros demonstrativos sem duplicá-los."""
    if User.query.filter_by(email="usuario@setho.com").first():
        return False

    user = User(name="Eloisa Silva", email="usuario@setho.com", city="João Pessoa", role="user")
    user.set_password("123456")

    owner = User(name="Ana Souza", email="ong@setho.com", city="João Pessoa", role="ong")
    owner.set_password("123456")
    db.session.add_all([user, owner])
    db.session.flush()

    organization = Organization(
        owner_id=owner.id,
        name="Instituto Vida Nova",
        city="João Pessoa",
        district="Mangabeira",
        category="Educação",
        description="Reforço escolar, cultura e acolhimento para crianças e adolescentes.",
        mission="Promover educação e oportunidades para um futuro melhor.",
        history="Desde 2012, construindo novas possibilidades com a comunidade.",
    )
    db.session.add(organization)
    db.session.flush()

    project = Project(
        organization_id=organization.id,
        title="Aprender para crescer",
        description="Espaço de leitura e aprendizagem para a comunidade.",
        objective="Atender crianças com atividades no contraturno escolar.",
        audience="Crianças de 6 a 14 anos",
        goal=15000,
        raised=6750,
        deadline=date(2027, 12, 30),
    )
    opportunity = Opportunity(
        organization_id=organization.id,
        title="Compartilhe conhecimento",
        description="Ajude crianças com leitura e atividades escolares.",
        category="Educação",
        activity_date=date(2027, 10, 17),
        activity_time="09:00",
        location="Sede do Instituto Vida Nova",
        slots=12,
        requirements="Ter 18 anos ou mais e gostar de ensinar.",
    )
    db.session.add_all([project, opportunity])
    db.session.commit()
    return True
