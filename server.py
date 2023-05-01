from flask import Flask,render_template,request,jsonify
import psycopg2
#Importing Package
import sqlalchemy
#Database Utility Class
from sqlalchemy.engine import create_engine
# Provides executable SQL expression construct
from sqlalchemy.sql import text
sqlalchemy.__version__ 

app = Flask(__name__)


# type
# 1 -> employee
# 2 -> client
# 3 -> hr
   
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    type= request.json.get('loginType')
    print(type)

    if username == 'admin' and password == 'password' and type=='hr':
        print("success")
        return jsonify({'success': True})
    
    connection_db = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cur=connection_db.cursor()
    
    if type=='client':
        client_id=int(username)
        select_query = "SELECT * FROM clients  WHERE id = %s;"
        cur.execute(select_query, (client_id,))
        result = cur.fetchone()
        print(result[0])
        ret_id=str(result[0])

        if result:
            print("success")
            return jsonify({'success': True,
                                'id':ret_id})
        

    if type=='employee':
        employee_id = int(username) 
        print(employee_id) 

        select_query = "SELECT * FROM employee  WHERE id = %s;"
        cur.execute(select_query, (employee_id,))
        result = cur.fetchone()
        print(result[0])
        ret_id=str(result[0])

        if result:
            print("success")
            return jsonify({'success': True,
                                'id':ret_id})
        
        else:
            print("Employee not found.")
            return jsonify({'success': False, 'error': 'Invalid username or password'})
    
    return jsonify({'success': False, 'error': 'Invalid username or password'})

  
@app.route('/employee',methods=['POST'])
def get_employee():
    data = request.json
    id=data['id']
    print(id)

    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cur = conn.cursor()
    
    query = f"SELECT e.first_name, e.last_name, e.ph_num, c.institution, e.email FROM employee e LEFT JOIN clients c ON e.id = c.id WHERE e.id = {id};"
    cur.execute(query)
    
    result = cur.fetchone()
    first_name, last_name, phone, institution, email = result
    cur_projects, completed_projects, last_6_transactions, project_heading, skills = None, None, None, None, None  # Add your logic to retrieve these values
    
    cur.close()
    conn.close()
  
    cur_projects = [
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
    completed_projects = [
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
   
    last_6_transactions=[ 
    { 'part1': 'Entry 1 Part 1', 'part2': 'Entry 1 Part 2', 'part3': 'Entry 1 Part 3', 'part4': 'Entry 1 Part 4', 'part5': 'Entry 1 Part 5' },
    { 'part1': 'Entry 2 Part 1', 'part2': 'Entry 2 Part 2', 'part3': 'Entry 2 Part 3', 'part4': 'Entry 2 Part 4', 'part5': 'Entry 2 Part 5' },
    { 'part1': 'Entry 3 Part 1', 'part2': 'Entry 3 Part 2', 'part3': 'Entry 3 Part 3', 'part4': 'Entry 3 Part 4', 'part5': 'Entry 3 Part 5' },
    { 'part1': 'Entry 4 Part 1', 'part2': 'Entry 4 Part 2', 'part3': 'Entry 4 Part 3', 'part4': 'Entry 4 Part 4', 'part5': 'Entry 4 Part 5' },
    { 'part1': 'Entry 5 Part 1', 'part2': 'Entry 5 Part 2', 'part3': 'Entry 5 Part 3', 'part4': 'Entry 5 Part 4', 'part5': 'Entry 5 Part 5' },
    { 'part1': 'Entry 6 Part 1', 'part2': 'Entry 6 Part 2', 'part3': 'Entry 6 Part 3', 'part4': 'Entry 6 Part 4', 'part5': 'Entry 6 Part 5' },
  ];
   
    project_heading=[
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
    skills=['a','b']
    return {
        'name': f"{first_name} {last_name}",
        'phone': str(phone),
        'email': email,
        'cur_projects':cur_projects,
        'completed_projects':completed_projects,
        'num_cur_projects':len(cur_projects),
        'last_6_transactions':last_6_transactions,
        'num_completed_projects':len(completed_projects),
        'project_heading': project_heading,
        'skills':skills

      }



@app.route('/client',methods=['POST'])
def get_client():
    data = request.json
    client_id=data['id']
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()
    cursor.execute("SELECT name, ph_num, institution, email FROM clients WHERE id = %s", (client_id,))
    
    # Fetch the result
    result = cursor.fetchone()
    print(result)
    # Close the cursor and connection
    cursor.close()
    conn.close()
    
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
   

    return {
        'name': str(result[0]),
        'phone': str(result[1]),
        'institution': str(result[2]),
        'email': str(result[3]),
        'projects':projects,
        'num_projects':len(projects)
    }
  



@app.route('/hr',methods=['POST'])
def get_admin():
   data = request.json
  
   #get projects function
   cur_projects = [
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
   completed_projects = [
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
   
   last_6_transactions=[ 
    { 'part1': 'Entry 1 Part 1', 'part2': 'Entry 1 Part 2', 'part3': 'Entry 1 Part 3', 'part4': 'Entry 1 Part 4', 'part5': 'Entry 1 Part 5' },
    { 'part1': 'Entry 2 Part 1', 'part2': 'Entry 2 Part 2', 'part3': 'Entry 2 Part 3', 'part4': 'Entry 2 Part 4', 'part5': 'Entry 2 Part 5' },
    { 'part1': 'Entry 3 Part 1', 'part2': 'Entry 3 Part 2', 'part3': 'Entry 3 Part 3', 'part4': 'Entry 3 Part 4', 'part5': 'Entry 3 Part 5' },
    { 'part1': 'Entry 4 Part 1', 'part2': 'Entry 4 Part 2', 'part3': 'Entry 4 Part 3', 'part4': 'Entry 4 Part 4', 'part5': 'Entry 4 Part 5' },
    { 'part1': 'Entry 5 Part 1', 'part2': 'Entry 5 Part 2', 'part3': 'Entry 5 Part 3', 'part4': 'Entry 5 Part 4', 'part5': 'Entry 5 Part 5' },
    { 'part1': 'Entry 6 Part 1', 'part2': 'Entry 6 Part 2', 'part3': 'Entry 6 Part 3', 'part4': 'Entry 6 Part 4', 'part5': 'Entry 6 Part 5' },
  ];
   
   project_heading=[
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
   skills=['a','b']
   return {
        'name':"sid", 
        'phone': "8xxxxxx8",
        'institution':"IIT pkd",
        'email':"sid@gmail.com",
        'cur_projects':cur_projects,
        'completed_projects':completed_projects,
        'num_cur_projects':len(cur_projects),
        'last_6_transactions':last_6_transactions,
        'num_completed_projects':len(completed_projects),
        'project_heading': project_heading,
        'skills':skills

      }
if __name__ == "__main__":
    app.run("0.0.0.0")