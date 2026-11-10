import type { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      image TEXT DEFAULT '',
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      product_id INTEGER PRIMARY KEY,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Chờ xác nhận',
      address TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  const userCount = await db.getFirstAsync<{count:number}>('SELECT COUNT(*) as count FROM users');
  if ((userCount?.count ?? 0) === 0) {
    await db.runAsync(
      'INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)',
      'Quản trị viên', 'admin@lumie.store', 'admin123', 'admin'
    );
    await db.runAsync(
      'INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)',
      'Khách hàng mẫu', 'user@lumie.store', 'user123', 'user'
    );
  }

  const catCount = await db.getFirstAsync<{count:number}>('SELECT COUNT(*) as count FROM categories');
  if ((catCount?.count ?? 0) === 0) {
    const categories = [
      ['Thời trang nữ', 'Trang phục thanh lịch dành cho nữ'],
      ['Túi & phụ kiện', 'Phụ kiện tạo điểm nhấn phong cách'],
      ['Chăm sóc cá nhân', 'Sản phẩm chăm sóc và làm đẹp'],
      ['Lifestyle', 'Những món đồ cho cuộc sống tinh tế']
    ];
    for (const c of categories) await db.runAsync('INSERT INTO categories(name,description) VALUES(?,?)', ...c);
  }

  const productCount = await db.getFirstAsync<{count:number}>('SELECT COUNT(*) as count FROM products');
  if ((productCount?.count ?? 0) === 0) {
    const products = [
      [1,'Áo blouse Lumière','Thiết kế mềm mại, phom dáng thanh lịch cho ngày thường.',589000,'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900',24],
      [1,'Đầm midi Élan','Đầm midi tối giản với đường cắt tinh tế.',890000,'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900',15],
      [1,'Áo cardigan Muse','Chất liệu mềm nhẹ, dễ phối nhiều phong cách.',720000,'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900',18],
      [2,'Túi mini Amour','Phom túi nhỏ gọn, điểm nhấn cho outfit.',1250000,'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900',12],
      [2,'Kính Aura','Thiết kế cổ điển, dễ ứng dụng.',450000,'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900',30],
      [2,'Ví da Serein','Ví cầm tay tối giản với nhiều ngăn tiện dụng.',620000,'https://images.unsplash.com/photo-1627123424574-724758594e93?w=900',20],
      [3,'Nước hoa Fleur','Hương hoa dịu nhẹ, lưu hương thanh lịch.',980000,'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',10],
      [3,'Set chăm sóc da','Bộ sản phẩm chăm sóc da hằng ngày.',760000,'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900',16],
      [4,'Nến thơm Maison','Hương thơm ấm áp cho không gian thư giãn.',390000,'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900',22],
      [4,'Bình gốm Atelier','Bình gốm trang trí mang nét thủ công.',540000,'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900',8]
    ];
    for (const p of products) {
      await db.runAsync(
        'INSERT INTO products(category_id,name,description,price,image,stock) VALUES(?,?,?,?,?,?)',
        ...p
      );
    }
  }
}

export const money = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
