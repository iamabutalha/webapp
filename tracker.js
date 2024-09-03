let expanses = JSON.parse(localStorage.getItem("expanses")) || [];

function renderExpanses() {
  let expanseHTML = ``;
  expanses.forEach((expanse) => {
    // If the type of expanse is expanse it will be - and + will be for income
    let sign = expanse.type === "income" ? "+" : "-";
    // if the type is income the card will be green if it is expans it will be black bcz we are adding classes to it
    let type = expanse.type === "income" ? "income" : "expanse";
    expanseHTML += `<div class="transaction ${type}">
          <span>${expanse.name}</span>
          <span>${sign} $${expanse.amount.toFixed(1)}</span>
          <button class="delete-btn">Delete</button>
        </div>`;
  });

  document.querySelector(".transactions-container").innerHTML = expanseHTML;
  totalAmount();

  document.querySelectorAll(".delete-btn").forEach((deleteBtn, index) => {
    deleteBtn.addEventListener("click", () => {
      expanses.splice(index, 1);
      saveToStorage();
      renderExpanses();
      totalAmount();
    });
  });
}

document.querySelector("#expense-form").addEventListener("submit", (event) => {
  event.preventDefault();

  // Take name from the input field
  let name = document.querySelector("#description").value;
  // Take amount from the amount field and stiree it in a variable
  let amount = parseFloat(document.querySelector("#amount").value);

  // Take type from the select field
  let type = document.querySelector("#type").value;

  if (isNaN(amount)) {
    document.querySelector(".error-message").innerHTML = "Enter a valid amount";
    setTimeout(() => {
      document.querySelector(".error-message").innerHTML = "";
    }, 3000);

    return;
  }

  expanses.unshift({
    name: name,
    amount: amount,
    type: type,
  });
  saveToStorage();
  renderExpanses();
  resetValues();
});

renderExpanses();
totalAmount();

function saveToStorage() {
  localStorage.setItem("expanses", JSON.stringify(expanses));
}

function totalAmount() {
  let totalAmount = 0.0;
  expanses.forEach((expanse) => {
    if (expanse.type === "income") {
      totalAmount += expanse.amount;
    } else {
      totalAmount -= expanse.amount;
    }
  });

  // these lines of code are for the color of the total amount if Total amount is greater than 0 it will change the color of the totalAmount to green and Red if it is less than 0 and green if it is equal to zero
  if (totalAmount > 0) {
    document
      .querySelector("#total-balance")
      .classList.add("total-positive-balance");
  } else if (totalAmount < 0) {
    if (
      document
        .querySelector("#total-balance")
        .classList.contains("total-positive-balance")
    ) {
      document
        .querySelector("#total-balance")
        .classList.remove("total-positive-balance");
    }

    document
      .querySelector("#total-balance")
      .classList.add("total-negative-balance");
  } else {
    document
      .querySelector("#total-balance")
      .classList.add("total-positive-balance");
  }

  document.querySelector("#total-balance").innerHTML = ` $${totalAmount.toFixed(
    1
  )}`;
}

function resetValues() {
  let form = document.querySelector("#expense-form");
  form.reset();
}
