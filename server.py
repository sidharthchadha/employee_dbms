import math
from textblob import TextBlob
import logging
import json
from flask import Flask, render_template, request, jsonify
import psycopg2
# Importing Package
import sqlalchemy
# Database Utility Class
from sqlalchemy.engine import create_engine
# Provides executable SQL expression construct
from sqlalchemy.sql import text
sqlalchemy.__version__
app = Flask(__name__)
from datetime import datetime


log_file = 'project_log.txt'


def get_sentiment_score(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    # Scale sentiment from -1 to 1 to 0 to 5
    scaled_score = (sentiment + 1) * 2.5
    return scaled_score


# type
# 1 -> employee
# 2 -> client
# 3 -> hr

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    type = request.json.get('loginType')
    print(type)

    if username == 'admin' and password == 'password' and type == 'hr':
        print("success")
        return jsonify({'success': True})

    connection_db = psycopg2.connect(
        "postgresql://postgres:postgres@localhost:5432/ems")
    cur = connection_db.cursor()

    if type == 'client':
        client_id = int(username)
        select_query = "SELECT * FROM clients  WHERE id = %s;"
        cur.execute(select_query, (client_id,))
        result = cur.fetchone()
        print(result[0])
        ret_id = str(result[0])

        if result:
            print("success")
            return jsonify({'success': True,
                            'id': ret_id})

    if type == 'employee':
        employee_id = int(username)
        print(employee_id)

        select_query = "SELECT * FROM employee  WHERE id = %s;"
        cur.execute(select_query, (employee_id,))
        result = cur.fetchone()
        print(result[0])
        ret_id = str(result[0])

        if result:
            print("success")
            return jsonify({'success': True,
                            'id': ret_id})

        else:
            print("Employee not found.")
            return jsonify({'success': False, 'error': 'Invalid username or password'})

    return jsonify({'success': False, 'error': 'Invalid username or password'})


@app.route('/employee', methods=['POST'])
def get_employee():
    data = request.json
    id = data['id']

    conn = psycopg2.connect(
        "postgresql://postgres:postgres@localhost:5432/ems")
    cur = conn.cursor()

    query = f"SELECT e.first_name, e.last_name, e.ph_num,  e.email \
        FROM employee e WHERE e.id = {id};"
    cur.execute(query)

    result = cur.fetchone()
    first_name, last_name, phone, email = result
    #print(result)

    query = """
    SELECT p.id, p.main_dept, p.start_date, p.status, p.time_taken, p.proj_type,
           emp1.first_name, emp1.last_name, emp1.ph_num,
           emp2.first_name, emp2.last_name, emp2.ph_num
    FROM performancescore ps
    RIGHT JOIN projects p ON ps.proj_id = p.id
    LEFT JOIN employee emp1 ON p.proj_head_one = emp1.id
    LEFT JOIN employee emp2 ON p.proj_head_two = emp2.id
    WHERE ps.emp_id = %s AND ps.performance IS NULL
"""

    cur.execute(query, (id,))
    list_projects = cur.fetchall()

    cur_projects = []
    for project in list_projects:
        project_id, main_dept, start_date, status, time_taken, proj_type, \
            head_one_first_name, head_one_last_name, head_one_ph_num, \
            head_two_first_name, head_two_last_name, head_two_ph_num = project

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num
        }
        cur_projects.append(project_dict)

    # Print the retrieved project information
    #for project in cur_projects:
        #print(project)
        #print()

    query = """
    SELECT p.id, p.main_dept, p.start_date, p.status, p.time_taken, p.proj_type,
        emp1.first_name, emp1.last_name, emp1.ph_num,
        emp2.first_name, emp2.last_name, emp2.ph_num,
        cp.feedback, cp.review
    FROM performancescore ps
    RIGHT JOIN projects p ON ps.proj_id = p.id
    LEFT JOIN employee emp1 ON p.proj_head_one = emp1.id
    LEFT JOIN employee emp2 ON p.proj_head_two = emp2.id
    LEFT JOIN (
        SELECT DISTINCT ON (proj_id) proj_id, feedback, review
        FROM clientproject
    ) cp ON p.id = cp.proj_id
    WHERE ps.emp_id = %s AND ps.performance IS NOT NULL;
"""

    cur.execute(query, (id,))

    list_projects = cur.fetchall()

    completed_projects = []
    for project in list_projects:
        project_id, main_dept, start_date, status, time_taken, proj_type, \
            head_one_first_name, head_one_last_name, head_one_ph_num, \
            head_two_first_name, head_two_last_name, head_two_ph_num ,feedback,review= project

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num,
            "review": review
        }
        completed_projects.append(project_dict)



    last_6_transactions = []
    query = "SELECT id, empid, transfer_date, amount, status FROM transactions WHERE empid = %s ORDER BY id DESC LIMIT 6;"
    cur.execute(query, (id,))
    transaction_details = cur.fetchall()

    # Store the breakup, date, and other details in a list

    for transaction in transaction_details:
        transaction_id, emp_id, transfer_date, amount, status = transaction
        last_6_transactions.append({
            'transaction_id': transaction_id,
            'emp_id': emp_id,
            'transfer_date': transfer_date,
            'amount': amount,
            'status': status
        })

    # print(last_6_transactions)

    skills = []
    query = "SELECT name_skill FROM skills WHERE emp_id = %s"
    cur.execute(query, (id,))

    # Fetch all the rows returned by the query
    rows = cur.fetchall()
    # Print the skills for the employee ID
    for row in rows:
        # print(row[0])
        skills.append(row[0])

    project_heading = []

   # Execute the query to retrieve project information
    query = """
    SELECT p.id, p.main_dept, p.start_date, p.status, p.time_taken, p.proj_type,
           e1.first_name, e1.last_name, e1.ph_num,
           e2.first_name, e2.last_name, e2.ph_num
    FROM projects p
    JOIN employee e1 ON p.proj_head_one = e1.id
    JOIN employee e2 ON p.proj_head_two = e2.id
    WHERE p.proj_head_one = %s OR p.proj_head_two = %s
"""

    cur.execute(query, (id, id))
    list_projects = cur.fetchall()

    for project in list_projects:
        project_id, main_dept, start_date, status, time_taken, proj_type, \
            head_one_first_name, head_one_last_name, head_one_ph_num, \
            head_two_first_name, head_two_last_name, head_two_ph_num = project

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num
        }
        project_heading.append(project_dict)

    # Print the retrieved project information
    # for project in project_heading:
    #     print(project)
    #     print()

    cur.close()
    conn.close()

    # print(len(cur_projects))
    # print(len(completed_projects))
    # print(len(project_heading))

    return {
        'name': f"{first_name} {last_name}",
        'phone': str(phone),
        'email': email,
        'cur_projects': cur_projects,
        'completed_projects': completed_projects,
        'num_cur_projects': len(cur_projects),
        'last_6_transactions': last_6_transactions,
        'num_completed_projects': len(completed_projects),
        'project_heading': project_heading,
        'skills': skills
    }


