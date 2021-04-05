const apikey = '7aeef90b-2b1f-4415-b5f0-ad7c1bc0c5c5';
const apihost = 'https://todo-api.coderslab.pl';


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


function convertTimeMinutesToHours(timeInMinutes) {
    let result = "";
    if (timeInMinutes > 59) {
        let h = (parseInt(timeInMinutes) / 60).toPrecision(1);
        let m = ((parseFloat(timeInMinutes) / 60) - h) * 100;
        result = h + "h" + " " + m + "m";
    } else {
        result = timeInMinutes + "m";
    }
    return result;
}

function convertTimeMinutesToHours(timeInMinutes) {
    let result = "";
    if (timeInMinutes > 59) {
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

function renderTasks() {
    apiListTasks()
        .then(res => {
            res.data.forEach(el => {
                const firstDiv = document.querySelector("div");

                const section = document.createElement("section");
                section.className = "card mt-5 shadow-sm";
                section.dataset.task_id = el.id;

                const headerDiv = document.createElement("div");
                headerDiv.className = "card-header d-flex justify-content-between align-items-center";

                const emptyDiv = document.createElement("div");
                const h5 = document.createElement("h5");
                h5.innerText = el.title;

                const h6 = document.createElement("h6");
                h6.className = "card-subtitle text-muted";
                h6.innerText = el.description;

                const buttonsDiv = document.createElement("div");
                const buttonFinish = document.createElement("button");
                buttonFinish.className = "btn btn-dark btn-sm";
                buttonFinish.innerText = "Finish";

                const buttonDelete = document.createElement("button");
                buttonDelete.className = "btn btn-outline-danger btn-sm ml-2";
                buttonDelete.innerText = "Delete";
                buttonDelete.addEventListener("click", ev => {
                    ev.preventDefault();
                    deleteTask(el.id);
                    buttonDelete.parentElement.parentElement.parentElement.remove();
                })

                const ul = document.createElement("ul");
                ul.className = "list-group list-group-flush";

                firstDiv.after(section);
                section.appendChild(headerDiv);
                headerDiv.appendChild(emptyDiv);
                emptyDiv.appendChild(h5);
                emptyDiv.appendChild(h6);
                headerDiv.append(buttonsDiv);
                if (el.status === "open") {
                    buttonsDiv.appendChild(buttonFinish);
                }
                buttonsDiv.appendChild(buttonDelete);
                section.append(ul);

                const addOperationDiv = document.createElement("div");
                addOperationDiv.className = "card-body";

                const addOperationForm = document.createElement("form");

                const inputGroupDiv = document.createElement("div");
                inputGroupDiv.className = "input-group";

                const input = document.createElement("input");
                input.className = "form-control";
                input.type = "text";
                input.placeholder = "Operation description";
                input.minlength = "5";

                const buttonDiv = document.createElement("div");
                buttonDiv.className = "input-group-append";

                const addButton = document.createElement("button");
                addButton.className = "btn btn-info";
                addButton.innerText = "Add";
                addOperationForm.addEventListener("submit", ev => {
                    ev.preventDefault();

                    createOperationForTask(el.id, input.value)
                        .then(res => {
                            renderOperations(ul, res.data.id, el.status, res.data.description, res.data.timeSpent);
                        })
                })


                section.append(addOperationDiv);
                addOperationDiv.appendChild(addOperationForm);
                addOperationForm.appendChild(inputGroupDiv);
                inputGroupDiv.appendChild(input);
                inputGroupDiv.appendChild(buttonDiv);
                buttonDiv.appendChild(addButton);

                listOperationsForTask(el.id)
                    .then(res => {
                        res.data.forEach(res => {
                            renderOperations(ul, res.id, res.status, res.description, res.timeSpent);
                        })
                    })
            })
        })
}

function renderOperations(ul, operationId, status, operationDescription, timeSpent) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = operationDescription;

    const span = document.createElement("span");
    span.className = "badge badge-success badge-pill ml-2";
    // span.innerText = "Sztywniutko";
    span.innerText = convertTimeMinutesToHours(timeSpent.toString());

    const buttonsDiv = document.createElement("div");

    const button15m = document.createElement("button");
    button15m.className = "btn btn-outline-success btn-sm mr-2";
    button15m.innerText = "+15m";
    button15m.addEventListener("click", ev => {
        ev.preventDefault();
        const timeSpentTmp = timeSpent + 15;
        updateOperation(operationId, operationDescription, timeSpentTmp)
            .then(res => {
                console.log(res.data.timeSpent);
                li.remove();
                setTimeout(renderOperations(ul, res.data.id, res.data.status, res.data.description, res.data.timeSpent),300);
            })

    })

    const button1h = document.createElement("button");
    button1h.className = "btn btn-outline-success btn-sm mr-2";
    button1h.innerText = "+1h";


    const buttonDelete = document.createElement("button");
    buttonDelete.className = "btn btn-outline-danger btn-sm";
    buttonDelete.innerText = "Delete";

    buttonDelete.addEventListener("click", ev => {
        ev.preventDefault();
        deleteOperation(operationId)
            .then(res => {
                li.remove();
            })
    })

    ul.appendChild(li);
    li.appendChild(descriptionDiv);
    descriptionDiv.appendChild(span);
    li.appendChild(buttonsDiv);
    buttonsDiv.appendChild(button15m);
    buttonsDiv.appendChild(button1h);
    buttonsDiv.appendChild(buttonDelete);

}

function deleteTask(taskId) {
    fetch("https://todo-api.coderslab.pl/api/tasks/" + taskId, {
        headers: {Authorization: apikey},
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Error in method deleteTask!!!")
        }
    })
}


function deleteOperation(operationId) {
    return fetch(apihost + "/api/operations/" + operationId, {
        headers: {Authorization: apikey},
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Error in method deleteTask!!!")
        }
    })
}


function createOperationForTask(taskId, description1) {
    return fetch(
        apihost + '/api/tasks/' + taskId + "/operations",
        {
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: description1, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Error in method createOperationForTask!!!');
            }
            return resp.json();
        }
    )
}

function updateOperation(operationId, description2, timeSpent2) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: description2, timeSpent: timeSpent2}),
            method: 'PUT'
        }).then(
        function (resp) {
            if (!resp.ok) {
                alert('Error in method updateOperation!!!');
            }
            return resp.json();
        }
    )
}


document.addEventListener('DOMContentLoaded', function () {
    renderTasks();

    const addingForm = document.querySelector(".js-task-adding-form");
    addingForm.addEventListener("submit", ev => {
        ev.preventDefault();
        const title = document.querySelector("input[name='title']");
        const description = document.querySelector("input[name='description']");
        createTask(title.value, description.value)
            .then(res => {
                renderTasks();
            })
    })
});

