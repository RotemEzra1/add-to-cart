import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-3f945-default-rtdb.europe-west1.firebasedatabase.app/",
};
const addButton = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const shoppingList = document.getElementById("shopping-list");

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

addButton.addEventListener("click", function () {
  let inputValue = inputField.value;
  push(shoppingListInDB, inputValue);
  clearInputField();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingList(currentItem);
    }
  } else {
    shoppingList.innerHTML = "No items here... yet";
  }
});

function clearInputField() {
  inputField.value = "";
}

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function appendItemToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingList.append(newEl);
}