@app.route('/client', methods=['POST'])
def get_client():
    data = request.json
    client_id = data['id']
    conn = psycopg2.connect(
        "postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name, ph_num, institution, email FROM clients WHERE id = %s", (client_id,))

    # Fetch the result
    result = cursor.fetchone()
    print(result)

    cursor.execute("SELECT p.id, p.main_dept, p.start_date, p.status, p.time_taken, p.proj_type, \
                ph1.first_name AS head_one_first_name, ph1.last_name AS head_one_last_name, ph1.ph_num AS head_one_ph_num, \
                ph2.first_name AS head_two_first_name, ph2.last_name AS head_two_last_name, ph2.ph_num AS head_two_ph_num \
                FROM projects p \
                JOIN clientproject cp ON p.id = cp.proj_id \
                LEFT JOIN employee ph1 ON p.proj_head_one = ph1.id \
                LEFT JOIN employee ph2 ON p.proj_head_two = ph2.id \
                WHERE cp.client_id = %s", (client_id,))

    # Fetch all the project records
    projects = cursor.fetchall()

    project_list = []
    for project in projects:
        project_id, main_dept, start_date, status, time_taken, proj_type, \
            head_one_first_name, head_one_last_name, head_one_ph_num, \
            head_two_first_name, head_two_last_name, head_two_ph_num = project

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num
        }
        project_list.append(project_dict)

    print(project_list)

    return {
        'name': str(result[0]),
        'phone': str(result[1]),
        'institution': str(result[2]),
        'email': str(result[3]),
        'projects': project_list,
        'num_projects': len(projects)
    }


