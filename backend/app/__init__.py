import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from .config import Config
import logging

# Load environment variables
load_dotenv()

# Initialize extensions
from .database import db
migrate = Migrate()
jwt = JWTManager()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app(config_class=Config):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Load configuration
    if config_class is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_mapping(
            SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
            SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///app.db'),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key'),
            MAIL_SERVER=os.environ.get('MAIL_SERVER'),
            MAIL_PORT=int(os.environ.get('MAIL_PORT', 587)),
            MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS', 'True') == 'True',
            MAIL_USERNAME=os.environ.get('MAIL_USERNAME'),
            MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD'),
            MAIL_DEFAULT_SENDER=os.environ.get('MAIL_DEFAULT_SENDER')
        )
    else:
        # Load the test config if passed in
        app.config.from_object(config_class)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS to allow requests from GitHub Pages and localhost
    CORS(app, resources={r"/api/*": {"origins": [
        "https://your-github-username.github.io",  # Replace with your GitHub Pages domain
        "http://localhost:3000",  # For local frontend development
        "http://127.0.0.1:3000"   # Alternative localhost address
    ]}})
    
    jwt.init_app(app)
    
    # Setup logging
    logging.basicConfig(level=logging.INFO,
                       format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    
    # Register blueprints
    from .api.auth import auth_bp
    from .api.test import test_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(test_bp, url_prefix='/api/test')

    # Setup error handlers
    @app.errorhandler(422)
    def handle_validation_error(e):
        logger.error(f"Validation error: {str(e)}")
        return jsonify({"error": "Validation error", "message": str(e)}), 422
    
    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        logger.warning(f"Expired token: {jwt_payload.get('sub')}")
        return jsonify({"error": "Token expired", "message": "Your session has expired. Please log in again."}), 401
    
    @jwt.invalid_token_loader
    def handle_invalid_token(error_string):
        logger.warning(f"Invalid token: {error_string}")
        return jsonify({"error": "Invalid token", "message": "Your token is invalid. Please log in again."}), 401
    
    @jwt.unauthorized_loader
    def handle_missing_token(error_string):
        logger.warning(f"Missing token: {error_string}")
        return jsonify({"error": "Missing token", "message": "Authorization token is missing."}), 401
    
    @app.route('/api/ping', methods=['GET'])
    def ping():
        return jsonify({"status": "success", "message": "pong"})
    
    # Create database tables
    with app.app_context():
        db.create_all()

    return app 