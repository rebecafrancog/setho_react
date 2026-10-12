from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required

from ..extensions import db
from ..models import Organization, User
from .helpers import current_user, validation_error


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    required = ["name", "email", "password", "city"]
    missing = [field for field in required if not str(data.get(field, "")).strip()]
    if missing:
        return validation_error("Preencha: " + ", ".join(missing) + ".")

    email = data["email"].strip().lower()
    if User.query.filter_by(email=email).first():
        return validation_error("Este e-mail já está cadastrado.")
    if len(data["password"]) < 6:
        return validation_error("A senha deve ter pelo menos 6 caracteres.")

    role = data.get("role", "user")
    if role not in {"user", "ong"}:
        return validation_error("O tipo de conta deve ser user ou ong.")

    user = User(name=data["name"].strip(), email=email, city=data["city"].strip(), role=role)
    user.set_password(data["password"])
    db.session.add(user)
    db.session.flush()

    if role == "ong":
        organization_data = data.get("organization") or {}
        organization = Organization(
            owner_id=user.id,
            name=organization_data.get("name", data["name"]).strip(),
            city=organization_data.get("city", data["city"]).strip(),
            district=organization_data.get("district", "Não informado").strip(),
            category=organization_data.get("category", "Outras").strip(),
            description=organization_data.get("description", "ONG cadastrada no SETHO.").strip(),
            mission=organization_data.get("mission", "").strip(),
            history=organization_data.get("history", "").strip(),
        )
        db.session.add(organization)

    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(str(data.get("password", ""))):
        return jsonify(error="E-mail ou senha incorretos."), 401

    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, user=user.to_dict())


@auth_bp.get("/me")
@jwt_required()
def me():
    user = current_user()
    return jsonify(user=user.to_dict())
