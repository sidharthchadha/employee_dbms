import React from 'react';

class Client extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "sid",
      phone: "",
      institution: "",
      email: "",
      projects: [],
      startIndex: 0,
      endIndex: 5,
      num_projects: 0
    };
  }
  componentDidMount() {
    fetch('/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'sid',
        startindex:this.state.startIndex,
        endindex:this.state.endIndex,
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

  render() {
    return (
      <div className="client-container">
        <div className="client-info">
          <h2>{this.name}</h2>
          <p>Phone: {this.phone}</p>
          <p>Institution: {this.institution}</p>
          <p>Email: {this.email}</p>
        </div>
        <div className="client-projects-box">
          <h3>Projects</h3>
          {this.state.projects.slice(this.state.startIndex, this.state.endIndex).map(project => (
            <div key={project.id}>
              <p>{project.name}</p>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      print related data
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <strong>This is the first item's accordion body.</strong>
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
      </div>
    );
  }
}
export default Client;