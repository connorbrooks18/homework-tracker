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


//* List Item Class

class HomeworkItem {
  static homeworkList = [];

  constructor(name, date) {
    this.name = name;
    this.date = date;
    HomeworkItem.homeworkList.push(this);
  }
  static reorder(byDate = true, refresh = true) {
    console.log(HomeworkItem.homeworkList)
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

const refresh = (listUl = itemList) => {
  HomeworkItem.reorder()

  // Delete previous elements
  listUl.innerHTML = ""


  //Fill in with list
  for (let i = 0; i < HomeworkItem.homeworkList.length; i++) {
    createItemLi(
      HomeworkItem.homeworkList[i].name,
      HomeworkItem.homeworkList[i].date
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
  
  
};

//* Set the date input to be default today's date
const setDefaultDate = () => {
  const today = new Date();
  dateInput.value = today.toISOString().split("T")[0];
};


const convertDaysToDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
};

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
