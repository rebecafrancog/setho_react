from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from ..extensions import db
from ..models import User


def current_user():
    return db.session.get(User, int(get_jwt_identity()))


def validation_error(message):
    return jsonify(error=message), 400


def parse_date(value, field_name="data"):
    from datetime import date

    try:
        return date.fromisoformat(value)
    except (TypeError, ValueError):
        raise ValueError(f"O campo {field_name} deve usar o formato AAAA-MM-DD.")
