const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "todoApplication.db");
const { format, compareAsc } = require("date-fns");

let db = null;

const initializeDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db error: ${e.message}`);
  }
};

initializeDbandServer();

const convertTodoObjectToDatabseResponseObject = (todoObject) => {
  return {
    id: todoObject.id,
    todo: todoObject.todo,
    priority: todoObject.priority,
    status: todoObject.status,
    category: todoObject.category,
    dueDate: todoObject.due_date,
  };
};

const isQuerparamAstatus = (requestQuery) => {
  return (
    requestQuery.status !== undefined &&
    requestQuery.category === undefined &&
    requestQuery.priority === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q === undefined
  );
};

const isQueryParamAcategory = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q === undefined
  );
};

const isAvalidPriority = (requestQuery) => {
  return (
    requestQuery.priority === "HIGH" ||
    requestQuery.priority === "LOW" ||
    requestQuery.priority === "MEDIIUM"
  );
};

const isAvalidStatus = (requestQuery) => {
  return (
    requestQuery.status === "TO DO" ||
    requestQuery.status === "IN PROGRESS" ||
    requestQuery.status === "DONE"
  );
};

const isQueryPramPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined &&
    requestQuery.category === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q === undefined
  );
};

const isQueryParamCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.status !== undefined &&
    requestQuery.category !== undefined &&
    requestQuery.priority === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q === undefined
  );
};

const isItSearchQ = (requestQuery) => {
  return (
    requestQuery.category === undefined &&
    requestQuery.status === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q !== undefined
  );
};

const isQueryParamCategory = (requestQuery) => {
  return (
    requestQuery.status === undefined &&
    requestQuery.priority === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.search_q === undefined
  );
};

const isAvalidCategory = (requestQuery) => {
  return (
    requestQuery.category === "WORK" ||
    requestQuery.category === "HOME" ||
    requestQuery.category === "LEARNING"
  );
};

const isQPcategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.status === undefined &&
    requestQuery.search_q === undefined &&
    requestQuery.due_date === undefined &&
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined
  );
};

const isQueryParamApriority = (requestQuery) => {
  return (
    requestQuery.priority !== undefined &&
    requestQuery.status === undefined &&
    requestQuery.category === undefined &&
    requestQuery.search_q === undefined &&
    requestQuery.due_date === undefined
  );
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasTodoProperty = (requestQuery) => {
  return requestQuery.todo !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasDueDdateProperty = (requestQuery) => {
  return requestQuery.dueDate !== undefined;
};

const isDuedateValid = (requestQuery) => {
  const formattedDate = format(new Date(requestQuery.dueDate), "yyyy-MM-dd");
  return formattedDate;
};

app.get("/todos/", async (request, response) => {
  const { status, priority, category, due_date, search_q } = request.query;

  switch (true) {
    case isQuerparamAstatus(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        const selectTodoQuery = ` SELECT * FROM todo WHERE status = '${status}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case isQueryParamApriority(request.query):
      if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
        const selectTodoQuery = ` SELECT * FROM todo WHERE priority = '${priority}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case isQueryPramPriorityAndStatus(request.query):
      const isValidPriority = isAvalidPriority(request.query);
      const isValidStatus = isAvalidStatus(request.query);
      // console.log("in priority and status");

      if (isValidPriority && isValidStatus) {
        const selectTodoQuery = ` SELECT * FROM todo WHERE priority = '${priority}' AND status = '${status}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        if (isValidStatus === false) {
          response.status(400);
          response.send("Invalid Todo Status");
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      }
      break;

    case isItSearchQ(request.query):
      const selectTodoQuery = ` SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
      const todoObject = await db.all(selectTodoQuery);
      response.send(
        todoObject.map((eachObject) =>
          convertTodoObjectToDatabseResponseObject(eachObject)
        )
      );
      break;

    case isQueryParamCategoryAndStatus(request.query):
      console.log("iam in category and status");
      const isValidCategory = isAvalidCategory(request.query);
      const isStatusValid = isAvalidStatus(request.query);

      if (isValidCategory && isStatusValid) {
        const selectTodoQuery = ` SELECT * FROM todo WHERE category = '${category}' AND status = '${status}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        if (isStatusValid === false) {
          response.status(400);
          response.send("Invalid Todo Status");
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      }
      break;

    case isQueryParamCategory(request.query):
      if (
        category === "HOME" ||
        category === "WORK" ||
        category === "LEARNING"
      ) {
        const selectTodoQuery = `SELECT * FROM todo WHERE category = '${category}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case isQPcategoryAndPriority(request.query):
      const validateCategory = isAvalidCategory(request.query);
      const validatePriority = isAvalidPriority(request.query);

      if (validateCategory && validatePriority) {
        const selectTodoQuery = ` SELECT * FROM todo WHERE category = '${category}' AND priority = '${priority}'`;
        const todoObject = await db.all(selectTodoQuery);
        response.send(
          todoObject.map((eachObject) =>
            convertTodoObjectToDatabseResponseObject(eachObject)
          )
        );
      } else {
        if (validateCategory === false) {
          response.status(400);
          response.send("Invalid Todo Category");
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      }
      break;

    default:
      response.send("no response");
      break;
  }
});

// get todo based on todo id

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getSpecificTodoQuery = `SELECT * FROM todo WHERE id = ${todoId}`;
  const todo = await db.get(getSpecificTodoQuery);
  response.send(convertTodoObjectToDatabseResponseObject(todo));
});

//get todos with specific due date in the query parameter

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const validatedDate = format(new Date(date), "yyyy-MM-dd");

  if (validatedDate === date) {
    const getTodoWithSpecificDueDate = ` SELECT * FROM todo WHERE due_date = '${date}'`;
    const todo = await db.all(getTodoWithSpecificDueDate);
    response.send(
      todo.map((eachObject) =>
        convertTodoObjectToDatabseResponseObject(eachObject)
      )
    );
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//post a todo in the todo table

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const validDateFormat = format(new Date(dueDate), "yyyy-MM-dd");
  const isDateValid = validDateFormat === dueDate;
  if (
    isAvalidPriority(request.body) &&
    isAvalidCategory(request.body) &&
    isAvalidStatus(request.body) &&
    isDateValid
  ) {
    const createTodoQuery = ` INSERT INTO todo (id, todo,category, priority, status, due_date) 
    VALUES (${id}, '${todo}', '${category}', '${priority}', '${status}', '${dueDate}')`;
    await db.run(createTodoQuery);
    response.send("Todo Successfully Added");
  } else {
    if (isAvalidStatus(request.body) === false) {
      response.status(400);
      response.send("Invalid Todo Status");
    } else if (isAvalidPriority(request.body) === false) {
      response.status(400);
      response.send("Invalid Todo Priority");
    } else if (isAvalidCategory(request.body) === false) {
      response.status(400);
      response.send("Invalid Todo Category");
    } else if (isDateValid === false) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

//Updates the details of a specific todo based on the todo ID

app.put("/todos/:todoId/", async (request, response) => {
  const { status, priority, todo, category, dueDate } = request.body;
  const { todoId } = request.params;

  switch (true) {
    case hasStatusProperty(request.body):
      if (isAvalidStatus(request.body)) {
        console.log(status);
        const updateTodoQuery = `UPDATE todo SET status = '${status}' WHERE id = ${todoId}`;
        await db.run(updateTodoQuery);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hasPriorityProperty(request.body):
      if (isAvalidPriority(request.body)) {
        const updatepriorityIntodoQuery = `UPDATE todo SET priority = '${priority}' WHERE id = ${todoId}`;
        await db.run(updatepriorityIntodoQuery);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case hasTodoProperty(request.body):
      const updateTodoProperty = `UPDATE todo SET todo = '${todo}' WHERE id = ${todoId}`;
      await db.run(updateTodoProperty);
      response.send("Todo Updated");
      break;
    case hasCategoryProperty(request.body):
      if (isAvalidCategory(request.body)) {
        const updateCategoryProperty = `UPDATE todo SET category = '${category}' WHERE id = ${todoId}`;
        await db.run(updateCategoryProperty);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    case hasDueDdateProperty(request.body):
      const validDate = isDuedateValid(request.body);
      if (validDate === dueDate) {
        const updateDuedtaeProperty = `UPDATE todo SET due_date = '${dueDate}' WHERE id = ${todoId}`;
        await db.run(updateDuedtaeProperty);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
      break;
  }
});

// Deletes a todo from the todo table based on the todo ID

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `DELETE FROM todo WHERE id = ${todoId}`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
