from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Donation, Organization, Project
from .helpers import current_user, validation_error


donations_bp = Blueprint("donations", __name__)


@donations_bp.post("")
@jwt_required()
def create_donation():
    user = current_user()
    if user.role != "user":
        return jsonify(error="Entre com uma conta de usuário para doar."), 403
    data = request.get_json(silent=True) or {}
    organization = db.session.get(Organization, data.get("organization_id"))
    if not organization:
        return validation_error("ONG não encontrada.")
    try:
        amount = round(float(data.get("amount", 0)), 2)
    except (TypeError, ValueError):
        return validation_error("Informe um valor válido.")
    if amount < 1:
        return validation_error("A doação mínima é R$ 1,00.")

    project = None
    if data.get("project_id"):
        project = db.session.get(Project, data["project_id"])
        if not project or project.organization_id != organization.id:
            return validation_error("O projeto não pertence à ONG informada.")

    donation = Donation(
        user_id=user.id,
        organization_id=organization.id,
        project_id=project.id if project else None,
        amount=amount,
        status="Confirmada",
    )
    db.session.add(donation)
    if project:
        project.raised += amount
    db.session.commit()
    return jsonify(
        message="Doação simulada registrada. Nenhuma cobrança foi realizada.",
        donation=donation.to_dict(),
    ), 201


@donations_bp.get("/me")
@jwt_required()
def my_donations():
    user = current_user()
    donations = Donation.query.filter_by(user_id=user.id).order_by(Donation.id.desc()).all()
    return jsonify(donations=[item.to_dict() for item in donations])


@donations_bp.get("/received")
@jwt_required()
def received_donations():
    user = current_user()
    if user.role != "ong" or not user.organization:
        return jsonify(error="Acesso exclusivo para contas de ONG."), 403
    donations = Donation.query.filter_by(organization_id=user.organization.id).order_by(Donation.id.desc()).all()
    return jsonify(donations=[item.to_dict() for item in donations])
