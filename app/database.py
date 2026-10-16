"""
SQLite Relational Database Schema & Seeding Script for NovaStore AUT
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "novastore.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'admin', 'qa_tester')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL CHECK(price > 0),
        stock INTEGER NOT NULL CHECK(stock >= 0),
        rating REAL DEFAULT 5.0,
        description TEXT
    );
    """)

    # Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        shipping REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Order Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0),
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );
    """)

    # Seed initial test data
    cursor.execute("DELETE FROM order_items;")
    cursor.execute("DELETE FROM orders;")
    cursor.execute("DELETE FROM products;")
    cursor.execute("DELETE FROM users;")

    cursor.executemany("""
    INSERT INTO users (id, email, password_hash, full_name, role)
    VALUES (?, ?, ?, ?, ?);
    """, [
        (101, 'sarah.qa@strivelogic.com', 'pbkdf2_hash_sarah', 'Sarah Jenkins', 'qa_tester'),
        (102, 'john.customer@example.com', 'pbkdf2_hash_john', 'John Doe', 'customer'),
        (103, 'alex.admin@strivelogic.com', 'pbkdf2_hash_admin', 'Alex Rivera', 'admin')
    ])

    cursor.executemany("""
    INSERT INTO products (id, sku, name, category, price, stock, rating, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, [
        (1, 'PRD-AUD-001', 'Aura ANC Studio Wireless Headphones', 'Audio', 199.99, 24, 4.8, 'Flagship active noise cancellation'),
        (2, 'PRD-INP-002', 'Vanguard Tenkeyless Mechanical Keyboard', 'Peripherals', 129.50, 18, 4.9, 'Custom tactile switches'),
        (3, 'PRD-INP-003', 'Precision Ergonomic Wireless Mouse', 'Peripherals', 79.99, 35, 4.7, 'Dual thumb scroll wheel'),
        (4, 'PRD-WBL-004', 'Chronos Titanium GPS Smartwatch', 'Wearables', 249.00, 12, 4.6, 'Aerospace-grade titanium chassis')
    ])

    cursor.execute("""
    INSERT INTO orders (id, order_number, user_id, subtotal, tax, shipping, total, status, created_at)
    VALUES (9021, 'QFG-2026-9021', 101, 199.99, 16.00, 0.00, 215.99, 'Delivered', '2026-10-02 10:14:20');
    """)

    cursor.execute("""
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (9021, 1, 1, 199.99);
    """)

    conn.commit()
    conn.close()
    print("NovaStore SQLite database initialized and seeded successfully.")

if __name__ == "__main__":
    init_db()
