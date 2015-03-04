DROP TABLE USERS;
DROP TABLE MESSAGES;


CREATE TABLE USERS (email TEXT, 
					password TEXT, 
					firstname TEXT, 
					familyname TEXT, 
					gender TEXT, 
					city TEXT, 
					country TEXT,
					CONSTRAINT pk_users PRIMARY KEY (email));

CREATE TABLE MESSAGES (email_poster TEXT,
						email_wall TEXT,
						message TEXT,
						FOREIGN KEY (email_poster) REFERENCES USERS(email),
						FOREIGN KEY (email_wall) REFERENCES USERS(email),
						CONSTRAINT pk_messages PRIMARY KEY (email_poster,email_wall));


INSERT INTO USERS VALUES('mikael.lietha@gmail.com', 'asd', 'Mikael','Lietha','Male','Linkoping', 'Sweden');
INSERT INTO USERS VALUES('simon.lindgren@gmail.com', 'qwe', 'Simon','Lindgren','Male','Stockholm', 'Sweden');
INSERT INTO USERS VALUES('kalle.olsson@gmail.com', 'zxc', 'Kalle','Sunkarn','Female','Linkoping', 'Uzbekistan');
INSERT INTO USERS VALUES('oskar.norberg@gmail.com', 'rty', 'Oskar','Brunkarna','Blob','Konkursstaden', 'Danmark');

INSERT INTO MESSAGES VALUES('mikael.lietha@gmail.com','simon.lindgren@gmail.com','Databasen är färdig!');
INSERT INTO MESSAGES VALUES('kalle.olsson@gmail.com','oskar.norberg@gmail.com','Fan kan inte du jobba lite hårdare');
INSERT INTO MESSAGES VALUES('kalle.olsson@gmail.com','simon.lindgren@gmail.com','Jag önskar vi kunde bo ihop igen');
INSERT INTO MESSAGES VALUES('kalle.olsson@gmail.com','mikael.lietha@gmail.com','fan du är så bäst på allt, jag önskar ja var som du');
INSERT INTO MESSAGES VALUES('simon.lindgren@gmail.com','simon.lindgren@gmail.com','Hej simon, det är simon!');

--SELECT * FROM MESSAGES WHERE email_poster = 'kalle.olsson@gmail.com';
SELECT * FROM MESSAGES;