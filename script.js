import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  child,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://leads-tracker-app-bdac8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const referenceDB = ref(database, "leads");

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    const displayLink = leads[i].url.replace("https://", ""); // Remove "https://" for display
    const leadKey = leads[i].key; // Store the unique key of each lead

    listItems += `
            <li data-key="${leadKey}">
                <button class="del-item">
                    <i class="fa-solid fa-x"></i>
                </button>
                <a target='_blank' href='${leads[i].url}'>
                    ${displayLink}
                </a>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;

  // Select all delete buttons
  const deleteButtons = document.querySelectorAll(".del-item");

  // Add event listeners to all delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const listItem = button.parentElement;
      const key = listItem.getAttribute("data-key"); // Get the key of the lead to be deleted

      // Remove the lead from Firebase based on its key
      const leadRef = ref(database, "leads/" + key);
      remove(leadRef);

      // Remove the lead from the DOM
      ulEl.removeChild(listItem);
    });
  });
}

onValue(referenceDB, function (snapshot) {
  const snapshotDoesExist = snapshot.exists();

  if (snapshotDoesExist) {
    const snapshotsValues = snapshot.val();
    const leads = Object.keys(snapshotsValues).map((key) => ({
      key,
      url: snapshotsValues[key],
    }));
    render(leads);
  }
});

deleteBtn.addEventListener("dblclick", function () {
  remove(referenceDB);
  ulEl.innerHTML = "";
});

// Event listener for the click event
inputBtn.addEventListener("click", function () {
  const inputValue = inputEl.value.trim();

  if (inputValue) {
    const leadRef = push(referenceDB, "https://" + inputValue);
    inputEl.value = "";
  }
});

// Event listener for the "Enter" key press
inputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const inputValue = inputEl.value.trim();

    if (inputValue) {
      const leadRef = push(referenceDB, "https://" + inputValue);
      inputEl.value = "";
    }
  }
});
