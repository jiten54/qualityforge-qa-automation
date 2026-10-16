"""
SQLite Relational Integrity & Arithmetic Consistency Verification
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "../../app/novastore.db")

def test_sqlite_referential_integrity():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # Query orphan orders referencing missing user records
    cursor.execute("""
    SELECT o.id, o.order_number, o.user_id 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE u.id IS NULL;
    """)
    orphan_orders = cursor.fetchall()
    assert len(orphan_orders) == 0, f"Referential integrity failure: orphan orders found {orphan_orders}"

    # Query orphan order items referencing missing products
    cursor.execute("""
    SELECT oi.id, oi.order_id, oi.product_id
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE p.id IS NULL;
    """)
    orphan_items = cursor.fetchall()
    assert len(orphan_items) == 0, f"Referential integrity failure: orphan order items found {orphan_items}"
    conn.close()
    print("PASS: test_sqlite_referential_integrity")

def test_sqlite_order_financial_formula():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Total must equal subtotal + tax + shipping within 1 cent
    cursor.execute("""
    SELECT id, order_number, total, subtotal, tax, shipping,
           ABS(total - (subtotal + tax + shipping)) AS discrepancy
    FROM orders
    WHERE discrepancy > 0.01;
    """)
    discrepancies = cursor.fetchall()
    assert len(discrepancies) == 0, f"Financial math error in orders: {discrepancies}"
    conn.close()
    print("PASS: test_sqlite_order_financial_formula")

def test_sqlite_stock_non_negative_constraint():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, sku, stock FROM products WHERE stock < 0;")
    negative_stock = cursor.fetchall()
    assert len(negative_stock) == 0, f"Inventory stock constraint failure: {negative_stock}"
    conn.close()
    print("PASS: test_sqlite_stock_non_negative_constraint")

if __name__ == "__main__":
    test_sqlite_referential_integrity()
    test_sqlite_order_financial_formula()
    test_sqlite_stock_non_negative_constraint()
    print("All SQLite database tests passed successfully!")
