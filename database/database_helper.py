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
        psw_in_db = cur.execute('SELECT password FROM users WHERE email = ?', email)
        if psw_in_db == password:
            return True
        else:
            return False


"""
def change_password(email, new_password):

def get_user_data_by_email(email):


def get_user_message_by_email(email):
    

def post_message (poster_email, message, wall_email):






app.config.from_envvar('FLASKR_SETTINGS', silent=True)

if __name__ == '__main__':
	app.debub = True
	app.run()
        init_db()
        sign_up('anders.lietha@gmail.com','asd', 'mikael','lietha','male', 'linkoping','sweden')
        print("Hello")
"""