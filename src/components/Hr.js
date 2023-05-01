import React from 'react';
import "../components/hr.css"
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
      project_heading: [],
      skills: []
    };
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

  handlePrevious3 = () => {
    const { startIndex3, endIndex3 } = this.state;
    if (startIndex3 > 0) {
      this.setState({ startIndex3: startIndex3 - 5, endIndex3: endIndex3 - 5 });
    }

  }

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
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th><div className="client-projects-box">
                <h3>Current Projects</h3>
                {this.state.cur_projects.slice(this.state.startIndex, this.state.endIndex).map(project => (
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
                  <button className="btn" onClick={this.handleNext} disabled={this.state.endIndex >= this.state.num_cur_projects}>Next</button>
                </div>

              </div></th>
              <th><div className="client-headed-projects-box">
                <h3>Projects Headed</h3>
                {this.state.completed_projects.slice(this.state.startIndex3, this.state.endIndex3).map(project => (
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