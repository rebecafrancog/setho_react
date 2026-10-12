# feed do usuário, com rotas para listar organizações e oportunidades
from flask import Blueprint, request, jsonify
from models import Organization, Opportunity

feed_bp = Blueprint('feed', __name__, url_prefix='/api')

@feed_bp.route('/orgs', methods=['GET'])
def get_organizations():
    category = request.args.get('category')
    city = request.args.get('city')

    query = Organization.query
    if category:
        query = query.filter_by(category=category)
    if city:
        query = query.filter(Organization.city.ilike(f"%{city}%"))

    orgs = query.all()
    return jsonify([org.to_dict() for org in orgs]), 200


@feed_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    category = request.args.get('category')
    query = Opportunity.query.filter_by(status='Ativo')
    
    if category:
        query = query.filter_by(category=category)

    opportunities = query.all()
    return jsonify([opp.to_dict() for opp in opportunities]), 200