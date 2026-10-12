# rota para voluntários se inscreverem em oportunidades
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Opportunity, Registration

volunteer_bp = Blueprint('volunteer', __name__, url_prefix='/api/opportunities')

@volunteer_bp.route('/<int:opp_id>/register', methods=['POST'])
@jwt_required()
def register_for_opportunity(opp_id):
    identity = get_jwt_identity()
    opp = Opportunity.query.get_or_404(opp_id)

    if len(opp.registrations) >= opp.slots:
        return jsonify({"error": "Vagas esgotadas para esta oportunidade"}), 400

    already_registered = Registration.query.filter_by(
        user_id=identity['id'], 
        opportunity_id=opp_id
    ).first()
    
    if already_registered:
        return jsonify({"error": "Você já está inscrito nesta oportunidade"}), 400

    reg = Registration(user_id=identity['id'], opportunity_id=opp_id)
    db.session.add(reg)
    db.session.commit()

    return jsonify({"message": "Inscrição realizada com sucesso!"}), 201