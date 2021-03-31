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
            res.data.forEach(el => {
                const place = document.querySelector(".placeJS");
                const section = document.createElement("section");
                section.className = "card mt-5 shadow-sm";
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
            })
        })
}