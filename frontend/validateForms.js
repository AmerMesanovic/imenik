function validateForm() {
  const firstName = document.getElementById("editFirstName").value;
  const lastName = document.getElementById("editLastName").value;
  const phoneNumber = document.getElementById("editPhoneNumber").value;
  const email = document.getElementById("editEmail").value;
  const age = parseInt(document.getElementById("editAge").value);

  let isValid = true;

  if (firstName.trim() === "") {
    document.getElementById("editFirstNameError").textContent = "Unesite ime.";
    isValid = false;
  } else {
    document.getElementById("editFirstNameError").textContent = "";
  }

  if (lastName.trim() === "") {
    document.getElementById("editLastNameError").textContent =
      "Unesite prezime.";
    isValid = false;
  } else {
    document.getElementById("editLastNameError").textContent = "";
  }

  const phoneNumberPattern = /^\d+$/;
  if (!phoneNumber.match(phoneNumberPattern)) {
    document.getElementById("editPhoneNumberError").textContent =
      "Unesite validan broj telefona.";
    isValid = false;
  } else {
    document.getElementById("editPhoneNumberError").textContent = "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailPattern)) {
    document.getElementById("editEmailError").textContent =
      "Unesite validnu email adresu.";
    isValid = false;
  } else {
    document.getElementById("editEmailError").textContent = "";
  }

  if (isNaN(age) || age <= 0) {
    document.getElementById("editAgeError").textContent =
      "Unesite validan broj za dob.";
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

function validateFormForAddUser() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const age = parseInt(document.getElementById("age").value);
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;

  let isValid = true;

  if (firstName.trim() === "") {
    document.getElementById("addFirstNameError").textContent = "Unesite ime.";
    isValid = false;
  } else {
    document.getElementById("addFirstNameError").textContent = "";
  }

  if (lastName.trim() === "") {
    document.getElementById("addLastNameError").textContent =
      "Unesite prezime.";
    isValid = false;
  } else {
    document.getElementById("addLastNameError").textContent = "";
  }

  const phoneNumberPattern = /^\d+$/;
  if (!phoneNumber.match(phoneNumberPattern)) {
    document.getElementById("addPhoneNumberError").textContent =
      "Unesite validan broj telefona.";
    isValid = false;
  } else {
    document.getElementById("addPhoneNumberError").textContent = "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.match(emailPattern)) {
    document.getElementById("addEmailError").textContent =
      "Unesite validnu email adresu.";
    isValid = false;
  } else {
    document.getElementById("addEmailError").textContent = "";
  }

  if (dateOfBirth.trim() === "") {
    document.getElementById("addDateError").textContent =
      "Unesite datum rođenja.";
    isValid = false;
  } else {
    document.getElementById("addDateError").textContent = "";
  }

  if (isNaN(age) || age <= 0) {
    document.getElementById("addNumberError").textContent =
      "Unesite validan broj za dob.";
    isValid = false;
  } else {
    document.getElementById("addNumberError").textContent = "";
  }

  if (gender === "") {
    document.getElementById("addGenderError").textContent = "Izaberite spol.";
    isValid = false;
  } else {
    document.getElementById("addGenderError").textContent = "";
  }

  if (country === "") {
    document.getElementById("addCountryError").textContent =
      "Izaberite državu.";
    isValid = false;
  } else {
    document.getElementById("addCountryError").textContent = "";
  }

  if (city === "") {
    document.getElementById("addCityError").textContent = "Izaberite grad.";
    isValid = false;
  } else {
    document.getElementById("addCityError").textContent = "";
  }

  return isValid;
}
