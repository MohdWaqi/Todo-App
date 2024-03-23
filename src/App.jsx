import { useState, useEffect } from "react";
import axios from "axios";
import { TodoItems } from "./components/TodoItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";

const todoData = async (endpoint) => {
  try {
    let res = await axios.get(endpoint);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
function App() {
  const [newTask, setNewTask] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [assignedToOptions, setAssignedToOptions] = useState([
    "Waqi",
    "John",
    "Brain",
  ]);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState("");
  const [sortBy, setSortBy] = useState("completionDateTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignedTo, setFilterAssignedTo] = useState("");

  useEffect(() => {
    getData(page);
  }, [page, filterStatus, filterAssignedTo]);

  const getData = async (page) => {
    setIsLoading(true);
    try {
      const statusQueryParam = filterStatus === 'all' ? '' : `&status=${filterStatus}`;
      const assignedToQueryParam = filterAssignedTo === '' ? '' : `&assignedTo=${filterAssignedTo}`
      let task = await todoData(
        `http://localhost:3000/tasks?_limit=6&_page=${page}${statusQueryParam}${assignedToQueryParam}`
      );
      setTotalPages(Math.ceil(Number(task.headers["x-total-count"] / 6)));
      setItems(task.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const AddTask = async () => {
    const data = {
      title: newTask,
      completed: false,
      assignedTo: selectedAssignedTo,
      completionDateTime: selectedDateTime,
    };
    await axios
      .post("http://localhost:3000/tasks", data)
      .then((res) => {
        console.log(res);
        setNewTask("");
        setSelectedDateTime("");
        getData(page);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <img src="https://media.wired.com/photos/62f43bda23d2b53441872eda/3:2/w_2400,h_1600,c_limit/tunnel_robots_science_GettyImages-1030459242.jpg"></img>
      <div className="todoDisplay">
        <h1>TODO LIST</h1>
        <div>
          <div>
            <button
              className="add"
              onClick={() => {
                newTask !== "" && AddTask();
              }}
            >
              +
            </button>
            <input
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
              placeholder="Create a new Task..."
              required
            />
            <select
              value={selectedAssignedTo}
              onChange={(e) => setSelectedAssignedTo(e.target.value)}
              required
            >
              <option value="">Select Assigned To</option>
              {assignedToOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="filter">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
          <label>Assigned To:</label>
          <select
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
          >
            <option value="">All</option>
            {assignedToOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="tasks">
          {isLoading ? (
            <ReactLoading
              type="bubbles"
              style={{ width: "30%", marginLeft: "25%" }}
            />
          ) : (
            <>
              {items.map((task) => (
                <TodoItems
                  key={task.id}
                  title={task.title}
                  status={task.completed}
                  id={task.id}
                  assignedTo={task.assignedTo}
                  completionDateTime={task.completionDateTime}
                  list={[getData, page]}
                />
              ))}
            </>
          )}
        </div>

        <div>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            style={{ backgroundColor: page === 1 && "gray" }}
            onClick={() => setPage(1)}
          >
            1
          </button>
          <button
            style={{ backgroundColor: page === 2 && "gray" }}
            onClick={() => setPage(2)}
          >
            2
          </button>
          <button
            style={{ backgroundColor: page === 3 && "gray" }}
            onClick={() => setPage(3)}
          >
            3
          </button>
          ...
          <button
            style={{ backgroundColor: page === totalPages && "gray" }}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
