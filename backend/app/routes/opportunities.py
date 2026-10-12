from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models import Opportunity, Registration
from .helpers import current_user, parse_date, validation_error


opportunities_bp = Blueprint("opportunities", __name__)


@opportunities_bp.get("")
def list_opportunities():
    query = Opportunity.query
    if request.args.get("organization_id"):
        query = query.filter_by(organization_id=request.args.get("organization_id", type=int))
    items = []
    for opportunity in query.order_by(Opportunity.activity_date).all():
        data = opportunity.to_dict()
        data["registered"] = len(opportunity.registrations)
        data["available"] = max(0, opportunity.slots - data["registered"])
        items.append(data)
    return jsonify(opportunities=items)


@opportunities_bp.post("")
@jwt_required()
def create_opportunity():
    user = current_user()
    if user.role != "ong" or not user.organization:
        return jsonify(error="Somente uma conta de ONG pode publicar oportunidades."), 403
    data = request.get_json(silent=True) or {}
    required = ["title", "description", "category", "date", "time", "location", "slots"]
    if any(data.get(field) in (None, "") for field in required):
        return validation_error("Preencha todos os campos obrigatórios da oportunidade.")
    try:
        slots = int(data["slots"])
        activity_date = parse_date(data["date"], "date")
    except (TypeError, ValueError) as error:
        return validation_error(str(error))
    if slots < 1:
        return validation_error("A oportunidade precisa ter pelo menos uma vaga.")

    opportunity = Opportunity(
        organization_id=user.organization.id,
        title=str(data["title"]).strip(),
        description=str(data["description"]).strip(),
        category=str(data["category"]).strip(),
        activity_date=activity_date,
        activity_time=str(data["time"]).strip(),
        location=str(data["location"]).strip(),
        slots=slots,
        requirements=str(data.get("requirements", "")).strip(),
    )
    db.session.add(opportunity)
    db.session.commit()
    return jsonify(opportunity=opportunity.to_dict()), 201


@opportunities_bp.post("/<int:opportunity_id>/registrations")
@jwt_required()
def register_for_opportunity(opportunity_id):
    user = current_user()
    if user.role != "user":
        return jsonify(error="Entre com uma conta de usuário para se inscrever."), 403
    opportunity = db.get_or_404(Opportunity, opportunity_id)
    if len(opportunity.registrations) >= opportunity.slots:
        return validation_error("As vagas desta oportunidade foram preenchidas.")

    registration = Registration(user_id=user.id, opportunity_id=opportunity.id)
    db.session.add(registration)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return validation_error("Você já está inscrito nesta oportunidade.")
    return jsonify(registration=registration.to_dict()), 201


@opportunities_bp.get("/registrations/me")
@jwt_required()
def my_registrations():
    user = current_user()
    registrations = Registration.query.filter_by(user_id=user.id).order_by(Registration.id.desc()).all()
    return jsonify(registrations=[item.to_dict() for item in registrations])


@opportunities_bp.get("/registrations/organization")
@jwt_required()
def organization_registrations():
    user = current_user()
    if user.role != "ong" or not user.organization:
        return jsonify(error="Acesso exclusivo para contas de ONG."), 403
    registrations = (
        Registration.query.join(Opportunity)
        .filter(Opportunity.organization_id == user.organization.id)
        .order_by(Registration.id.desc()).all()
    )
    return jsonify(registrations=[item.to_dict() for item in registrations])
