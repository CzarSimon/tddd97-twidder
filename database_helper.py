import sqlite3
from contextlib import closing
from flask import g, Flask
import sys
from werkzeug.security import generate_password_hash, \
     check_password_hash

DATABASE = 'database.db'
con = sqlite3.connect('database.db', check_same_thread=False)
con.row_factory = sqlite3.Row

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])


# Initiates the database with the scrip specified in database.schema
# Parameters: 
# Returns: 

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


# Inserts a user into the USERS table in the database, the password is hashed with a built-in hashing function
# Parameters: 'email' (type: string), 'password' (type: string), 
#'firstname' (type: string), 'familyname' (type: string), 
#'gender' (type: string), 'city' (type: string),
#'country' (type: string)
# Returns: 

def sign_up(email, password, firstname, familyname, gender, city, country):
    hashed_password = generate_password_hash(password)
    with con:
        cur = con.cursor()
        cur.execute('INSERT INTO users (email, password, firstname, familyname, gender, city, country) VALUES (?,?,?,?,?,?,?)', (email, hashed_password, firstname, familyname, gender, city, country))


# Validation function that checks if the provided password is connected to a specific email.
# It takes the hashing into consideration
# Parameters: 'email' (type: string), 'password' (type: string), 
# Returns: (type: boolean)

def sign_in(email, password):
    with con:
        cur = con.cursor()
        cur.execute('SELECT password FROM users WHERE email = ?', (email,))
        data = cur.fetchone()
        if (data is not None and check_password_hash(str(data[0]),password)):
            return True
        else:
            return False


# Updates the USER table with a new password for the corresponding email
# Parameters: 'email' (type: string), 'new_password' (type: string), 
# Returns: 

def change_password(email, new_password):
    hashed_password = generate_password_hash(new_password)
    with con:
        cur = con.cursor()
        cur.execute('UPDATE users SET password = ? WHERE email = ?', (hashed_password,email))


# Returns all the data in the USER table associated with a specific email adress
# Parameters: 'email' (type: string)
# Returns: 'data' (type: list)

def get_user_data_by_email(email):
    
    with con:
        cur = con.cursor()
        cur.execute('SELECT * FROM users WHERE email = ?',(email,))
        data = cur.fetchone()
        return data

# Function that compares a given password to the hashed password assiciated with the
# given email in the database
# Parameters: 'email' (type: string), 'password' (type: string)
# Returns: (type: boolean)

def compare_password(email,OldPassword):
    with con:
        cur = con.cursor()
        cur.execute('SELECT password FROM users WHERE email = ?', (email,))
        data = cur.fetchone()
        if (data is not None and check_password_hash(str(data[0]),OldPassword)):
            return True
        else:
            return False


# Returns all the messages posted at certain users wall
# Parameters: 'email' (type: string)
# Returns: 'data' (type: list)

def get_user_message_by_email(email):
    with con:
        cur = con.cursor()
        cur.execute('SELECT * FROM messages WHERE email_wall = ?',(email,))
        data = cur.fetchall()
        return data
  

# Adds a row to the MESSAGES table with the posters email, the email of the owner of the wall and the message itself
# Parameters: 'poster_email' (type: string), 'message' (type: string), 'wall_email' (type: string)
# Returns: 

def post_message (poster_email, message, wall_email):
    with con:
        cur = con.cursor()
        cur.execute('INSERT INTO messages(email_poster,email_wall,message) values(?,?,?)',(poster_email,wall_email,message))


"""
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
"""