from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# --------------------------------------------------------
# Flask App Initialization
# --------------------------------------------------------
app = Flask(__name__)
# Dev: allow all origins. For production, restrict origins explicitly.
CORS(app)

# PostgreSQL connection (adjust if needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --------------------------------------------------------
# Database Models
# --------------------------------------------------------
class Car(db.Model):
    """Car listings submitted by users (pending -> approved workflow)."""
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer)
    price = db.Column(db.Float)
    mileage = db.Column(db.Integer)
    transmission = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    vin = db.Column(db.String(50), unique=True)
    image_url = db.Column(db.Text)
    location = db.Column(db.String(100))
    description = db.Column(db.Text)
    contact_info = db.Column(db.String(100))
    submitted_by = db.Column(db.String(50))  # username string (simple approach)
    approved = db.Column(db.Boolean, default=False)

    def to_dict(self):
        """Return a frontend-friendly dict (camelCase for certain fields)."""
        return {
            "id": self.id,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "price": self.price,
            "mileage": self.mileage,
            "transmission": self.transmission,
            "fuelType": self.fuel_type,
            "vin": self.vin,
            "imageUrl": self.image_url,
            "location": self.location,
            "description": self.description,
            "contactInfo": self.contact_info,
            "submittedBy": self.submitted_by,
            "approved": self.approved
        }

class User(db.Model):
    """Simple user table (demo: plaintext password for now)."""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True)   # <-- email used at registration
    password = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

# --------------------------------------------------------
# Health Check
# --------------------------------------------------------
@app.route('/')
def home():
    return "🚗 Used Car Marketplace API is running with PostgreSQL!"

# --------------------------------------------------------
# Car Routes (CRUD + approval workflow)
# --------------------------------------------------------
@app.route('/cars', methods=['GET'])
def get_all_cars():
    """Return all cars (both pending and approved)."""
    cars = Car.query.all()
    return jsonify({"status": "success", "data": [c.to_dict() for c in cars]}), 200

