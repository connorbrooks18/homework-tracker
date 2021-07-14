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
  static refreshList(listUl) {
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      listUl.children[0].remove();
    }
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      createItemLi(
        HomeworkItem.homeworkList[i].name,
        HomeworkItem.homeworkList[i].date
      );
    }
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
};

//* Create List Item Element

const createItemLi = (item, date) => {
  //Create New Element And Text
  const newLi = createElementWithText("li", item, true);

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
};

const editListItem = (event) => {
  // Get Elements
  const li = event.target.parentElement;
  const editBtn = document.querySelector(".edit-btn");
  editBtn.classList.toggle("activated-edit-btn");

  //Create Inputs
  const inputBox = createElementWithText("input", "");
  const dateInputBox = createElementWithText("input", "");

  //Check for an already existing input box
  let returnNow = false;
  for (let i = 0; i < li.children.length; i++) {
    if (
      li.children[i].getAttribute("name") === "edit-item-input" ||
      li.children[i].getAttribute("name") === "edit-date-input"
    ) {
      li.children[i].remove();
      i--;
      returnNow = true;
    }
  }
  if (returnNow) return;

  //edit the input box
  inputBox.setAttribute("name", "edit-item-input");
  inputBox.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") return;

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

  //edit the date input box
  dateInputBox.setAttribute("name", "edit-date-input");
  dateInputBox.setAttribute("type", "date");

  //Add new input box
  li.appendChild(inputBox);
  li.appendChild(dateInputBox);
};

//* Run Necessary Funcs
createBtn.addEventListener("click", createItemObject);
createItemInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") createItemObject();
});

reorderBtn.addEventListener("click", () => {
  HomeworkItem.reorder();
});
