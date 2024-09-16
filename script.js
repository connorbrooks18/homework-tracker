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
const changeDateViewBtn = document.querySelector(".days-left-btn");

//* Keep track of date view
  // 0 is full date; 1 is days until
let dateview = 1


//* List Item Class

class HomeworkItem {
  static homeworkList = [];

  constructor(name, date) {
    this.name = name;
    this.date = date;
    HomeworkItem.homeworkList.push(this);
  }
  static reorder(byDate = true, refresh = true) {
    const list = HomeworkItem.homeworkList;
    list.sort((item1, item2) => {
      let returnVal = 0;
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
    return;
  }
  static saveList() {
    localStorage.setItem(
      "homework-item-array",
      JSON.stringify(HomeworkItem.homeworkList)
    );
  }
  static loadList() {
    let array = JSON.parse(localStorage.getItem("homework-item-array"));
    if (array === null) array = [];
    HomeworkItem.homeworkList = array;
  }
}

//* Important Functions

const refresh = (listUl = itemList, dateType=dateview) => {
  HomeworkItem.saveList();
  HomeworkItem.reorder()

  // Delete previous elements
  listUl.innerHTML = ""


  //Fill in with list
  for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
    assignment = HomeworkItem.homeworkList[i].name
    date = "";
    if(dateType === 0) {
      date = yearFirstDateToRegular(HomeworkItem.homeworkList[i].date);
    }
    else {
      today = new Date().getTime();
      due = new Date(HomeworkItem.homeworkList[i].date).getTime();
      date = `${Math.ceil(
        (due - today) / (1000 * 60 * 60 * 24)
      )} day(s)`;
    }
    createItemLi(
      assignment,
      date
    );
  }
}


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
  dateSpan.classList.add("date-span");
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
  let assignment = createItemInput.value
  let date = dateInput.value
  let invalid = false;

  
  HomeworkItem.homeworkList.forEach(item => {
    if(assignment === item.name){
      alert("Must be unique assignment name");
      invalid = true;
      
    }
  });

  if(assignment.trim() === "" || date.trim() === "" || invalid){
    return;
  }

  let homeworkItem = new HomeworkItem(assignment, date);

  HomeworkItem.saveList();

  refresh();
};

const deleteItem = (event) => {
  const li = event.target.parentElement;
  const spans = li.querySelectorAll("span");
  const name = spans[0].textContent;

  for(let i = 0; i < HomeworkItem.homeworkList.length; i++){
    item = HomeworkItem.homeworkList[i];
    if(item.name === name){
      HomeworkItem.homeworkList.splice(i, 1)
      break;
    }
  }
  HomeworkItem.saveList();

  refresh();
};



const editListItem = (event) => {
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
  defaultDate = new Date();
  if(dateview === 0){
    defaultDate = regularDateToYearFirst(li.children[1].textContent);
  } else {
    defaultDate = convertDaysToDate(new Date(), Number(li.children[1].textContent.split(" ")[0])).toISOString().split("T")[0];
    console.log(defaultDate)
  }
  dateInputBox.setAttribute("value", defaultDate);

  //Edit the update button
  updateBtn.setAttribute("name", "update-btn");
  updateBtn.addEventListener("click", (event) => {
    //Update the homework item array
    for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
      element = HomeworkItem.homeworkList[i];
      if ( element.name === li.children[0].textContent ) {
        element.name = inputBox.value;
        element.date = dateInputBox.value;
      }
    }

  
    refresh();
  });

  //Add new input box
  li.appendChild(inputBox);
  li.appendChild(dateInputBox);
  li.appendChild(updateBtn);

  
  
};

//* Set the date input to be default tomorrow's date
const setDefaultDate = () => {
  let today = new Date();
  today.setDate(today.getDate() + 1);
  dateInput.value = today.toISOString().split("T")[0];
  console.log(dateInput.value);
};


const convertDaysToDate = (date, days) => {
  date.setDate(date.getDate() + days);
  return date
};

const regularDateToYearFirst = (regularDate) => {
  regularDate = regularDate.split("-");
  return regularDate[2] + "-" + regularDate[0] + "-" + regularDate[1];
}
const yearFirstDateToRegular = (yearFirstDate) => {
  yearFirstDate = yearFirstDate.split("-");
  return yearFirstDate[1] + "-" + yearFirstDate[2] + "-" + yearFirstDate[0];
}

//

//

//* Run Necessary Funcs
setDefaultDate();



HomeworkItem.loadList();
refresh();

createBtn.addEventListener("click", createItemObject);
createItemInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") createItemObject();
});

changeDateViewBtn.addEventListener("click", (event) => {
  dateview = 1 - dateview;
  changeDateViewBtn.classList.toggle("activated")
  refresh();
})
