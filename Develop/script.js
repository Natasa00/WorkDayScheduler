class TimeTaskJson {
  constructor(hour, task) {
    this.hour = hour;
    this.task = task;
  }
}

window.onload = function () {
  const currentTimeblocks = localStorage.getItem("timeblockObjects");
  const allTimeTasks = currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
  const currentTime = dayjs();

  displayCurrentDate(currentTime);
  displayTimeblockRows(currentTime);

  document
    .querySelector(".container-lg")
    .addEventListener("click", function (event) {
      saveTasks(event, allTimeTasks);
    });

  if (allTimeTasks.length !== 0) {
    for (let row of allTimeTasks) {
      document.querySelector(`#hour-${row.hour} textarea`).value = row.task;
    }
  }
};

function displayCurrentDate(currentTime) {
  document.getElementById("currentDay").textContent =
    currentTime.format("dddd, D MMMM YYYY");
}

/*** functions for displaying all hour rows ***/
function displayTimeblockRows(currentTime) {
  const currentHour = currentTime.hour();
  //working hours until 5pm(17 hrs)
  for (let i = 9; i <= 17; i++) {
    const timerow = createTimeblockRow(i, currentHour);
    const innerColumns = [createHourDiv(i), createTextArea(), createSaveBtn()];
    for (let eachColumn of innerColumns) {
      timerow.appendChild(eachColumn);
    }
    document.querySelector(".container-lg").appendChild(timerow);
  }
}

/*Creating inner divs to display timme rows */
function createTimeblockRow(hourId, currentHour) {
  const timeblock = document.createElement("div");
  timeblock.classList.add("row");
  timeblock.classList.add("time-block");
  const hourClass =
    hourId < currentHour
      ? "past"
      : hourId === currentHour
      ? "present"
      : "future";
  timeblock.classList.add(hourClass);
  timeblock.id = `hour-${hourId}`;
  return timeblock;
}

function createHourDiv(hour) {
  const col = document.createElement("div");
  col.classList.add("col-2", "col-md-1", "hour", "text-center", "py-3");
  col.append(dayjs().hour(hour).format("ha"));
  return col;
}

function createTextArea() {
  const textArea = document.createElement("textarea");
  textArea.classList.add("col-8", "col-md-10", "description");
  textArea.rows = 3;
  return textArea;
}

function createSaveBtn() {
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("btn", "saveBtn", "col-2", "col-md-1");
  saveBtn.ariaLabel = "save";
  saveBtn.innerHTML = '<i class="fas fa-save"></i>';
  saveBtn.ariaHidden = true;
  return saveBtn;
}

/* function for saving to local storage */
function saveTasks(event, timeblockList) {
  if (event.target.matches("button") || event.target.matches(".fa-save")) {
    const timeblockHour = event.target.parentElement.id.split("-")[1];
    const textAreaValue = document.querySelector(
      `#hour-${Number(timeblockHour)} textarea`
    ).value;
    storeTimeAndTask(
      new TimeTaskJson(timeblockHour, textAreaValue),
      timeblockList
    );
    localStorage.setItem("timeblockObjects", JSON.stringify(timeblockList));
  }
}

// loading json obj with time and relted tasks
function storeTimeAndTask(newTimeblockObj, timeblockList) {
  if (timeblockList.length > 0) {
    for (let savedTimeblock of timeblockList) {
      if (savedTimeblock.hour === newTimeblockObj.hour) {
        savedTimeblock.task = newTimeblockObj.task;
        return;
      }
    }
  }
  timeblockList.push(newTimeblockObj);
  return;
}
