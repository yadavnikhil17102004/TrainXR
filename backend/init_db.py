from config.database import engine, Base
from models import user, exercise

def init_db():
    """
    Initialize the database by creating all tables
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()