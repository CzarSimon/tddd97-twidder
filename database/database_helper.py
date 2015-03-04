import sqlite3
from contextlib import closing
from flask import g, Flask
import sys

DATABASE = 'database.db'
con = sqlite3.connect('database.db')

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def sign_up(email, password, firstname, familyname, gender, city, country):
    with con:
        cur = con.cursor()
        cur.execute('INSERT INTO users (email, password, firstname, familyname, gender, city, country) VALUES (?,?,?,?,?,?,?)', (email, password, firstname, familyname, gender, city, country))


def sign_in(email, password):
    with con:
        cur = con.cursor()
        cur.execute('SELECT password FROM users WHERE email = ?', (email,))
        data = cur.fetchone()
        if data[0] == password:
            return True
        else:
            return False




def change_password(email, new_password):
    with con:
        cur = con.cursor()
        cur.execute('UPDATE users SET password = ? WHERE email = ?', (new_password,email))


def get_user_data_by_email(email):
    with con:
        cur = con.cursor()
        cur.execute('SELECT * FROM users WHERE email = ?',(email,))
        data = cur.fetchone()
        return data


def get_user_message_by_email(email):
    with con:
        cur = con.cursor()
        cur.execute('SELECT * FROM messages WHERE email_poster = ?',(email,))
        data = cur.fetchall()
        return data
    

def post_message (poster_email, message, wall_email):
    with con:
        cur = con.cursor()
        cur.execute('INSERT INTO messages(email_poster,email_wall,message) values(?,?,?)',(poster_email,wall_email,message))






app.config.from_envvar('FLASKR_SETTINGS', silent=True)

if __name__ == '__main__':
	app.debub = True
	app.run()
        init_db()
        sign_up('Sven@gmail.com','asd', 'Sven','Balle','male', 'linkoping','sweden')
        sign_up('Bengt@hotmail.com','qwerty','Bengt','Ballong','MEJL','STHLM','Denmark')
        change_password('Sven@gmail.com','Svennebanan')
        print(get_user_data_by_email('Bengt@hotmail.com'))
        post_message('Sven@gmail.com','Alla suger','Bengt@gmail.com')
        post_message('Sven@gmail.com','Nagra suger','Bengt@gmail.com')
        post_message('Sven@gmail.com','Ingen suger','Bengt@gmail.com')
        post_message('Bengt@hotmail.com','Etta','Sven@gmail.com')
        post_message('Bengt@hotmail.com','Tvaa','Sven@gmail.com')
        post_message('Bengt@hotmail.com','Trea','Sven@gmail.com')
        print(get_user_message_by_email('Bengt@hotmail.com'))
        print(sign_in('Sven@gmail.com','asd'))
        print(sign_in('Sven@gmail.com','Svennebanan'))


