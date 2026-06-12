const form = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const usersList = document.getElementById("usersList");

/*
|--------------------------------------------------------------------------
| Event Listeners
|--------------------------------------------------------------------------
*/
document.addEventListener("DOMContentLoaded", renderUsers);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
        name,
        email,
    });

    localStorage.setItem("users", JSON.stringify(users));

    form.reset();

    renderUsers();
});

/*
|--------------------------------------------------------------------------
| Render Users
|--------------------------------------------------------------------------
*/
function renderUsers() {
    usersList.innerHTML = "";

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach((user, index) => {
        const listItem = document.createElement("li");

        const userInfo = document.createElement("span");
        userInfo.textContent = `${user.name} — ${user.email}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteUser(index);
        });

        listItem.appendChild(userInfo);
        listItem.appendChild(deleteButton);

        usersList.appendChild(listItem);
    });
}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/
function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.splice(index, 1);

    localStorage.setItem("users", JSON.stringify(users));

    renderUsers();
}