from flask import Flask

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD']=True

@app.route('/')
def index():
    return "Jayasankar"

@app.route('/menu')
def indexb():
    return "hello"

if __name__ == '__main__':
    app.run(debug=True)