@app.route('/client_edit', methods=['POST'])
def set_client():
    data = request.json
    client_id = data['id']
    name = data['name']
    email = data['email']
    phone = data['phone']
    institution = data['institution']

    conn = psycopg2.connect(
        "postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()

    update_query = "UPDATE clients SET name = %s, email = %s, ph_num = %s, institution = %s WHERE id = %s"
    cursor.execute(update_query, (name, email, phone, institution, client_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {'message': 'Client details updated successfully'}


@app.route('/get_proj_employee', methods=['POST'])
def get_employee_proj():
    data = request.json
    skill = data['skillset']
    role = data['roleset']
    project_id = data['project_id']

    print(data)

    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()
    query = "SELECT id FROM roles WHERE name = %s"
    cursor.execute(query, (role,))

    # Fetch the result
    roleid = cursor.fetchone()

    cursor.execute("SELECT employee_project_allocation(%s, %s, %s, %s)", (project_id, roleid[0], skill, 1))
    result = cursor.fetchone()  # Fetch the result
    employee_added = bool(result)
    print(employee_added)

   
    return{'employee_added': employee_added}


    
@app.route('/add_review', methods=['POST'])
def set_review():
    data = request.json
    print(data)
    proj_id = data['projectId']
    review = data['review']
    sentiment_score = math.ceil(get_sentiment_score(review))
    print(sentiment_score)

    conn = psycopg2.connect(
        "postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()

    update_query = "UPDATE clientproject SET review = %s WHERE proj_id = %s"
    cursor.execute(update_query, (review, proj_id))

    # Update the performance score in the performancescore table
    update_query = "UPDATE performancescore SET performance = %s WHERE proj_id = %s"
    cursor.execute(update_query, (sentiment_score, proj_id))

    conn.commit()
    cursor.close()
    conn.close()

    return {'message': 'review added'}


def write_to_log(entry):
    """Write entry to the log file"""
    with open(log_file, "a") as f:
        f.write(entry + "\n")


def read_log():
    log_entries = []
    with open('project_log.txt', 'r') as f:
        for line in f:
            log_entries.append(line.strip())
    return log_entries

def get_all_projects():
    log_entries = read_log()
    project_data = []
    for entry in log_entries:
        entry_id = entry.split(" - ")[0].split(": ")[1]
        client_id = entry.split(" - ")[1].split(": ")[1].split(",")[0]
        description = entry.split("Description: ")[1]
        project_data.append({"entry_id": entry_id, "client_id": client_id, "description": description})
    return project_data

@app.route("/add_project", methods=["POST"])
def add_project():
    data = request.get_json()
    client_id = data.get("client_id")
    description = data.get("description")

    # Generate a unique identification number for the entry
    entry_id = len(read_log()) + 1

    # Create the log entry
    entry = f"ID: {entry_id} - Client ID: {client_id}, Description: {description}"

    # Write the entry to the log file
    write_to_log(entry)

    return jsonify({"success": True, "entry_id": entry_id})




@app.route("/log_entries", methods=["GET"])
def get_log_entries():
    log_entries = read_log()
    return jsonify(log_entries)

@app.route('/employee_edit', methods=['POST'])
def handle_edit_details():
    data = request.get_json()  # Get the JSON data from the request body
    
    # Extract the values from the data
    id = data['id']
    fname = data['fname']
    lname = data['lname']
    email = data['email']
    phone = data['phone']
    
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()

    update_query = "UPDATE employee SET first_name = %s, last_name = %s, email = %s, ph_num = %s WHERE id = %s"
    cursor.execute(update_query, (fname, lname, email, phone, id))
    conn.commit()

    cursor.close()
    conn.close()
    
    return {'message': 'Empployee details updated successfully'}




@app.route('/hr', methods=['POST'])
def get_admin():
    data = request.json
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
    cursor = conn.cursor()

    # get projects function
    query = """
SELECT
    p.id AS project_id,
    p.main_dept,
    p.start_date,
    p.status,
    p.time_taken,
    p.proj_type,
    e1.first_name AS head_one_first_name,
    e1.last_name AS head_one_last_name,
    e1.ph_num AS head_one_ph_num,
    e2.first_name AS head_two_first_name,
    e2.last_name AS head_two_last_name,
    e2.ph_num AS head_two_ph_num,
    cp.feedback,
    cp.review
FROM
    projects p
    LEFT JOIN employee e1 ON p.proj_head_one = e1.id
    LEFT JOIN employee e2 ON p.proj_head_two = e2.id
    LEFT JOIN clientproject cp ON p.id = cp.proj_id
WHERE
    p.id IN (
        SELECT DISTINCT
            ps.proj_id
        FROM
            performancescore ps
        WHERE
            ps.performance IS NULL OR ps.performance = null
    );
"""
    
    cursor.execute(query)
    result = cursor.fetchall()

    cur_projects = []
    for project in result:
        project_id, main_dept, start_date, status, time_taken, proj_type, head_one_first_name, \
            head_one_last_name, head_one_ph_num, head_two_first_name, head_two_last_name, \
            head_two_ph_num, feedback, review = project

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num,
            "review": review
        }
        cur_projects.append(project_dict)

    query = """
SELECT p.id AS project_id, p.main_dept, p.start_date, p.status, p.time_taken, p.proj_type,
       e1.first_name AS head_one_first_name, e1.last_name AS head_one_last_name,
       e1.ph_num AS head_one_ph_num, e2.first_name AS head_two_first_name,
       e2.last_name AS head_two_last_name, e2.ph_num AS head_two_ph_num,
       cp.feedback, cp.review
FROM projects p
JOIN employee e1 ON p.proj_head_one = e1.id
JOIN employee e2 ON p.proj_head_two = e2.id
JOIN clientproject cp ON p.id = cp.proj_id
WHERE p.status = 'Completed';
"""
    completed_projects = []
    cursor.execute(query)
    for row in cursor.fetchall():
        project_id, main_dept, start_date, status, time_taken, proj_type, \
        head_one_first_name, head_one_last_name, head_one_ph_num, \
        head_two_first_name, head_two_last_name, head_two_ph_num, feedback, review = row

        project_dict = {
            "project_id": project_id,
            "main_dept": main_dept,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "status": status,
            "time_taken": time_taken,
            "proj_type": proj_type,
            "head_one_first_name": head_one_first_name,
            "head_one_last_name": head_one_last_name,
            "head_one_ph_num": head_one_ph_num,
            "head_two_first_name": head_two_first_name,
            "head_two_last_name": head_two_last_name,
            "head_two_ph_num": head_two_ph_num,
            "review": review
        }
        completed_projects.append(project_dict)

    last_6_transactions = [
        {'part1': 'Entry 1 Part 1', 'part2': 'Entry 1 Part 2', 'part3': 'Entry 1 Part 3',
            'part4': 'Entry 1 Part 4', 'part5': 'Entry 1 Part 5'},
        {'part1': 'Entry 2 Part 1', 'part2': 'Entry 2 Part 2', 'part3': 'Entry 2 Part 3',
            'part4': 'Entry 2 Part 4', 'part5': 'Entry 2 Part 5'},
        {'part1': 'Entry 3 Part 1', 'part2': 'Entry 3 Part 2', 'part3': 'Entry 3 Part 3',
            'part4': 'Entry 3 Part 4', 'part5': 'Entry 3 Part 5'},
        {'part1': 'Entry 4 Part 1', 'part2': 'Entry 4 Part 2', 'part3': 'Entry 4 Part 3',
            'part4': 'Entry 4 Part 4', 'part5': 'Entry 4 Part 5'},
        {'part1': 'Entry 5 Part 1', 'part2': 'Entry 5 Part 2', 'part3': 'Entry 5 Part 3',
            'part4': 'Entry 5 Part 4', 'part5': 'Entry 5 Part 5'},
        {'part1': 'Entry 6 Part 1', 'part2': 'Entry 6 Part 2', 'part3': 'Entry 6 Part 3',
            'part4': 'Entry 6 Part 4', 'part5': 'Entry 6 Part 5'},
    ]
    requested_projects = get_all_projects()
    print(requested_projects)

 
    return {
        'name': "sid",
        'phone': "8xxxxxx8",
        'institution': "IIT pkd",
        'email': "sid@gmail.com",
        'cur_projects': cur_projects,
        'completed_projects': completed_projects,
        'num_cur_projects': len(cur_projects),
        'last_6_transactions': last_6_transactions,
        'num_completed_projects': len(completed_projects),
        'requested_projects': requested_projects

    }

@app.route('/add_proj_head_client', methods=['POST'])
def set_project():
    try:
        data = request.json
        client_id = data['client_id']
        head1 = data['head1']
        head2 = data['head2']
        dept = data['dept']
        entry_id_del=int(data['entry'])


        conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/ems")
        cursor = conn.cursor()
        project_id = 0

        cursor.execute("SELECT MAX(id) FROM projects;")
        max_id = cursor.fetchone()[0]
        if max_id is None:
            project_id = 1
        else:
            project_id = max_id + 1

        status = "Ongoing"
        start_date = datetime.now().date()
        start_date_formatted = start_date.strftime("%Y-%m-%d")

        cursor.execute("select id from roles where dept = %s;", (dept,))
        role_id = cursor.fetchall()[-1]

        cursor.execute("INSERT INTO projects (id, main_dept, proj_head_one, proj_head_two, start_date, status) VALUES (%s, %s, %s, %s, %s, %s);", (project_id, dept, head1, head2, start_date_formatted, status))

        cursor.execute("INSERT INTO clientproject (proj_id, client_id) VALUES (%s, %s);", (project_id, client_id))

        cursor.execute("INSERT INTO performancescore (proj_id, role_id, emp_id) VALUES (%s, %s, %s);", (project_id, role_id, head1))
        cursor.execute("INSERT INTO performancescore (proj_id, role_id, emp_id) VALUES (%s, %s, %s);", (project_id, role_id, head2))
        print("here")
        with open('project_log.txt', 'r') as file:
            lines = file.readlines()

        found_entry = False

        with open('project_log.txt', 'w') as file:
            for line in lines:
                if line.startswith('ID:'):
                    current_entry_id = int(line.split('-')[0].split(':')[1].strip())
                    if current_entry_id == entry_id_del:
                        found_entry = True
                        continue  # Skip writing the line for the entry to be deleted
                    file.write(line)

        if found_entry:
            print("Entry deleted successfully.")
        else:
            print("Entry with ID {} not found.".format(entry_id_del))

        conn.commit()
        file.close()

        return jsonify({"project_added": True})

    except (psycopg2.Error, KeyError) as e:
        return jsonify({"project_added": False})

    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()


    


if __name__ == "__main__":
    app.run("0.0.0.0")
