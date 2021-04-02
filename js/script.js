const apikey = '7aeef90b-2b1f-4415-b5f0-ad7c1bc0c5c5';
const apihost = 'https://todo-api.coderslab.pl';
let singleTaskToDisplay = false;
document.addEventListener('DOMContentLoaded', function () {
    renderTask();

    addingForm.addEventListener("submit", ev => {
        ev.preventDefault();
        createTask(inputTitle.value, inputDescription.value)
            .then(res => {
                singleTaskToDisplay = true;
                console.log(res);
                renderTask(res);
                singleTaskToDisplay = false;
            })
    })
});

function apiListTasks() {
    return fetch(apihost + "/api/tasks", {
        headers: {
            Authorization: apikey
        }
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Error in method apiListTasks!!!");
        }
    });
}

function renderTask() {
    apiListTasks()
        .then(res => {
            res.data.forEach(el => {
                const form = document.querySelector(".js-task-adding-form");

                const section = document.createElement("section");
                section.className = "card mt-5 shadow-sm";
                section.dataset.id = el.id;
                section.dataset.status = el.status;

                const headerDiv = document.createElement("div");
                headerDiv.className = "card-header d-flex justify-content-between align-items-center";

                const divWithoutClassys = document.createElement("div");

                const h6 = document.createElement("h6");
                h6.className = "card-subtitle text-muted";
                h6.innerText = el.description;

                const h5 = document.createElement("h5");
                h5.innerText = el.title;

                section.append(headerDiv);
                headerDiv.append(divWithoutClassys);
                divWithoutClassys.append(h5);

                divWithoutClassys.append(h6);

                form.parentElement.parentElement.parentElement.appendChild(section);

                const divWithButtons = document.createElement("div");
                headerDiv.appendChild(divWithButtons);

                const btnDelete = document.createElement("button");
                btnDelete.className = "btn btn-outline-danger btn-sm ml-2";
                btnDelete.innerText = "Delete";
                divWithButtons.appendChild(btnDelete);

                if (section.dataset.status === "open") {
                    const btnFinish = document.createElement("button");
                    btnFinish.className = "btn btn-dark btn-sm";
                    btnFinish.innerText = "Finish";
                    divWithButtons.appendChild(btnFinish);
                }
                renderOperationsForTask(el.id);
            })
        })
}


function listOperationsForTask(taskId) {
    return fetch(apihost + "/api/tasks/" + taskId + "/operations",
        {
            headers: {
                Authorization: apikey
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                alert("Error in method listOperationsForTask!!!")
            }
        })
}

function renderOperationsForTask(taskId) {
    listOperationsForTask(taskId)
        .then(res => {

            const ul = document.createElement("ul");
            ul.className = "list-group list-group-flush";

            const sections = document.querySelectorAll("section");
            sections.forEach(section => {
                res.data.forEach(operation => {
                    if (operation.task.id === section.dataset.id) {

                        const descriptionDiv = document.createElement("div");

                        const span = document.createElement("span");
                        span.className = "badge badge-success badge-pill ml-2";
                        span.innerText = convertTimeMinutesToHours(operation.timeSpent);

                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex justify-content-between align-items-center";
                        li.appendChild(descriptionDiv);
                        ul.appendChild(li);

                        descriptionDiv.innerText = operation.description;
                        descriptionDiv.appendChild(span);

                        if (section.dataset.status === "open") {
                            const buttonsDiv = document.createElement("div");

                            const button15min = document.createElement("button");
                            button15min.className = "btn btn-outline-success btn-sm mr-2";
                            button15min.innerText = "+15m";

                            const button1h = document.createElement("button");
                            button1h.className = "btn btn-outline-success btn-sm mr-2";
                            button1h.innerText = "+1h";

                            const buttonDelete = document.createElement("button");
                            buttonDelete.className = "btn btn-outline-danger btn-sm";
                            buttonDelete.innerText = "Delete";

                            li.appendChild(buttonsDiv);
                            buttonsDiv.appendChild(button15min);
                            buttonsDiv.appendChild(button1h);
                            buttonsDiv.appendChild(buttonDelete);
                        }
                        section.appendChild(ul);
                    }
                })
            })
        })
}

function convertTimeMinutesToHours(timeInMinutes) {
    let result = "";
    if (timeInMinutes.length > 3) {
        let h = (parseInt(timeInMinutes) / 60).toPrecision(1);
        let m = ((parseFloat(timeInMinutes) / 60) - h) * 100;
        result = h + "h" + " " + m + "m";
    } else {
        result = timeInMinutes + "m";
    }
    return result;
}

function createTask(title, description) {
    return fetch(apihost + "/api/tasks",
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Error in method createTask!!!");
        }
    })
}

const addingForm = document.querySelector(".js-task-adding-form");
const inputTitle = addingForm.querySelector("input[name='title']");
const inputDescription = addingForm.querySelector("input[name='description']");
const addingBtn = addingForm.querySelector(".btn");