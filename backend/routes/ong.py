# rotas para contas do tipo ONG, incluindo criação de perfil e publicação de oportunidades
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, Opportunity

ong_bp = Blueprint('ong', __name__, url_prefix='/api/ong')

@ong_bp.route('/profile', methods=['POST'])
@jwt_required()
def setup_ong_profile():
    identity = get_jwt_identity()
    if identity.get('role') != 'ong':
        return jsonify({"error": "Acesso restrito a contas do tipo ONG"}), 403

    existing = Organization.query.filter_by(user_id=identity['id']).first()
    if existing:
        return jsonify({"error": "Perfil de ONG já cadastrado para esta conta"}), 400

    data = request.get_json() or {}
    org = Organization(
        user_id=identity['id'],
        name=data.get('name'),
        city=data.get('city'),
        district=data.get('district'),
        category=data.get('category'),
        description=data.get('description'),
        mission=data.get('mission'),
        history=data.get('history')
    )
    db.session.add(org)
    db.session.commit()

    return jsonify({"message": "Perfil criado com sucesso", "org": org.to_dict()}), 201


@ong_bp.route('/opportunities', methods=['POST'])
@jwt_required()
def create_opportunity():
    identity = get_jwt_identity()
    if identity.get('role') != 'ong':
        return jsonify({"error": "Acesso não autorizado"}), 403

    org = Organization.query.filter_by(user_id=identity['id']).first()
    if not org:
        return jsonify({"error": "Cadastre os dados da sua ONG antes de publicar vagas"}), 400

    data = request.get_json() or {}
    required = ['title', 'description', 'category', 'date', 'time', 'location', 'slots']
    if not all(k in data for k in required):
        return jsonify({"error": "Todos os campos obrigatórios devem ser preenchidos"}), 400

    opportunity = Opportunity(
        org_id=org.id,
        title=data['title'],
        description=data['description'],
        category=data['category'],
        date=data['date'],
        time=data['time'],
        location=data['location'],
        slots=int(data['slots']),
        requirements=data.get('requirements', '')
    )
    db.session.add(opportunity)
    db.session.commit()

    return jsonify({"message": "Vaga publicada com sucesso", "opportunity": opportunity.to_dict()}), 201