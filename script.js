/*

    document.cookie = 
    "key = value; key2 = value2";
    let x = document.cookie;

*/
//* Input Elements

const createItemInput = document.querySelector("#homework-item-input");
const itemList = document.querySelector(".homework-list");
const dateInput = document.querySelector("#homework-date-input");
const createBtn = document.querySelector(".create-btn");
const reorderBtn = document.querySelector(".reorder-btn");

//* List Item Class

class HomeworkItem {
  static homeworkList = [];

  constructor(name, date) {
    this.name = name;
    this.date = date;
    this.id = HomeworkItem.homeworkList.length;
    HomeworkItem.homeworkList.push(this);
  }
  static reorder(byDate = true, refresh = true) {
    const list = HomeworkItem.homeworkList;
    let returnVal = 0;
    list.sort((item1, item2) => {
      const date1 = item1.date.split("-");
      const date2 = item2.date.split("-");
      if (date1[0] === "") return -1;
      if (date2[0] === "") return 1;
      if (Number(date1[0]) !== Number(date2[0]))
        returnVal = Number(date1[0]) - Number(date2[0]);
      else if (Number(date1[1]) !== Number(date2[1]))
        returnVal = Number(date1[1]) - Number(date2[1]);
      else if (Number(date1[2]) !== Number(date2[2]))
        returnVal = Number(date1[2]) - Number(date2[2]);
      return returnVal;
    });
    HomeworkItem.refreshList(itemList);
    return;
  }
  static refreshList(listUl = itemList) {
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      if (listUl.children[0] === undefined) break;
      listUl.children[0].remove();
    }
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      createItemLi(
        HomeworkItem.homeworkList[i].name,
        HomeworkItem.homeworkList[i].date
      );
    }
    HomeworkItem.saveList();
  }
  static loadList() {
    let array = JSON.parse(localStorage.getItem("homework-item-array"));
    if (array === null) array = [];
    HomeworkItem.homeworkList = array;
  }
  static saveList() {
    localStorage.setItem(
      "homework-item-array",
      JSON.stringify(HomeworkItem.homeworkList)
    );
  }
}

//* Important Functions

const createElementWithText = (element, text, textInSpan = false) => {
  const newElement = document.createElement(element);
  let textNode = undefined;
  if (textInSpan) {
    textNode = createElementWithText("span", text);
  } else {
    textNode = document.createTextNode(text);
  }
  newElement.appendChild(textNode);
  return newElement;
};

const deleteItem = (event) => {
  //event.target is button
  const li = event.target.parentElement;
  const ul = li.parentElement;
  const spans = li.querySelectorAll("span");
  const name = spans[0];
  const date = spans[1];
  for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
    let item = HomeworkItem.homeworkList[i];
    if (item.date === date.textContent && item.name === name.textContent) {
      HomeworkItem.homeworkList.splice(i, 1);
    }
    li.remove();
  }
  HomeworkItem.refreshList(ul);
};

//* Create List Item Element

const createItemLi = (item, date) => {
  //Create New Element And Text
  const newLi = createElementWithText("li", "");
  //Create Span with Assignment
  const assignmentSpan = createElementWithText("span", item);
  assignmentSpan.classList.add("assignment-span");
  newLi.appendChild(assignmentSpan);
  //Create Span with Date
  const dateSpan = createElementWithText("span", date);
  newLi.appendChild(dateSpan);
  //Add Delete Button to Li
  const newBtn = createElementWithText("button", "X");
  newBtn.classList.add("delete-btn");
  newBtn.addEventListener("click", deleteItem);
  newLi.appendChild(newBtn);

  //Add Edit Button to Li
  const editBtn = createElementWithText("button", "Edit");
  editBtn.addEventListener("click", editListItem);
  editBtn.classList.add("edit-btn");
  newLi.appendChild(editBtn);

  //Add New List Item
  itemList.appendChild(newLi);

  //Clear Input
  createItemInput.value = "";
};

//* CREATE ITEM Obejct FUNC

const createItemObject = () => {
  //Create new homework item
  const item = new HomeworkItem(createItemInput.value, dateInput.value);
  createItemLi(item.name, item.date);
  HomeworkItem.refreshList(itemList);
};

const editListItem = (event) => {
  // Get Elements
  const li = event.target.parentElement;
  event.target.classList.toggle("activated-edit-btn");

  //Create Inputs
  const inputBox = createElementWithText("input", "");
  const dateInputBox = createElementWithText("input", "");
  const updateBtn = createElementWithText("button", "Update");

  //Check for an already existing input box
  let returnNow = false;
  for (let i = 0; i < li.children.length; i++) {
    if (
      li.children[i].getAttribute("name") === "edit-item-input" ||
      li.children[i].getAttribute("name") === "edit-date-input" ||
      li.children[i].getAttribute("name") === "update-btn"
    ) {
      li.children[i].remove();
      i--;
      returnNow = true;
    }
  }
  if (returnNow) return;

  //edit the input box
  inputBox.setAttribute("name", "edit-item-input");
  inputBox.setAttribute("placeholder", "New Homework Name");
  inputBox.setAttribute("value", li.children[0].textContent);

  //edit the date input box
  dateInputBox.setAttribute("name", "edit-date-input");
  dateInputBox.setAttribute("type", "date");
  dateInputBox.setAttribute("value", li.children[1].textContent);

  //Edit the update button
  updateBtn.setAttribute("name", "update-btn");
  updateBtn.addEventListener("click", (event) => {
    //Update the homework item array
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      element = HomeworkItem.homeworkList[i];
      if (
        element.name === li.children[0].textContent &&
        element.date === li.children[1].textContent
      ) {
        element.name = inputBox.value;
        element.date = dateInputBox.value;
      }
    }

    li.children[0].textContent = inputBox.value;
    li.children[1].textContent = dateInputBox.value;
    HomeworkItem.reorder();
  });

  //Add new input box
  li.appendChild(inputBox);
  li.appendChild(dateInputBox);
  li.appendChild(updateBtn);
};

//* Set the date input to be default today's date
const setDefaultDate = () => {
  const today = new Date();
  dateInput.value = today.toISOString().split("T")[0];
};

//* Run Necessary Funcs
HomeworkItem.loadList();
HomeworkItem.refreshList();
setDefaultDate();
createBtn.addEventListener("click", createItemObject);
createItemInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") createItemObject();
});

reorderBtn.addEventListener("click", () => {
  HomeworkItem.reorder();
});
