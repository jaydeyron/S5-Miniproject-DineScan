from flask import Flask, render_template 
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key = 'hailhitler'
app.config['TEMPLATES_AUTO_RELOAD'] = True

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'jayasankar123'
app.config['MYSQL_DB'] = 'dinescan'

mysql = MySQL(app)

@app.route("/") 
def index(): 
   return render_template("home.html")

@app.route("/login") 
def index(): 
   return render_template("login.html")

@app.route('/demo')
def demo():
    mycurs = mysql.connection.cursor()
    mycurs.execute('SELECT * FROM dishes')
    a = mycurs.fetchall()
    mycurs.close()
    return str(a)

if __name__ == '__main__':
    app.run(debug=True)
