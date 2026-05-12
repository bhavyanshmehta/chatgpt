import sqlite3
from sqlite3 import Error

DB_FILE = 'chat_app.db'

def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    except Error as e:
        print(e)
    return conn

def init_db():
    conn = create_connection()
    if conn is not None:
        try:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS chats (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );''')
            c.execute('''CREATE TABLE IF NOT EXISTS messages (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            chat_id INTEGER NOT NULL,
                            role TEXT NOT NULL,
                            content TEXT NOT NULL,
                            image_path TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (chat_id) REFERENCES chats (id)
                        );''')
            # Try to add image_path to existing table
            try:
                c.execute("ALTER TABLE messages ADD COLUMN image_path TEXT;")
            except sqlite3.OperationalError:
                pass # Column exists
            
            conn.commit()
        except Error as e:
            print(e)
        finally:
            conn.close()

def create_chat(title):
    conn = create_connection()
    chat_id = None
    if conn is not None:
        try:
            sql = ''' INSERT INTO chats(title) VALUES(?) '''
            cur = conn.cursor()
            cur.execute(sql, (title,))
            conn.commit()
            chat_id = cur.lastrowid
        except Error as e:
            print(e)
        finally:
            conn.close()
    return chat_id

def get_chats():
    conn = create_connection()
    chats = []
    if conn is not None:
        try:
            cur = conn.cursor()
            cur.execute("SELECT id, title, created_at FROM chats ORDER BY created_at DESC")
            rows = cur.fetchall()
            for row in rows:
                chats.append({"id": row[0], "title": row[1], "created_at": row[2]})
        except Error as e:
            print(e)
        finally:
            conn.close()
    return chats

def add_message(chat_id, role, content, image_path=None):
    conn = create_connection()
    if conn is not None:
        try:
            sql = ''' INSERT INTO messages(chat_id, role, content, image_path) VALUES(?,?,?,?) '''
            cur = conn.cursor()
            cur.execute(sql, (chat_id, role, content, image_path))
            conn.commit()
        except Error as e:
            print(e)
        finally:
            conn.close()

def get_messages(chat_id):
    conn = create_connection()
    messages = []
    if conn is not None:
        try:
            cur = conn.cursor()
            cur.execute("SELECT role, content, image_path FROM messages WHERE chat_id=? ORDER BY created_at ASC", (chat_id,))
            rows = cur.fetchall()
            for row in rows:
                messages.append({"role": row[0], "content": row[1], "image_path": row[2]})
        except Error as e:
            print(e)
        finally:
            conn.close()
    return messages

def rename_chat(chat_id, new_title):
    conn = create_connection()
    if conn is not None:
        try:
            sql = ''' UPDATE chats SET title = ? WHERE id = ? '''
            cur = conn.cursor()
            cur.execute(sql, (new_title, chat_id))
            conn.commit()
        except Error as e:
            print(e)
        finally:
            conn.close()
