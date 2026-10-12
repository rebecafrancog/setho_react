from flask import Flask, jsonify
import click
from dotenv import load_dotenv

from .config import Config
from .extensions import cors, db, jwt


def create_app(test_config=None):
    """Application Factory: cria e configura uma instância do Flask."""
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}},
    )

    from .routes.auth import auth_bp
    from .routes.donations import donations_bp
    from .routes.opportunities import opportunities_bp
    from .routes.organizations import organizations_bp
    from .routes.projects import projects_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(organizations_bp, url_prefix="/api/organizations")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(opportunities_bp, url_prefix="/api/opportunities")
    app.register_blueprint(donations_bp, url_prefix="/api/donations")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "application": "SETHO API"}

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify(error="Recurso não encontrado."), 404

    @app.errorhandler(422)
    def invalid_request(_error):
        return jsonify(error="Dados da requisição inválidos."), 422

    @app.cli.command("seed")
    def seed_command():
        """Preenche o banco com dados de demonstração."""
        from .seed import seed_database

        created = seed_database()
        click.echo("Dados criados." if created else "O banco já possui os dados de demonstração.")

    with app.app_context():
        db.create_all()

    return app
