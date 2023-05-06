import React from 'react';
import { OverlayTrigger, Popover, Form, Button } from 'react-bootstrap';
import "../components/client.css"


class Client extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: "sid",
      phone: "",
      institution: "",
      email: "",
      projects: [],
      startIndex: 0,
      endIndex: 5,
      num_projects: 0,
      showEditPopover: false,
      editedName: "",
      editedPhone: "",
      editedInstitution: "",
      editedEmail: "",
      review: '',
      successMessage: '',
      newProjectDescription: '',

    };
  }

  handleAddProject = () => {
   
    const description = prompt('Enter the project description:');
    if (description) {
      // Make a request to the backend to add the new project
      fetch('/add_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.state.id,
          description: description
        })
      })
        .then(response => response.json())
        .then(data => {
          
          if (data.success) {
            // Display a success message
            this.setState({ successMessage: 'New project requested successfully' });
            // Fetch the updated client data to refresh the project list
            this.fetchClientData();
          } else {
            // Display an error message
            this.setState({ successMessage: 'Failed to request new project' });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.setState({ successMessage: 'Failed to request new project' });
        });
    }
  };

  componentDidMount() {
    this.fetchClientData();
  }

  fetchClientData() {
    fetch('/client', {
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
          projects: data.projects,
          num_projects: data.num_projects
        })
      );
  }


  handleLogout = () => {
    window.location.reload();
  };

  handleEditDetails = () => {
    this.setState({ showEditPopover: true });
  };

  handleEditFormSubmit = (e) => {
    e.preventDefault();
    // Perform the data update API call here, e.g., using fetch or Axios
    // Upon successful response, call fetchClientData() to update the client's data
    // Reset the form and hide the popover
    fetch('/client_edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.editedName,
        email: this.state.editedEmail,
        phone: this.state.editedPhone,
        institution: this.state.editedInstitution
      })
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
        })
      );
    this.setState({
      editedName: "",
      editedPhone: "",
      editedInstitution: "",
      editedEmail: "",
      showEditPopover: false
    }, () => {
      this.fetchClientData();
    });
  };

  handleEditFormChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleNext = () => {
    const { startIndex, endIndex, projects } = this.state;
    console.log("here");
    if (endIndex < projects.length) {
      this.setState({ startIndex: startIndex + 5, endIndex: endIndex + 5 });
    }

  }

  handlePrevious = () => {
    const { startIndex, endIndex } = this.state;
    if (startIndex > 0) {
      this.setState({ startIndex: startIndex - 5, endIndex: endIndex - 5 });
    }

  }


  handleReviewSubmit = async (e, projectId) => {
    e.preventDefault();

    try {
      const response = await fetch('/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: projectId,
          review: this.state.review
        })
      });

      if (response.ok) {
        this.setState({ successMessage: 'Review added successfully' });
      } else {
        // Handle error case
        this.setState({ successMessage: 'Failed to add review' });
      }
    } catch (error) {
      // Handle error case
      console.error('Error:', error);
      this.setState({ successMessage: 'Failed to add review' });
    }
  };


  render() {
    console.log(this.state.projects);
    const imageStyle = {
      width: '80px',
      height: '80px',
    };
    const imageStyle2 = {
      position: 'relative',
      top: '20px',
      left: '1500px',
      width: '150px',
      height: '150px',
    };


    return (
      <div className="client-container">
        <div className="client-info">
          <h2>{this.state.name}</h2>
          <div>
            <img src="https://i.pravatar.cc/400" alt="Profile" style={imageStyle2} />
            <button type="button" className="btn btn-outline-danger logout-button" onClick={this.handleLogout}>
              Logout
            </button>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              show={this.state.showEditPopover}
              overlay={
                <Popover>
                  <Popover.Header as="h3"><div id="text-form">Edit Details</div></Popover.Header>
                  <Popover.Body>
                    <Form onSubmit={this.handleEditFormSubmit}>
                      <Form.Group controlId="formName">
                        <Form.Label><div id="text-form">Name</div></Form.Label>
                        <Form.Control
                          type="text"
                          name="editedName"
                          value={this.state.editedName}
                          onChange={this.handleEditFormChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPhone">
                        <Form.Label><div id="text-form">Phone</div></Form.Label>
                        <Form.Control
                          type="text"
                          name="editedPhone"
                          value={this.state.editedPhone}
                          onChange={this.handleEditFormChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formInstitution">
                        <Form.Label><div id="text-form">Institution</div></Form.Label>
                        <Form.Control
                          type="text"
                          name="editedInstitution"
                          value={this.state.editedInstitution}
                          onChange={this.handleEditFormChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formEmail">
                        <Form.Label><div id="text-form">Email</div></Form.Label>
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
            
          </div>
          <strong>
            <p>Phone: {this.state.phone}</p>
            <p>Institution: {this.state.institution}</p>
            <p>Email: {this.state.email}</p>
          </strong>
        </div>
        <button className="btn btn-primary add-project-button" onClick={this.handleAddProject}>
            Add Project
        </button>
          {this.state.successMessage && <p>{this.state.successMessage}</p>}

        <div className="client-projects-box">

          <h2>Projects</h2>
          {this.state.projects.slice(this.state.startIndex, this.state.endIndex).map(project => (
            <div key={project.project_id}>
              <p>Project ID: {project.project_id}</p>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Project Details
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
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
            <button className="btn" onClick={this.handleNext} disabled={this.state.endIndex >= this.state.num_projects}>Next</button>
          </div>

        </div>
      </div >
    );
  }
}
export default Client;