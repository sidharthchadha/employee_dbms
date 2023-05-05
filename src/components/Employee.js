import React from 'react';
import "../components/employee.css"
import { OverlayTrigger, Popover, Form, Button } from 'react-bootstrap';

import { Dropdown } from "react-bootstrap";


class Employee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: "sid",
      phone: "",
      email: "",
      cur_projects: [],
      completed_projects: [],
      startIndex: 0,
      endIndex: 5,
      startIndex2: 0,
      endIndex2: 5,
      startIndex3: 0,
      endIndex3: 5,
      num_cur_projects: 0,
      entries: [],
      num_completed_projects: 0,
      project_heading: [],
      skills: [],
      selectedSkill: "",
      selectedRole: "",
      editedfName: "",
      editedlName: "",
      editedPhone: "",
      editedEmail: "",
      showEditPopover: false,
      employeeAdded: false

    };
  }
  handleEditFormChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleEditFormSubmit = (e) => {
    e.preventDefault();

    fetch('/employee_edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id,
        fname: this.state.editedfName,
        lname: this.state.editedlName,
        email: this.state.editedEmail,
        phone: this.state.editedPhone

      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState()
      );
    this.setState({
      editedfName: "",
      editedlName: "",
      editedPhone: "",
      editedEmail: "",
      showEditPopover: false
    }, () => {
      this.fetchEmployeeData();
    });

    console.log(this.state.id);
  };

  fetchEmployeeData() {
    fetch('/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          name: data.name,
          phone: data.phone,
          institution: data.institution,
          email: data.email,
          cur_projects: data.cur_projects,
          completed_projects: data.completed_projects,
          num_cur_projects: data.num_cur_projects,
          entries: data.last_6_transactions,
          project_heading: data.project_heading,
          num_completed_projects: data.num_completed_projects,
          skills: data.skills

        })
      );

  }

  handleroleSelect = (eventKey) => {
    // Update the selectedRole state when a role is selected
    this.setState({ selectedRole: eventKey });
  };

  handleSkillSelect = (eventKey) => {
    // Update the selectedSkill state when a skill is selected
    this.setState({ selectedSkill: eventKey });
  };


  handleaddemployee = (projectId) => {
    const { selectedSkill, selectedRole } = this.state;
    console.log(projectId);
    fetch('/get_proj_employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        skillset: selectedSkill,
        roleset: selectedRole,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the response data
        console.log(data);
        this.setState({
          employeeAdded: data.employee_added, // Assuming 'employee_added' is a property in the response
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  componentDidMount() {
    fetch('/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          name: data.name,
          phone: data.phone,
          institution: data.institution,
          email: data.email,
          cur_projects: data.cur_projects,
          completed_projects: data.completed_projects,
          num_cur_projects: data.num_cur_projects,
          entries: data.last_6_transactions,
          project_heading: data.project_heading,
          num_completed_projects: data.num_completed_projects,
          skills: data.skills

        })
      );
  }


  handleNext = () => {
    const { startIndex, endIndex, cur_projects } = this.state;
    if (endIndex < cur_projects.length) {
      this.setState({ startIndex: startIndex + 5, endIndex: endIndex + 5 });
    }

  }

  handlePrevious = () => {
    const { startIndex, endIndex } = this.state;
    if (startIndex > 0) {
      this.setState({ startIndex: startIndex - 5, endIndex: endIndex - 5 });
    }

  }
  handleNext2 = () => {
    const { startIndex2, endIndex2, completed_projects } = this.state;

    if (endIndex2 < completed_projects.length) {
      this.setState({ startIndex2: startIndex2 + 5, endIndex2: endIndex2 + 5 });
    }

  }

  handlePrevious2 = () => {
    const { startIndex2, endIndex2 } = this.state;
    if (startIndex2 > 0) {
      this.setState({ startIndex2: startIndex2 - 5, endIndex2: endIndex2 - 5 });
    }

  }
  handleNext3 = () => {
    const { startIndex3, endIndex3, project_heading } = this.state;

    if (endIndex3 < project_heading.length) {
      this.setState({ startIndex3: startIndex3 + 5, endIndex3: endIndex3 + 5 });
    }

  }

  handleEditDetails = () => {
    this.setState({ showEditPopover: true });
  };

  handlePrevious3 = () => {
    const { startIndex3, endIndex3 } = this.state;
    if (startIndex3 > 0) {
      this.setState({ startIndex3: startIndex3 - 5, endIndex3: endIndex3 - 5 });
    }

  }
  handleLogout = () => {
    window.location.reload();
  };

  render() {

    const imageStyle = {
      position: 'relative',
      top: '20px',
      left: '1600px',
      width: '130px',
      height: '130px',
    };
    const { employeeAdded } = this.state;

    return (

      <div className="client-container">
        <div className="client-info">
          <img src="https://i.pravatar.cc/300" alt="Profile" style={imageStyle} />
          <button type="button" className="btn btn-outline-danger logout-button" onClick={this.handleLogout}>
            Logout
          </button>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            show={this.state.showEditPopover}
            overlay={
              <Popover>
                <Popover.Header as="h3">Edit Details</Popover.Header>
                <Popover.Body>
                  <Form onSubmit={this.handleEditFormSubmit}>
                    <Form.Group controlId="formFName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="editedfName"
                        value={this.state.editedfName}
                        onChange={this.handleEditFormChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formLName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="editedlName"
                        value={this.state.editedlName}
                        onChange={this.handleEditFormChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="editedPhone"
                        value={this.state.editedPhone}
                        onChange={this.handleEditFormChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="editedEmail"
                        value={this.state.editedEmail}
                        onChange={this.handleEditFormChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </Form>
                </Popover.Body>
              </Popover>
            }
          >
            <button type="button" className="btn btn-outline-primary edit-button" onClick={this.handleEditDetails}>
              Edit Details
            </button>
          </OverlayTrigger>
          <br>
          </br>
          <h2>{this.state.name}</h2>
          <p>Phone: {this.state.phone}</p>
          <p>Email: {this.state.email}</p>

        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th><div className="client-projects-box">
                <h3>Current Projects</h3>
                {this.state.cur_projects.slice(this.state.startIndex, this.state.endIndex).map(project => (
                  <div key={project.project_id}>
                    <p>{project.main_dept}</p>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <strong>Project ID: {project.project_id}</strong>
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={
                                <Popover>
                                  <Popover.Header>Project Heads</Popover.Header>
                                  <Popover.Body>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/300" alt="Profile" style={imageStyle} />
                                      </div>

                                      {project.head_one_first_name} {project.head_one_last_name}

                                    </p>
                                    <p> phone: {project.head_one_ph_num}</p>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/200" alt="Profile" style={imageStyle} />
                                      </div>
                                      {project.head_two_first_name} {project.head_two_last_name}
                                    </p>
                                    <p>phone: {project.head_two_ph_num}</p>
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <button type="button" className="btn btn-lg btn-danger">
                                Project Heads
                              </button>
                            </OverlayTrigger>
                            <strong>
                              <p>Main Department: {project.main_dept}</p>
                              <p>Start Date: {project.start_date}</p>
                              <p>Status: {project.status}</p>
                              <p>Time Taken: {project.time_taken}</p>
                              <p>Project Type: {project.proj_type}</p>
                              {project.status === 'Completed' && (
                                <div>
                                  <form onSubmit={(e) => this.handleReviewSubmit(e, project.project_id)}>
                                    <div className="form-group">
                                      <label htmlFor="review">Review</label>
                                      <textarea
                                        id="review"
                                        className="form-control"
                                        value={this.state.review}
                                        onChange={(e) => this.setState({ review: e.target.value })}
                                      ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                      Submit Review
                                    </button>
                                  </form>
                                  {this.state.successMessage && <p>{this.state.successMessage}</p>}
                                </div>
                              )}

                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pagination">
                  <button className="btn" onClick={this.handlePrevious} disabled={this.state.startIndex === 0}>Previous</button>
                  <button className="btn" onClick={this.handleNext} disabled={this.state.endIndex >= this.state.num_cur_projects}>Next</button>
                </div>

              </div></th>
              <th><div className="client-headed-projects-box">
                <h3>Projects Headed</h3>
                {this.state.project_heading.slice(this.state.startIndex3, this.state.endIndex3).map(project => (
                  <div key={project.id}>
                    <p><strong>Project ID : {project.main_dept}</strong></p>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {project.project_id}
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={
                                <Popover>
                                  <Popover.Header>Project Heads</Popover.Header>
                                  <Popover.Body>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/300" alt="Profile" style={imageStyle} />
                                      </div>

                                      {project.head_one_first_name} {project.head_one_last_name}

                                    </p>
                                    <p> phone: {project.head_one_ph_num}</p>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/200" alt="Profile" style={imageStyle} />
                                      </div>
                                      {project.head_two_first_name} {project.head_two_last_name}
                                    </p>
                                    <p>phone: {project.head_two_ph_num}</p>
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <button type="button" className="btn btn-lg btn-danger">
                                Project Heads
                              </button>
                            </OverlayTrigger>
                            <strong>
                              <p>Main Department: {project.main_dept}</p>
                              <p>Start Date: {project.start_date}</p>
                              <p>Status: {project.status}</p>
                              <p>Time Taken: {project.time_taken}</p>
                              <p>Project Type: {project.proj_type}</p>
                              {project.status === 'Ongoing' && (
                                <div>
                                  <Dropdown onSelect={this.handleroleSelect}>
                                    <Dropdown.Toggle variant="primary" id="roleSelectDropdown">
                                      Role
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item eventKey="Production Manager">Production Manager</Dropdown.Item>
                                      <Dropdown.Item eventKey="Marketing director">Marketing director</Dropdown.Item>
                                      <Dropdown.Item eventKey="R&D Manager">R&D Manager</Dropdown.Item>
                                      <Dropdown.Item eventKey="HR Manager">HR Manager</Dropdown.Item>
                                      <Dropdown.Item eventKey="Market research analyst">Market research analyst</Dropdown.Item>
                                      <Dropdown.Item eventKey="Project manager">Project manager</Dropdown.Item>
                                      <Dropdown.Item eventKey="Systems manger	">Systems manger</Dropdown.Item>
                                      <Dropdown.Item eventKey="Intelligence analyst">Intelligence analyst</Dropdown.Item>
                                      <Dropdown.Item eventKey="Assessor">Assessor</Dropdown.Item>
                                      <Dropdown.Item eventKey="Team lead">Team lead</Dropdown.Item>
                                      <Dropdown.Item eventKey="Senior SDE">Senior SDE</Dropdown.Item>
                                      <Dropdown.Item eventKey="Training Instructor">Training Instructor</Dropdown.Item>
                                      <Dropdown.Item eventKey="Analyst">Analyst</Dropdown.Item>
                                      <Dropdown.Item eventKey="SDE">SDE</Dropdown.Item>
                                      <Dropdown.Item eventKey="Training assistant">Training assistant</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <Dropdown onSelect={this.handleSkillSelect}>
                                    <Dropdown.Toggle variant="primary" id="skillSelectDropdown">
                                      Skill
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item eventKey="Web development">Web development</Dropdown.Item>
                                      <Dropdown.Item eventKey="Data Analysis">Data Analysis</Dropdown.Item>
                                      <Dropdown.Item eventKey="Data Science">Data Science</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <button type="button" className="add-employee" onClick={() => { console.log(project); this.handleaddemployee(project.project_id); }}>
                                    ADD Employee
                                  </button>
                                  <div>
                                    {employeeAdded && <p>Employee added successfully!</p>}
                                  </div>
                                </div>

                              )}


                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pagination">
                  <button className="btn" onClick={this.handlePrevious3} disabled={this.state.startIndex3 === 0}>Previous</button>
                  <button className="btn" onClick={this.handleNext3} disabled={this.state.endIndex3 >= this.state.project_heading}>Next</button>
                </div>
              </div></th>
              <th>   <div className="client-completed-projects-box">
                <h3>Completed Projects</h3>
                {this.state.completed_projects.slice(this.state.startIndex2, this.state.endIndex2).map(project => (
                  <div key={project.id}>
                    <p>{project.name}</p>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <strong>Project ID : {project.project_id}</strong>
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={
                                <Popover>
                                  <Popover.Header>Project Heads</Popover.Header>
                                  <Popover.Body>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/300" alt="Profile" style={imageStyle} />
                                      </div>

                                      {project.head_one_first_name} {project.head_one_last_name}

                                    </p>
                                    <p> phone: {project.head_one_ph_num}</p>
                                    <p>
                                      <div>
                                        <img src="https://i.pravatar.cc/200" alt="Profile" style={imageStyle} />
                                      </div>
                                      {project.head_two_first_name} {project.head_two_last_name}
                                    </p>
                                    <p>phone: {project.head_two_ph_num}</p>
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <button type="button" className="btn btn-lg btn-danger">
                                Project Heads
                              </button>
                            </OverlayTrigger>
                            <strong>
                              <p>Main Department: {project.main_dept}</p>
                              <p>Start Date: {project.start_date}</p>
                              <p>Status: {project.status}</p>
                              <p>Time Taken: {project.time_taken}</p>
                              <p>Project Type: {project.proj_type}</p>
                              {project.status === 'Completed' && (
                                <div>
                                  <strong>
                                    Review by Client :
                                  </strong>
                                  <br></br>
                                  <h6>{project.review}</h6>



                                </div>
                              )}

                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pagination">
                  <button className="btn" onClick={this.handlePrevious2} disabled={this.state.startIndex2 === 0}>Previous</button>
                  <button className="btn" onClick={this.handleNext2} disabled={this.state.endIndex2 >= this.state.num_completed_projects}>Next</button>
                </div>

              </div></th>
            </tr>
          </thead>
        </table>



        <table className="table table-striped">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Emp ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.slice(0, 6).map((entry, index) => (
              <tr key={index}>
                <td>{entry.transaction_id}</td>
                <td>{entry.emp_id}</td>
                <td>{entry.transfer_date}</td>
                <td>{entry.amount}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    );
  }
}
export default Employee;