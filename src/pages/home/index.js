/* eslint-disable array-callback-return */
import AddIcon from "../../assets/images/add-icon.svg";
import MoreIcon from "../../assets/images/more.svg";
import "./style.css";

import { CALENDAR_DATA_JSON } from "../../mock/calendar";
import { getDaysOfCurrentWeek } from "../../utils/date-format";

import { useEffect, useState } from "react";

const currentDate = new Date();
const currentDay = Number(currentDate.getDay());

const DAYS_CURRENT_WEEK = getDaysOfCurrentWeek();

function Home() {
  const [daysCurrent] = useState(DAYS_CURRENT_WEEK);
  const [calendarData, setCalendarData] = useState(CALENDAR_DATA_JSON);

  const [draggingMain, setDraggingMain] = useState(null);
  const [draggingSub, setDraggingSub] = useState(null);

  useEffect(() => {
    let calendar = localStorage.getItem("calendar");

    if (!calendar) {
      calendar = CALENDAR_DATA_JSON;
    } else {
      calendar = JSON.parse(calendar);
    }
    setCalendarData(calendar);
  }, []);

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("draggedItemId", id);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();

    let targetElement = event.target;
    let targetId = targetElement.getAttribute("id");

    // Tìm phần tử cha có id nếu element không có id
    if (!targetId) {
      const parentElementWithId = targetElement.closest("[id]");
      targetId = parentElementWithId
        ? parentElementWithId.getAttribute("id")
        : "No ID found";
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      const dataInfo = element.getAttribute("datainfo");
      const parsedData = JSON.parse(dataInfo);

      // Cập nhật workout chính
      if (draggingMain?.type === "main-workout" && parsedData && !draggingSub) {
        const newData = [...calendarData].map((item) => {
          if (item.id === draggingMain.data.id) {
            return { ...item, date: parsedData.date };
          }
          return item;
        });

        setCalendarData(newData);
        localStorage.setItem("calendar", JSON.stringify(newData));
      }

      if (parsedData?.id === draggingMain?.data?.id) {
        return false;
      }

      // Cập nhật workout phụ
      if (draggingSub && parsedData.title) {
        const newData = [...calendarData].map((item) => {
          if (item.id === parsedData.id) {
            const workouts = [...item.workouts].concat(draggingSub.data);
            return { ...item, workouts };
          }

          if (item.id === draggingMain.data.id) {
            const workouts = [...item.workouts].filter(
              (w) => w.id !== draggingSub.data.id
            );
            return { ...item, workouts };
          }
          return item;
        });

        setCalendarData(newData);
        localStorage.setItem("calendar", JSON.stringify(newData));
      }

      setDraggingMain(null);
      setDraggingSub(null);
    }
  };

  return (
    <div className="home-page">
      <div className="wrapper-calendar">
        {daysCurrent.map((itemDay) => (
          <div
            key={itemDay.date}
            className="inner-column"
            id={`day-${itemDay.dayOfWeek}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            datainfo={JSON.stringify(itemDay)}
          >
            <div className="rank">{itemDay.dayOfWeek}</div>
            <div className="contains">
              <div className="on-day">
                <span
                  className={
                    currentDay === Number(itemDay.date.slice(0, 2))
                      ? "today"
                      : ""
                  }
                >
                  {itemDay.date.slice(0, 2)}
                </span>
                <img src={AddIcon} alt="" />
              </div>
              {calendarData.map((workoutItem) => {
                if (workoutItem.date === itemDay.date) {
                  return (
                    <div
                      className="workout-item"
                      key={workoutItem.title}
                      id={`drag-workout-${workoutItem.id}`}
                      draggable
                      onDragStart={(event) => {
                        onDragStart(event, workoutItem.title);
                        setDraggingMain({
                          type: "main-workout",
                          data: workoutItem,
                        });
                      }}
                      onDragOver={onDragOver}
                      onDrop={(event) => onDrop(event, workoutItem.title)}
                      datainfo={JSON.stringify(workoutItem)}
                    >
                      <div className="main-workout">
                        <div className="label-ex">
                          <span
                            className="truncate"
                            style={{ width: "128px" }}
                            title={workoutItem.title}
                          >
                            {workoutItem.title}
                          </span>
                          <img src={MoreIcon} alt="" />
                        </div>

                        {workoutItem.workouts.length > 0 &&
                          workoutItem.workouts.map((subItem) => (
                            <div
                              className="sub-workout-contains"
                              key={subItem.id}
                              draggable
                              onDragStart={(event) => {
                                onDragStart(event, subItem.id);
                                setDraggingSub({
                                  type: "sub-workout",
                                  data: subItem,
                                });
                              }}
                              onDragOver={onDragOver}
                              onDrop={(event) => onDrop(event, workoutItem.id)}
                            >
                              <div className="multiple">
                                x{subItem.multiple}
                              </div>
                              <div className="content">
                                <p
                                  className="title truncate"
                                  title={subItem.title}
                                >
                                  {subItem.title}
                                </p>
                                <p className="desc truncate">
                                  {subItem.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        <img className="add-new" src={AddIcon} alt="" />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
