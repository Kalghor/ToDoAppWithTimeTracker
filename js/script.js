const apikey = '7aeef90b-2b1f-4415-b5f0-ad7c1bc0c5c5';
const apihost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function () {
    renderTask();
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
            console.log(res);
            res.data.forEach(el => {
                const place = document.querySelector(".placeJS");
                const section = document.createElement("section");
                section.className = "card mt-5 shadow-sm";
                section.dataset.id = el.id;
                section.dataset.status = el.status;
                const div = document.createElement("div");
                div.className = "card-header d-flex justify-content-between align-items-center";
                const divWithoutClassys = document.createElement("div");
                const h5 = document.createElement("h5");
                const h6 = document.createElement("h6");
                h6.className = "card-subtitle text-muted";
                h5.innerText = el.title;
                h6.innerText = el.description;
                divWithoutClassys.append(h5);
                divWithoutClassys.append(h6);
                div.append(divWithoutClassys);
                section.append(div);
                place.after(section);
                const divWithButtons = document.createElement("div");
                const btnDelete = document.createElement("button");
                btnDelete.className = "btn btn-outline-danger btn-sm ml-2";
                btnDelete.innerText = "Delete";
                div.appendChild(divWithButtons);
                if (section.dataset.status === "open") {
                    const btnFinish = document.createElement("button");
                    btnFinish.className = "btn btn-dark btn-sm";
                    btnFinish.innerText = "Finish";
                    divWithButtons.appendChild(btnFinish);
                }
                divWithButtons.appendChild(btnDelete);
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
    console.log("taskId: " + taskId);
    listOperationsForTask(taskId)
        .then(res => {
            const ul = document.createElement("ul");
            ul.className = "list-group list-group-flush";
            const sections = document.querySelectorAll("section");
            sections.forEach(section => {
                res.data.forEach(operation => {
                    if (operation.task.id === section.dataset.id) {
                        const descriptionDiv = document.createElement("div");
                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex justify-content-between align-items-center";
                        li.appendChild(descriptionDiv);
                        descriptionDiv.innerText = operation.description;
                        ul.appendChild(li);
                        if (section.dataset.status === "open") {
                            const buttonsDiv = document.createElement("div");
                            const button15min = document.createElement("button");
                            const button1h = document.createElement("button");
                            const buttonDelete = document.createElement("button");
                            button15min.className = "btn btn-outline-success btn-sm mr-2";
                            button15min.innerText = "+15m";
                            button1h.className = "btn btn-outline-success btn-sm mr-2";
                            button1h.innerText = "+1h";
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