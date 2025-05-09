# PostgreSQL Setup Guide

This guide provides detailed instructions for setting up PostgreSQL for the application.

## Prerequisites

- PostgreSQL installed on your system
- Basic knowledge of command line usage

## Installation Instructions

### Windows

1. Download PostgreSQL from the [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. When prompted, set a password for the default 'postgres' user
4. Keep the default port (5432)
5. Complete the installation

### macOS

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Setting Up the Database

### Using Our Helper Scripts

We provide helper scripts to automatically set up the database:

#### Windows

```powershell
# Navigate to the backend directory
cd backend

# Run the PATH helper if PostgreSQL isn't in your PATH
.\add_postgres_to_path.ps1

# Set up the database
.\setup_postgres.ps1
```

#### macOS/Linux

```bash
# Navigate to the backend directory
cd backend

# Set up the database
python setup_postgres.py
```

### Manual Setup

If you prefer to set up the database manually:

1. Start the PostgreSQL command line client:
   - Windows: `psql -U postgres`
   - macOS/Linux: `sudo -u postgres psql`

2. Create a new database:
   ```sql
   CREATE DATABASE "arya-ai-boilerplate";
   ```

3. Create a new user (or use an existing one):
   ```sql
   CREATE USER postgres WITH PASSWORD 'your_password';
   ```

4. Grant privileges to the user:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE "arya-ai-boilerplate" TO postgres;
   ```

5. Exit the PostgreSQL command line client:
   ```sql
   \q
   ```

6. Configure your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/arya-ai-boilerplate
   ```

7. Run the database migrations:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

## Troubleshooting

### PostgreSQL Not in PATH

If you encounter an error about PostgreSQL not being in your PATH:

1. Run the provided helper script:
   ```powershell
   .\add_postgres_to_path.ps1
   ```

2. Alternatively, add PostgreSQL to your PATH manually:
   - Windows: Add `C:\Program Files\PostgreSQL\<version>\bin` to your PATH
   - macOS/Linux: Add `/usr/lib/postgresql/<version>/bin` to your PATH

### Connection Issues

If you're having trouble connecting to PostgreSQL:

1. Verify PostgreSQL service is running:
   - Windows: Check Services application
   - macOS: `brew services list`
   - Linux: `sudo systemctl status postgresql`

2. Check your connection parameters in the `.env` file
3. Ensure the PostgreSQL port (default: 5432) is not blocked by a firewall
4. Try connecting with the command line client to verify credentials:
   ```
   psql -U postgres -h localhost
   ```

### Database Already Exists

If the database already exists but you want to start fresh:

1. Connect to PostgreSQL:
   ```
   psql -U postgres
   ```

2. Drop the existing database:
   ```sql
   DROP DATABASE "arya-ai-boilerplate";
   ```

3. Run the setup script again

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flask-SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/)
- [Flask-Migrate Documentation](https://flask-migrate.readthedocs.io/) 