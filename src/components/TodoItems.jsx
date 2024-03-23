import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const TodoItems = ({ title, status, id, list, assignedTo, completionDateTime }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedAssignedTo, setEditedAssignedTo] = useState(assignedTo);
  const [editedDateTime, setEditedDateTime] = useState(completionDateTime);
  const [assignedToOptions, setAssignedToOptions] = useState(["Waqi", "John", "Brain"]);

  const edit = async () => {
    try {
        console.log(editedStatus)
      const updatedTodo = {
        title: editedTitle,
        status: editedStatus,
        assignedTo: editedAssignedTo,
        completionDateTime: editedDateTime
      };

      await axios
        .patch(`http://localhost:3000/tasks/${id}`, updatedTodo)
        .then((res) => {
          console.log("successful");
          list[0](list[1]);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <div>
          <input
            className="tick"
            type="checkbox"
            onChange={() => "readOnly"}
            checked={editedStatus}
          />
          <span
            onClick={() => {
              setEditedStatus(!editedStatus);
              edit();
            }}
            className="checkmark"
          ></span>
          {isEdit ? (
            <input
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
              }}
            />
          ) : (
            <h3
              style={{ color: editedStatus ? "gray" : "white" }}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {title}
            </h3>
          )}
          {isEdit ? (
            <input
                type="datetime-local"
              value={editedDateTime}
              onChange={(e) => {
                setEditedDateTime(e.target.value);
              }}
            />
          ) : (
            <h3
              style={{ color: editedStatus ? "gray" : "white" }}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {editedDateTime}
            </h3>
          )}
          {isEdit ? (
            <select
          value={editedAssignedTo}
          onChange={(e) => setEditedAssignedTo(e.target.value)}
        >
          <option value="">Select Assigned To</option>
          {assignedToOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
          ) : (
            <h3
              style={{ color: editedStatus ? "gray" : "white" }}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {assignedTo}
            </h3>
          )}
          {isEdit && (
            <button
              onClick={() => {
                setIsEdit(false);
                edit(id, true, false);
              }}
            >
              ✔
            </button>
          )}
        </div>
        <button
          onClick={() => {
            axios.delete(`http://localhost:3000/tasks/${id}`).then((res) => {
              console.log("successful");
              list[0](list[1]);
            });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <hr />
    </>
  );
};