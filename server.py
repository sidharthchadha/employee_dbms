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

@app.route('/client',methods=['POST'])
def get_client():
   data = request.json
  
   #get projects function
   projects = [
            {"id": "1", "name": "Project A"},
            {"id": "2", "name": "Project B"},
            {"id": "3", "name": "Project C"},
            {"id": "4", "name": "Project D"},
            {"id": "5", "name": "Project E"},
            {"id": "6", "name": "Project F"},
            {"id": "7", "name": "Project G"},
            {"id": "8", "name": "Project H"},
            {"id": "9", "name": "Project I"},
            {"id": "10", "name": "Project J"},
            {"id": "11", "name": "Project K"}
        ]

   # print(projects[0:5])
    # show in  reactjs
   return {
        'name':"sid", 
        'phone': "8xxxxxx8",
        'institution':"IIT pkd",
        'email':"sid@gmail.com",
        'projects':projects,
        'num_projects':len(projects)
      }


if __name__ == "__main__":
   app.run(host="0.0.0.0")
