
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
      if (data && data.length > 0) {
      const dataDisplay = document.getElementById("dataDisplay");
      dataDisplay.innerHTML = "";

      
      var totalPages = data[0].totalPages

      if (totalPages == currentPage) {
        var disablePaginateRight = true
        var disablePaginateLeft = false
      } else if (currentPage == 1) {
        var disablePaginateRight = false
        var disablePaginateLeft = true
      } else {
        var disablePaginateRight = false
        var disablePaginateLeft = false
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
            <button type="button" class="btn btn-primary btn-sm" onclick="openEditModal(${user.id
            })">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteUser(${user.id
            })">Delete</button>
          </td>
        `;
          dataDisplay.appendChild(row);
        });

        updatePaginationButtons(totalPages, disablePaginateRight, disablePaginateLeft);
      }
    }})
    .catch((error) => {
      console.error(error);
    });

}


function updatePaginationButtons(totalPages, disablePaginateRight, disablePaginateLeft) {
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
      document.getElementById("editUserId").value = user[0].id;
      document.getElementById("editFirstName").value = user[0].firstName;
      document.getElementById("editLastName").value = user[0].lastName;
      document.getElementById("editPhoneNumber").value = user[0].phoneNumber;

      const genderSelect = document.getElementById("editGender");
      if (user[0].gender === "Male") {
        genderSelect.value = "0";
      } else if (user[0].gender === "Female") {
        genderSelect.value = "1";
      }

      document.getElementById("editEmail").value = user[0].email;
      document.getElementById("editDateOfBirth").value = user[0].dateOfBirth.split("T")[0];
      document.getElementById("editAge").value = user[0].age;
      document.getElementById("editCity").value = user[0].city;
      document.getElementById("editCountry").value = user[0].country;

      const editCountrySelect = document.getElementById("editCountry");
      const selectedCountryId = user[0].countryIds;
      const selectedCityId = user[0].cityIds;

      fetch("http://localhost:5095/api/user/getAllCountries")
        .then((response) => response.json())
        .then((data) => {
          editCountrySelect.innerHTML = ''; // Očisti opcije
          data.forEach((country) => {
            const option = document.createElement("option");
            option.value = country.id;
            option.textContent = country.name;
            editCountrySelect.appendChild(option);
            if (country.id == selectedCountryId) {
              option.selected = true;
              onCountryChange2(user[0])
            }
          
          });

          $("#editUserModal").modal("show");
        })
        .catch((error) => {
          console.error( error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}


function validateForm() {
  const firstName = document.getElementById("editFirstName").value;
  const lastName = document.getElementById("editLastName").value;
  const phoneNumber = document.getElementById("editPhoneNumber").value;
  const email = document.getElementById("editEmail").value;
  const age = parseInt(document.getElementById("editAge").value);

  let isValid = true;

  // Validacija za ime
  if (firstName.trim() === "") {
    document.getElementById("editFirstNameError").textContent = "Unesite ime.";
    isValid = false;
  } else {
    document.getElementById("editFirstNameError").textContent = "";
  }

  // Validacija za prezime
  if (lastName.trim() === "") {
    document.getElementById("editLastNameError").textContent = "Unesite prezime.";
    isValid = false;
  } else {
    document.getElementById("editLastNameError").textContent = "";
  }

  // Validacija za broj telefona
  const phoneNumberPattern = /^\d+$/; // Promijenite ovo prema vašim potrebama
  if (!phoneNumber.match(phoneNumberPattern)) {
    document.getElementById("editPhoneNumberError").textContent = "Unesite validan broj telefona.";
    isValid = false;
  } else {
    document.getElementById("editPhoneNumberError").textContent = "";
  }

  // Validacija za email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailPattern)) {
    document.getElementById("editEmailError").textContent = "Unesite validnu email adresu.";
    isValid = false;
  } else {
    document.getElementById("editEmailError").textContent = "";
  }

  // Validacija za dob
  if (isNaN(age) || age <= 0) {
    document.getElementById("editAgeError").textContent = "Unesite validan broj za dob.";
    isValid = false;
  } else {
    document.getElementById("editAgeError").textContent = "";
  }

  const selectedCity = document.getElementById("editCity").value;
  if (selectedCity === "") {
    document.getElementById("editCityError").textContent = "Izaberite grad.";
    isValid = false;
  } else {
    document.getElementById("editCityError").textContent = "";
  }
  return isValid;
}

function saveEditedUser() {
  if (!validateForm()) {
    return; // Prekini ako forma nije validna
  }
  const userId = document.getElementById("editUserId").value;
  var genderToString = document.getElementById("editGender").value;
  var genderString = "";

  if (genderToString == 0) {
    genderString = "Male";
  } else if (genderToString == 1) {
    genderString = "Famale"
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
     
      const cityNames = data.map(city => city.id); 
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
  const modal = document.getElementById('deleteConfirmationModal');
  const confirmButton = document.getElementById('confirmDeleteButton');
  const declineButton = document.getElementById('declineButton');

  declineButton.onclick = function () {
    modal.style.display = 'none';
  }

  confirmButton.onclick = function () {
    modal.style.display = 'none';

    const apiUrl = `http://localhost:5095/api/user/delete/${userId}`;
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userId),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }
       
        getAllUsers();
      })
      .catch((error) => {
        console.error(error);
  
        getAllUsers();
      });
  };

  modal.style.display = 'block';
  modal.style.opacity = '1';
}



document.addEventListener("DOMContentLoaded", function () {
  const addUserForm = document.getElementById("addUserForm");
  const countrySelect = document.getElementById("country");


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
      .then((response) => response.json())
      .then((data) => {
        addUserForm.reset();
        getAllUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

getAllUsers();
