class Project {
  static _counter = 0;
  constructor(title, duration, state = "NEW") {
    this._instanceCount = ++Project._counter;
    this._title = title;
    this._duration = duration;
    this._state = state;
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

  get flowState() {
    return this._state;
  }
}

let listOfProjects = [];

const newProjectButton = document.getElementById("newProject");
const newProjectInputDialog = document.getElementById("newProjectDialog");
const submitNewProject = document.querySelector("#newProjectDialog form");
const projectFlow = document.querySelector("#projectFlow");

// check if projects already present in localstorage

if (localStorage.getItem("simple-jira-projects")) {
  listOfProjects = JSON.parse(localStorage.getItem("simple-jira-projects"));

  // add project to flow
  listOfProjects.map((project) =>
    addNewProject(new Project(project._title, project._duration))
  );
}

function newProjectButtonClick() {
  newProjectInputDialog.showModal();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function addNewProject(project) {
  const newDiv = projectFlow.querySelector("div:nth-of-type(1)");
  const inProgressDiv = projectFlow.querySelector("div:nth-of-type(2)");
  const completedDiv = projectFlow.querySelector("div:nth-of-type(3)");
  const archivedDiv = projectFlow.querySelector("div:nth-of-type(4)");

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

  switch (project.flowState) {
    case "NEW": {
      newDiv.appendChild(projectHTML);
      break;
    }
    case "INPROGRESS": {
      inProgressDiv.appendChild(projectHTML);
      break;
    }
    case "COMPLETED": {
      completedDiv.appendChild(projectHTML);
      break;
    }
    case "ARCHIVED": {
      archivedDiv.appendChild(projectHTML);
      break;
    }
    default: {
      alert("ERROR");
      break;
    }
  }
}

function submitNewProjectInputDialog(e) {
  e.preventDefault();
  const title = e.target[0].value;
  const duration = e.target[1].value;
  const freshProject = new Project(title, duration);

  // update in localstorage
  listOfProjects.push(freshProject);
  localStorage.setItem("simple-jira-projects", JSON.stringify(listOfProjects));

  addNewProject(freshProject);
  newProjectInputDialog.close();
}

newProjectButton.addEventListener("click", newProjectButtonClick);
submitNewProject.addEventListener("submit", submitNewProjectInputDialog);
