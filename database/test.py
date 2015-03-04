#!/usr/bin/python
# -*- coding: utf-8 -*-
import sqlite3 as lite
import sys

con = lite.connect('database.db')


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

with con:
    init_db()
    cur = con.cursor()    
    cur.execute("INSERT INTO users VALUES('mikael.lietha@gmail.com','asd','mikael','lietha','male','linkoping','sweden')")
