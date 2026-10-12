from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Organization
from .helpers import current_user, validation_error


organizations_bp = Blueprint("organizations", __name__)


@organizations_bp.get("")
def list_organizations():
    query = Organization.query
    if request.args.get("city"):
        query = query.filter_by(city=request.args["city"])
    if request.args.get("category"):
        query = query.filter_by(category=request.args["category"])
    search = request.args.get("q", "").strip()
    if search:
        query = query.filter(Organization.name.ilike(f"%{search}%"))
    return jsonify(organizations=[item.to_dict() for item in query.order_by(Organization.name).all()])


@organizations_bp.get("/<int:organization_id>")
def get_organization(organization_id):
    organization = db.get_or_404(Organization, organization_id)
    data = organization.to_dict()
    data["projects"] = [project.to_dict() for project in organization.projects]
    data["opportunities"] = [item.to_dict() for item in organization.opportunities]
    return jsonify(organization=data)


@organizations_bp.patch("/<int:organization_id>")
@jwt_required()
def update_organization(organization_id):
    organization = db.get_or_404(Organization, organization_id)
    user = current_user()
    if user.role != "ong" or organization.owner_id != user.id:
        return jsonify(error="Você não pode editar esta ONG."), 403

    data = request.get_json(silent=True) or {}
    allowed = {"name", "city", "district", "category", "description", "mission", "history", "image", "cover"}
    for field in allowed:
        if field in data:
            value = str(data[field]).strip()
            if not value and field in {"name", "city", "district", "category", "description"}:
                return validation_error(f"O campo {field} não pode ficar vazio.")
            setattr(organization, field, value)
    db.session.commit()
    return jsonify(organization=organization.to_dict())
