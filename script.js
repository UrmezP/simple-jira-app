class Project {
  static _counter = 0;
  constructor(title, duration) {
    this._instanceCount = ++Project._counter;
    this._title = title;
    this._duration = duration;
  }

  get projectId() {
    return this._instanceCount;
  }

  get titleState() {
    return this._title;
  }

  get durationState() {
    return this._duration;
  }
}

const listOfProjects = [];

const newProjectButton = document.getElementById("newProject");
const newProjectInputDialog = document.getElementById("newProjectDialog");
const submitNewProject = document.querySelector("#newProjectDialog form");
const projectFlow = document.querySelector("#projectFlow");

function newProjectButtonClick() {
  newProjectInputDialog.showModal();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function updateProjectList() {
  // remove New column div
  projectFlow.querySelector("div:nth-of-type(1)").removeChild();

  // create fresh New column
  const newDiv = document.createElement("div");
  const newHeading = document.createElement("h3");
  newHeading.innerText = "New";
  newDiv.append(newHeading);
  projectFlow.prepend(newDiv);

  // map over listOfProject array, create elements and appendChild to projectFlow element
  listOfProjects.map((project) => {
    const projectHTML = document.createElement("article");
    const projectId = document.createElement("span");
    const projectTitle = document.createElement("h3");
    const projectDuration = document.createElement("span");

    projectId.innerText = `Project #${project.projectId}`;
    projectTitle.innerText = `Title: ${project.titleState}`;
    projectDuration.innerText = `Duration - ${project.durationState} days`;
    projectHTML.setAttribute("id", project.projectId);
    projectHTML.appendChild(projectId);
    projectHTML.appendChild(projectTitle);
    projectHTML.appendChild(projectDuration);

    // make it dragabble

    projectHTML.setAttribute("draggable", "true");
    projectHTML.addEventListener("dragstart", drag);

    newDiv.appendChild(projectHTML);
  });
}

function addNewProject(project) {
  const newDiv = projectFlow.querySelector("div:nth-of-type(1)");

  const projectHTML = document.createElement("article");
  const projectId = document.createElement("span");
  const projectTitle = document.createElement("h3");
  const projectDuration = document.createElement("span");

  projectId.innerText = `Project #${project.projectId}`;
  projectTitle.innerText = `Title: ${project.titleState}`;
  projectDuration.innerText = `Duration - ${project.durationState} days`;
  projectHTML.setAttribute("id", project.projectId);
  projectHTML.appendChild(projectId);
  projectHTML.appendChild(projectTitle);
  projectHTML.appendChild(projectDuration);

  // make it dragabble

  projectHTML.setAttribute("draggable", "true");
  projectHTML.addEventListener("dragstart", drag);

  newDiv.appendChild(projectHTML);
}

function submitNewProjectInputDialog(e) {
  e.preventDefault();
  const title = e.target[0].value;
  const duration = e.target[1].value;
  const freshProject = new Project(title, duration);
  listOfProjects.push(freshProject);
  //   updateProjectList();
  addNewProject(freshProject);
  newProjectInputDialog.close();
}

newProjectButton.addEventListener("click", newProjectButtonClick);
submitNewProject.addEventListener("submit", submitNewProjectInputDialog);
