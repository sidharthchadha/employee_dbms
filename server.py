from flask import Flask,render_template,request,jsonify
import psycopg2

app = Flask(__name__)

@app.route('/') 
def index(): 
   
   return render_template("index.html")
   
   
@app.route('/login', methods=['POST'])
def login():
   username = request.form['username']
   password = request.form['password']
                                                     #usermane:password              #database to connect
   connection_db = psycopg2.connect("postgresql://{}:{}@localhost:5432/employee_management".format(username,password))

   #cursor to perform operations and retrieve data
   cur=connection_db.cursor()
   # Do something with the username and password

   return render_template("employee.html")
   # return 'Logged in as {}.'.format(username)

# def middleware():
if __name__ == "__main__":
      
   app.run(host="0.0.0.0")
