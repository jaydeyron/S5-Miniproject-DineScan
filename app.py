from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['MYSQL_HOST'] = 'localhost'  # Replace with your MySQL host
app.config['MYSQL_USER'] = 'root'  # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'jayasankar123'  # Replace with your MySQL password
app.config['MYSQL_DB'] = 'dinescan'  # Replace with your database name

mysql = MySQL(app)

@app.route('/')
def index():
    # Create a cursor within the route function
    mycurs = mysql.connection.cursor()
    mycurs.execute('SELECT * FROM dishes')
    a = mycurs.fetchall()
    mycurs.close()
    return str(a)

@app.route('/menu')
def indexb():
    return "hello"

if __name__ == '__main__':
    app.run(debug=True)