@app.route('/cars', methods=['POST'])
def create_car():
    """
    Create a car listing.
    Prefer userId -> resolve to username; fallback to submittedBy; else 'Anonymous'.
    """
    data = request.get_json() or {}

    # Resolve username from userId if provided (preferred)
    username = None
    user_id = data.get('userId')
    if user_id:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"status": "error", "message": "Invalid userId"}), 400
        username = user.username
    else:
        # Fallback: direct submittedBy string from the request body
        username = data.get('submittedBy')

    if not username:
        username = 'Anonymous'

    try:
        car = Car(
            make=data.get('make', ''),
            model=data.get('model', ''),
            year=data.get('year', 0),
            price=data.get('price', 0),
            mileage=data.get('mileage', 0),
            transmission=data.get('transmission', ''),
            fuel_type=data.get('fuelType', ''),
            vin=data.get('vin', ''),
            image_url=data.get('imageUrl', ''),
            location=data.get('location', ''),
            description=data.get('description', ''),
            contact_info=data.get('contactInfo', ''),
            submitted_by=username,
            approved=data.get('approved', False)
        )
        db.session.add(car)
        db.session.commit()
        return jsonify({"status": "success", "data": car.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/cars/<int:car_id>', methods=['PUT'])
def update_car(car_id):
    """Update fields of a car listing by ID (admin or owner in real apps)."""
    car = Car.query.get(car_id)
    if not car:
        return jsonify({"status": "error", "message": "Car not found"}), 404

    data = request.get_json() or {}

    # Map camelCase to snake_case where needed; otherwise setattr
    for key, value in data.items():
        if key == "fuelType":
            car.fuel_type = value
        elif key == "imageUrl":
            car.image_url = value
        elif key == "contactInfo":
            car.contact_info = value
        elif key == "submittedBy":
            car.submitted_by = value
        elif hasattr(car, key):
            setattr(car, key, value)

    db.session.commit()
    return jsonify({"status": "success", "data": car.to_dict()}), 200

@app.route('/cars/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    """Delete a car listing by ID."""
    car = Car.query.get(car_id)
    if not car:
        return jsonify({"status": "error", "message": "Car not found"}), 404
    db.session.delete(car)
    db.session.commit()
    return jsonify({"status": "success", "message": f"Car with id {car_id} deleted"}), 200

@app.route('/cars/pending', methods=['GET'])
def get_pending_cars():
    """List all pending (unapproved) cars for admin review."""
    cars = Car.query.filter_by(approved=False).all()
    return jsonify({"status": "success", "data": [c.to_dict() for c in cars]}), 200

@app.route('/cars/approved', methods=['GET'])
def get_approved_cars():
    """List all approved cars."""
    cars = Car.query.filter_by(approved=True).all()
    return jsonify({"status": "success", "data": [c.to_dict() for c in cars]}), 200

@app.route('/cars/<int:car_id>', methods=['GET'])
def get_car_detail(car_id):
    """Get details of a single car by ID."""
    car = Car.query.get(car_id)
    if not car:
        return jsonify({"status": "error", "message": "Car not found"}), 404
    return jsonify({"status": "success", "data": car.to_dict()}), 200

@app.route('/cars/<int:car_id>/approve', methods=['PUT'])
def approve_car(car_id):
    """Approve a car listing (admin action)."""
    car = Car.query.get(car_id)
    if not car:
        return jsonify({"status": "error", "message": "Car not found"}), 404
    car.approved = True
    db.session.commit()
    return jsonify({"status": "success", "message": f"Car with id {car_id} approved"}), 200

# --------------------------------------------------------
# User Routes (Simple demo auth)
# --------------------------------------------------------
@app.route('/users', methods=['GET'])
def get_all_users():
    """Return all users."""
    users = User.query.all()
    return jsonify({"status": "success", "data": [u.to_dict() for u in users]}), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    """Get a single user by ID."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    return jsonify({"status": "success", "data": user.to_dict()}), 200

@app.route('/users', methods=['POST'])
def create_user():
    """
    Create a new user (used by admin tools or tests).
    Requires username + email + password to keep data consistent.
    """
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"status": "error", "message": "Email already exists"}), 409

    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "success", "data": user.to_dict()}), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user's username/email/password."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    data = request.get_json() or {}
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = data['password']

    db.session.commit()
    return jsonify({"status": "success", "data": user.to_dict()}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user by ID."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"status": "success", "message": f"User with id {user_id} deleted"}), 200

# Registration + Login for the front-end demo flow
@app.route('/api/register', methods=['POST'])
def api_register():
    """Register a new user (demo). Uses email at registration time."""
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"status": "error", "message": "Email already exists"}), 409

    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "User registered successfully.",
        "data": user.to_dict()
    }), 201

@app.route('/login', methods=['POST'])
def login():
    """
    Login validates with username + password only,
    but returns the user's email as well for UI display.
    """
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    is_admin = (username == "admin")
    return jsonify({
        "status": "success",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,      # returned for UI display
            "isAdmin": is_admin
        }
    }), 200

# --------------------------------------------------------
# Simple Stats Endpoint (for dashboard)
# --------------------------------------------------------
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Basic counts for dashboard tiles."""
    users = User.query.all()
    cars = Car.query.all()
    return jsonify({
        "total_users": len(users),
        "admin_users": len([u for u in users if u.username == "admin"]),
        "total_cars": len(cars),
        "approved_cars": len([c for c in cars if c.approved]),
        "pending_cars": len([c for c in cars if not c.approved])
    }), 200

# --------------------------------------------------------
# Bootstrapping
# --------------------------------------------------------
if __name__ == '__main__':
    with app.app_context():
        # Auto-create tables if they don't exist.
        # If your existing 'users' table lacks the 'email' column, run this once in PostgreSQL:
        #   ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(120);
        #   CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (email);
        db.create_all()
    app.run(debug=True, port=5000)











