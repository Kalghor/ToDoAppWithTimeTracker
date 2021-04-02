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
            console.log("---------Task----------");
            console.log(res);
            console.log("--------------------------");
            res.data.forEach(el => {
                const place = document.querySelector(".placeJS");
                const section = document.createElement("section");
                section.className = "card mt-5 shadow-sm";
                section.dataset.id = el.id;
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
                const btnFinish = document.createElement("button");
                btnFinish.className = "btn btn-dark btn-sm";
                btnFinish.innerText = "Finish";
                const btnDelete = document.createElement("button");
                btnDelete.className = "btn btn-outline-danger btn-sm ml-2";
                btnDelete.innerText = "Delete";
                div.appendChild(divWithButtons);
                divWithButtons.appendChild(btnFinish);
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
            // console.log("taskId: " + res.data.task.id);
            console.log("---------Operations----------");
            console.log(res);
            console.log("-----------------------------");
            const divHeader = document.querySelector("section");
            const ul = document.createElement("ul");
            ul.className = "list-group list-group-flush";
            res.data.forEach(el => {
                // if(taskId === res.data.task.id) {
                    const descriptionDiv = document.createElement("div");
                    const buttonsDiv = document.createElement("div");
                    const button15min = document.createElement("button");
                    const button1h = document.createElement("button");
                    const buttonDelete = document.createElement("button");
                    const li = document.createElement("li");
                    button15min.className = "btn btn-outline-success btn-sm mr-2";
                    button15min.innerText = "+15m";
                    button1h.className = "btn btn-outline-success btn-sm mr-2";
                    button1h.innerText = "+1h";
                    buttonDelete.className = "btn btn-outline-danger btn-sm";
                    buttonDelete.innerText = "Delete";
                    li.className = "list-group-item d-flex justify-content-between align-items-center";
                    li.appendChild(descriptionDiv);
                    descriptionDiv.innerText = el.description;
                    ul.appendChild(li);
                    li.appendChild(buttonsDiv);
                    buttonsDiv.appendChild(button15min);
                    buttonsDiv.appendChild(button1h);
                    buttonsDiv.appendChild(buttonDelete);
                // }
            })
            divHeader.appendChild(ul);

        })
}