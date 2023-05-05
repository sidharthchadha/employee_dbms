import React from 'react';
import "../components/hr.css"
import { OverlayTrigger, Popover, Form, Button } from 'react-bootstrap';

import { Dropdown } from "react-bootstrap";




class Employee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      requested_projects: [],
      project_Added: false,
      selectedSkill: "",
      selectedRole: "",
      selectedDept: "",

    };
  }

  handleroleSelect = (eventKey) => {
    // Update the selectedRole state when a role is selected
    this.setState({ selectedRole: eventKey });
  };

  handleSkillSelect = (eventKey) => {
    // Update the selectedSkill state when a skill is selected
    this.setState({ selectedSkill: eventKey });
  };
  handledeptSelect = (eventKey) => {
    // Update the selectedSkill state when a skill is selected
    this.setState({ selectedDept: eventKey });
  };

  handleaddproject = (clientId,entry_id) => {
    const { selectedSkill, selectedRole } = this.state;

    fetch('/add_proj_head_client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        head1: selectedSkill,
        head2: selectedRole,
        dept: this.state.selectedDept,
        entry:entry_id

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the response data
        console.log(data);
        this.setState({
          project_Added: data.project_added, // Assuming 'employee_added' is a property in the response
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      this.fetch_hr();
  };

  fetch_hr(){
    fetch('/hr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'sid'
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({

          cur_projects: data.cur_projects,
          completed_projects: data.completed_projects,
          num_cur_projects: data.num_cur_projects,
          entries: data.last_6_transactions,
          project_heading: data.project_heading,
          num_completed_projects: data.num_completed_projects,
          skills: data.skills,
          requested_projects: data.requested_projects

        })
      );

  }


  componentDidMount() {
    fetch('/hr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'sid'
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({

          cur_projects: data.cur_projects,
          completed_projects: data.completed_projects,
          num_cur_projects: data.num_cur_projects,
          entries: data.last_6_transactions,
          project_heading: data.project_heading,
          num_completed_projects: data.num_completed_projects,
          skills: data.skills,
          requested_projects: data.requested_projects

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

    return (

      <div className="admin-container">
        <button type="button" className="btn btn-outline-danger logout-button" onClick={this.handleLogout}>
          Logout
        </button>
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
                              <p>Project Type: {project.proj_type}</p>

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


              <th>   <div className="client-completed-projects-box">
                <h3>Completed Projects</h3>
                {this.state.completed_projects.slice(this.state.startIndex2, this.state.endIndex2).map(project => (
                  <div key={project.id}>
                    <p>{project.main_dept}</p>
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
              <th><div className="client-headed-projects-box">
                <h3>Requested Projects</h3>
                {this.state.requested_projects.slice(this.state.startIndex3, this.state.endIndex3).map(project => (
                  <div key={project.entry_id}>
                    <p><strong>Client ID : {project.client_id}</strong></p>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">

                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <strong>
                              <p>Description: {project.description}</p>
                              {(
                                <div>
                                  <Dropdown onSelect={this.handleroleSelect}>
                                    <Dropdown.Toggle variant="primary" id="roleSelectDropdown">
                                      Project Head 1
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item eventKey="1">Emp ID 1</Dropdown.Item>
                                      <Dropdown.Item eventKey="2">Emp ID 2</Dropdown.Item>
                                      <Dropdown.Item eventKey="3">Emp ID 3</Dropdown.Item>
                                      <Dropdown.Item eventKey="4">Emp ID 4</Dropdown.Item>
                                      <Dropdown.Item eventKey="5">Emp ID 5</Dropdown.Item>

                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <Dropdown onSelect={this.handleSkillSelect}>
                                    <Dropdown.Toggle variant="primary" id="skillSelectDropdown">
                                      Project Head 2
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item eventKey="1">Emp ID 1</Dropdown.Item>
                                      <Dropdown.Item eventKey="2">Emp ID 2</Dropdown.Item>
                                      <Dropdown.Item eventKey="3">Emp ID 3</Dropdown.Item>
                                      <Dropdown.Item eventKey="4">Emp ID 4</Dropdown.Item>
                                      <Dropdown.Item eventKey="5">Emp ID 5</Dropdown.Item>

                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <Dropdown onSelect={this.handledeptSelect}>
                                    <Dropdown.Toggle variant="primary" id="skillSelectDropdown">
                                      Project Department
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>

                                      <Dropdown.Item eventKey="IT Services">IT Services</Dropdown.Item>
                                      <Dropdown.Item eventKey="R&D">R&D</Dropdown.Item>
                                      <Dropdown.Item eventKey="Marketing">Marketing</Dropdown.Item>
                                      <Dropdown.Item eventKey="Product Development">Product Development</Dropdown.Item>
                                      <Dropdown.Item eventKey="5">Emp ID 5</Dropdown.Item>

                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <button type="button" className="add-employee" onClick={() => { console.log(project); this.handleaddproject(project.client_id,project.entry_id); }}>
                                    ADD Employee
                                  </button>
                                  <div>
                                    {this.state.project_Added && <p>Employee added successfully!</p>}
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
            </tr>
          </thead>
        </table>



        <table className="table table-striped">
          <thead>
            <tr>
              <th>Part 1</th>
              <th>Part 2</th>
              <th>Part 3</th>
              <th>Part 4</th>
              <th>Part 5</th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.slice(0, 6).map((entry, index) => (
              <tr key={index}>
                <td>{entry.part1}</td>
                <td>{entry.part2}</td>
                <td>{entry.part3}</td>
                <td>{entry.part4}</td>
                <td>{entry.part5}</td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    );
  }
}
export default Employee;