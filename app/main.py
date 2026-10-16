"""
NovaStore E-Commerce Demo Application
Designed as the Application Under Test (AUT) for QualityForge QA Testing Framework.
"""
from flask import Flask, jsonify, request
import sqlite3
import os

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "novastore.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@app.route("/api/v1/products", methods=["GET"])
def get_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, sku, name, category, price, stock, rating, description FROM products")
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(products), 200

@app.route("/api/v1/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Product not found", "code": "ERR_NOT_FOUND"}), 404
    return jsonify(dict(row)), 200

@app.route("/api/v1/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, role FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or password != "Password123!":
        return jsonify({"error": "Invalid email or password"}), 401
        
    return jsonify({
        "token": f"jwt_token_auth_user_{user['id']}",
        "user": dict(user)
    }), 200

@app.route("/api/v1/orders", methods=["POST"])
def create_order():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401
        
    data = request.get_json() or {}
    if not data.get("shippingAddress"):
        return jsonify({"error": "Unprocessable Entity", "errors": {"shippingAddress": "Field required"}}), 422
        
    return jsonify({
        "orderNumber": "QFG-2026-9025",
        "status": "Processing",
        "message": "Order created successfully"
    }), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
