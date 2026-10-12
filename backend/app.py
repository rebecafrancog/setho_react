from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, 
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)

# configurações do banco e JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///setho.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'sua-chave-secreta-forte-aqui'

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)  # requisições de API

# modelos de user ou ong
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'user' ou 'ong'
    city = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "city": self.city
        }

with app.app_context():
    db.create_all()

# rotas de autenticação

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    required_fields = ['name', 'email', 'password', 'city', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios ausentes"}), 400

    if data['role'] not in ['user', 'ong']:
        return jsonify({"error": "Papel inválido. Escolha 'user' ou 'ong'"}), 400

    if User.query.filter_by(email=data['email'].strip().lower()).first():
        return jsonify({"error": "E-mail já cadastrado"}), 409

    user = User(
        name=data['name'].strip(),
        email=data['email'].strip().lower(),
        role=data['role'],
        city=data['city'].strip()
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Conta criada com sucesso", "user": user.to_dict()}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "E-mail ou senha incorretos."}), 401

    # dados de identidade do JWT
    identity_data = {
        "id": user.id,
        "role": user.role,
        "name": user.name
    }
    
    access_token = create_access_token(identity=identity_data)

    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    # rota para recuperar perfil a partir do token
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
        
    return jsonify(user.to_dict()), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)