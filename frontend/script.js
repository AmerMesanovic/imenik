const usersPerPage = 5;

function getAllUsers(page = 1) {
  currentPage = page;

  const apiUrl = `http://localhost:5095/api/user/getAllUsers?page=${currentPage}&pageSize=${usersPerPage}`;
  fetch(apiUrl)
    .then((response) => {
      if (response.statusText != "OK") {
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (data === undefined) {
        const dataDisplay = document.getElementById("dataDisplay");
        dataDisplay.innerHTML = "";
      } else if (data && data.length > 0) {
        const dataDisplay = document.getElementById("dataDisplay");
        dataDisplay.innerHTML = "";

        var totalPages = data[0].totalPages;
        if (totalPages == currentPage) {
          var disablePaginateRight = true;
          var disablePaginateLeft = false;
        } else if (currentPage == 1) {
          var disablePaginateRight = false;
          var disablePaginateLeft = true;
        } else {
          var disablePaginateRight = false;
          var disablePaginateLeft = false;
        }

        if (data && data.length > 0) {
          data.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.phoneNumber}</td>
          <td>${user.gender}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${formatDateToDDMMYYYY(user.dateOfBirth)}</td>
          <td>${user.city}</td>
          <td>${user.country}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" onclick="openEditModal(${
              user.id
            })">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteUser(${
              user.id
            })">Delete</button>
          </td>
        `;
            dataDisplay.appendChild(row);
          });

          updatePaginationButtons(
            totalPages,
            disablePaginateRight,
            disablePaginateLeft
          );
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function updatePaginationButtons(
  totalPages,
  disablePaginateRight,
  disablePaginateLeft
) {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  prevButton.classList.toggle("disabled", disablePaginateLeft);
  nextButton.classList.toggle("disabled", disablePaginateRight);
}

function prevPage() {
  if (currentPage > 1) {
    getAllUsers(currentPage - 1);
  }
}

function nextPage() {
  getAllUsers(currentPage + 1);
}
function formatDateToDDMMYYYY(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function openEditModal(userId) {
  fetch(`http://localhost:5095/api/user/edit/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      document.getElementById("editUserId").value = user.id;
      document.getElementById("editFirstName").value = user.firstName;
      document.getElementById("editLastName").value = user.lastName;
      document.getElementById("editPhoneNumber").value = user.phoneNumber;

      const genderSelect = document.getElementById("editGender");
      if (user.gender === "Male") {
        genderSelect.value = "0";
      } else if (user.gender === "Female") {
        genderSelect.value = "1";
      }

      document.getElementById("editEmail").value = user.email;
      document.getElementById("editDateOfBirth").value =
        user.dateOfBirth.split("T")[0];
      document.getElementById("editAge").value = user.age;
      document.getElementById("editCity").value = user.city;
      document.getElementById("editCountry").value = user.country;

      const editCountrySelect = document.getElementById(`editCountry`);

      const selectedCountryId = user.countryIds;
      const selectedCityId = user.cityIds;

      fetch("http://localhost:5095/api/user/getAllCountries")
        .then((response) => response.json())
        .then((data) => {
          editCountrySelect.innerHTML = "";
          data.forEach((country) => {
            const option = document.createElement("option");
            option.value = country.id;
            option.textContent = country.name;
            editCountrySelect.appendChild(option);
            if (country.id == selectedCountryId) {
              option.selected = true;
              onCountryChange2(user);
            }
          });

          $("#editUserModal").modal("show");
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

function saveEditedUser() {
  const successMessageEdit = document.getElementById("successMessageEdit");
  if (!validateForm()) {
    return;
  }
  const userId = document.getElementById("editUserId").value;
  var genderToString = document.getElementById("editGender").value;
  var genderString = "";

  if (genderToString == 0) {
    genderString = "Male";
  } else if (genderToString == 1) {
    genderString = "Famale";
  }

  const editedUser = {
    id: parseInt(userId),
    firstName: document.getElementById("editFirstName").value,
    lastName: document.getElementById("editLastName").value,
    phoneNumber: document.getElementById("editPhoneNumber").value,
    gender: genderString,
    email: document.getElementById("editEmail").value,
    dateOfBirth: document.getElementById("editDateOfBirth").value,
    age: parseInt(document.getElementById("editAge").value),
    cityId: parseInt(document.getElementById("editCity").value),
    countryId: parseInt(document.getElementById("editCountry").value),
  };

  fetch(`http://localhost:5095/api/user/editUser/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      successMessageEdit.textContent = "User added successfully!";
      successMessageEdit.style.display = "block";
      setTimeout(() => {
        successMessageEdit.style.display = "none";
      }, "2000");
      $("#editUserModal").modal("hide");
      getAllUsers();
    })
    .catch((error) => {
      console.error(error);
    });
}

function onCountryChange2(user) {
  const countryId = document.getElementById("editCountry").value;
  const citySelect = document.getElementById("editCity");
  citySelect.innerHTML = '<option value="">Izaberite grad</option>';
  if (countryId) {
    getCitiesById2(countryId, user);
  } else {
    citySelect.disabled = true;
  }
}

function getCitiesById2(id, user) {
  const citySelect = document.getElementById("editCity");
  citySelect.disabled = false;
  fetch(`http://localhost:5095/api/user/getCitiesByCountry/${id}`)
    .then((response) => response.json())
    .then((data) => {
      citySelect.innerHTML = '<option value="">Izaberite grad</option>';
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });

      const selectedCityName = user?.cityIds;

      const cityNames = data.map((city) => city.id);
      if (cityNames.includes(selectedCityName)) {
        citySelect.value = selectedCityName;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function onCountryChange() {
  const countryId = document.getElementById("country").value;
  const citySelect = document.getElementById("city");
  citySelect.innerHTML = '<option value="">Select a City</option>';

  if (countryId) {
    getCitiesById(countryId);
  } else {
    citySelect.disabled = true;
  }
}

function getCitiesById(id) {
  const citySelect = document.getElementById("city");
  citySelect.disabled = false;
  fetch(`http://localhost:5095/api/user/getCitiesByCountry/${id}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((cities) => {
        const option = document.createElement("option");
        option.value = cities.id;
        option.textContent = cities.name;
        citySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function deleteUser(userId) {
  const modal = document.getElementById("deleteConfirmationModal");
  const confirmButton = document.getElementById("confirmDeleteButton");
  const declineButton = document.getElementById("declineButton");
  const declineButtonNO = document.getElementById("declineButtonNO");
  const successMessageDeleted = document.getElementById(
    "successMessageDeleted"
  );

  declineButton.onclick = function () {
    modal.style.display = "none";
  };
  declineButtonNO.onclick = function () {
    modal.style.display = "none";
  };
  confirmButton.onclick = function () {
    modal.style.display = "none";

    const apiUrl = `http://localhost:5095/api/user/delete/${userId}`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userId),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        successMessageDeleted.textContent = "User dedleted successfully!";
        successMessageDeleted.style.display = "block";
        setTimeout(() => {
          successMessageDeleted.style.display = "none";
        }, "2000");
        getAllUsers();
      })
      .catch((error) => {
        console.error(error);
        getAllUsers();
      });
  };

  modal.style.display = "block";
  modal.style.opacity = "1";
}

function closeModal(type) {
  const successMessageElementAdd = document.getElementById("successMessage");
  const errorMessageElementAdd = document.getElementById("errorMessage");
  const successMessageElementEdit =
    document.getElementById("successMessageEdit");
  if (type == "closeAddModal") {
    $("#addUserModal").modal("hide");
    errorMessageElementAdd.style.display = "none";
    successMessageElementAdd.style.display = "none";
  }

  if (type == "closeEditModal") {
    $("#addUserModal").modal("hide");
    successMessageElementEdit.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const addUserForm = document.getElementById("addUserForm");
  const countrySelect = document.getElementById("country");
  const errorMessageElement = document.getElementById("errorMessage");
  const successMessageElement = document.getElementById("successMessage");

  fetch("http://localhost:5095/api/user/getAllCountries")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.id;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(error);
    });

  addUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateFormForAddUser()) {
      return;
    }
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const age = document.getElementById("age").value;
    const cityId = parseInt(document.getElementById("city").value);
    const countryId = parseInt(document.getElementById("country").value);

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      gender: gender,
      email: email,
      dateOfBirth: dateOfBirth,
      age: age,
      cityId: cityId,
      countryId: countryId,
    };
    const apiUrl = "http://localhost:5095/api/user/addUser";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        }
        return response.json();
      })
      .then((data) => {
        if (typeof data === "string") {
          errorMessageElement.textContent = data;
          errorMessageElement.style.display = "block";
        } else {
          errorMessageElement.style.display = "none";
          successMessageElement.textContent = "User added successfully!";
          successMessageElement.style.display = "block";
          setTimeout(() => {
            $("#addUserModal").modal("hide");
            successMessageElement.style.display = "none";
          }, "1000");
          addUserForm.reset();
          getAllUsers();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

getAllUsers();
