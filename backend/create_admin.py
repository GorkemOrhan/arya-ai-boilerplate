from app import create_app, db
from app.models.user import User

def create_admin():
    """Create an admin user for testing."""
    app = create_app()
    with app.app_context():
        # Check if admin user exists
        admin = User.query.filter_by(email='admin@example.com').first()
        if admin:
            print("Admin user already exists.")
            print(f"Email: {admin.email}")
            print(f"Username: {admin.username}")
            print(f"Is Admin: {admin.is_admin}")
        else:
            # Create admin user
            admin = User(
                email='admin@example.com',
                username='admin',
                password='adminpassword',
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully.")
            print(f"Email: {admin.email}")
            print(f"Username: {admin.username}")
            print(f"Is Admin: {admin.is_admin}")

if __name__ == '__main__':
    create_admin() 