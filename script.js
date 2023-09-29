class Project {
  static _counter = 0;
  constructor(title, duration, state = "TODO") {
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

  /**
   * @param {string} state
   */
  set setFlowState(state) {
    this._state = state;
  }
}

let listOfProjects = [];

function updateFlowState(id, state) {
  listOfProjects.forEach((project) => {
    if (project._instanceCount == id) {
      project._state = state;
    }
  });
  console.log(listOfProjects);
  //  set localstorage as well
  localStorage.setItem("simple-jira-projects", JSON.stringify(listOfProjects));
}

function resetBoardHandler() {
  localStorage.clear();
  window.location.reload();
}

const newProjectButton = document.getElementById("newProject");
const resetBoardButton = document.getElementById("reset");
const newProjectInputDialog = document.getElementById("newProjectDialog");
const submitNewProject = document.querySelector("#newProjectDialog form");
const projectFlow = document.querySelector("#projectFlow");

// reset localstorage on click of reset button
resetBoardButton.addEventListener("click", resetBoardHandler);

// check if projects already present in localstorage
if (localStorage.getItem("simple-jira-projects")) {
  listOfProjects = JSON.parse(localStorage.getItem("simple-jira-projects"));

  // add project to flow
  listOfProjects.map((project) =>
    addNewProject(
      new Project(project._title, project._duration, project._state)
    )
  );
}

// open modal
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
    case "TODO": {
      newDiv.appendChild(projectHTML);
      break;
    }
    case "INPROGRESS": {
      inProgressDiv.appendChild(projectHTML);
      break;
    }
    case "INREVIEW": {
      completedDiv.appendChild(projectHTML);
      break;
    }
    case "DONE": {
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

  if (title == "" || duration == "") {
    alert("Please fill in all the details");
    return;
  }
  const freshProject = new Project(title, duration);

  // update in localstorage
  listOfProjects.push(freshProject);
  localStorage.setItem("simple-jira-projects", JSON.stringify(listOfProjects));

  addNewProject(freshProject);
  newProjectInputDialog.close();

  e.target[0].value = "";
  e.target[1].value = "";
}

newProjectButton.addEventListener("click", newProjectButtonClick);
submitNewProject.addEventListener("submit", submitNewProjectInputDialog);
