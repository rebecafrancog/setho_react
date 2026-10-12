from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Project
from .helpers import current_user, parse_date, validation_error


projects_bp = Blueprint("projects", __name__)


@projects_bp.get("")
def list_projects():
    query = Project.query
    if request.args.get("organization_id"):
        query = query.filter_by(organization_id=request.args.get("organization_id", type=int))
    return jsonify(projects=[project.to_dict() for project in query.order_by(Project.id.desc()).all()])


@projects_bp.get("/<int:project_id>")
def get_project(project_id):
    return jsonify(project=db.get_or_404(Project, project_id).to_dict())


@projects_bp.post("")
@jwt_required()
def create_project():
    user = current_user()
    if user.role != "ong" or not user.organization:
        return jsonify(error="Somente uma conta de ONG pode cadastrar projetos."), 403
    data = request.get_json(silent=True) or {}
    required = ["title", "description", "goal", "deadline"]
    if any(data.get(field) in (None, "") for field in required):
        return validation_error("Informe título, descrição, meta e prazo.")
    try:
        goal = float(data["goal"])
        deadline = parse_date(data["deadline"], "deadline")
    except (TypeError, ValueError) as error:
        return validation_error(str(error))
    if goal <= 0:
        return validation_error("A meta deve ser maior que zero.")

    project = Project(
        organization_id=user.organization.id,
        title=str(data["title"]).strip(),
        description=str(data["description"]).strip(),
        objective=str(data.get("objective", "")).strip(),
        audience=str(data.get("audience", "")).strip(),
        goal=goal,
        deadline=deadline,
        image=str(data.get("image", "/setho.jpeg")),
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project=project.to_dict()), 201


@projects_bp.patch("/<int:project_id>")
@jwt_required()
def update_project(project_id):
    project = db.get_or_404(Project, project_id)
    user = current_user()
    if not user.organization or project.organization_id != user.organization.id:
        return jsonify(error="Você não pode editar este projeto."), 403
    data = request.get_json(silent=True) or {}
    for field in {"title", "description", "objective", "audience", "status", "image"}:
        if field in data:
            setattr(project, field, str(data[field]).strip())
    if "goal" in data:
        project.goal = float(data["goal"])
    if "deadline" in data:
        project.deadline = parse_date(data["deadline"], "deadline")
    db.session.commit()
    return jsonify(project=project.to_dict())
