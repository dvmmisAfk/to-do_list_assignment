# Todo App - Backend

This is the backend for my assignment 7/8 todo app. It's a REST API built with Node.js, Express and MongoDB. Tasks are stored in MongoDB and the API lets you create, read, update and delete them.

---

## Folder structure

```
backend/
├── server.js                        ← entry point, connects to mongo and starts express
├── .env                             ← your actual secrets (don't commit this)
├── .env.example                     ← template showing what env vars are needed
└── src/
    ├── models/Task.js               ← mongoose schema for a task
    ├── routes/taskRoutes.js         ← maps URLs to controller functions
    ├── controllers/taskController.js ← receives the request, calls service, sends response
    ├── services/taskService.js      ← actual logic: validation, DB calls
    └── middleware/errorHandler.js   ← catches errors from all routes
```

---

## How to run it

1. make sure you have Node.js installed (v18 or newer)

2. install packages:
```
npm install
```

3. create a `.env` file in this folder (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/todoapp
```

you can get a free MongoDB cluster at mongodb.com/atlas

4. start the server:
```
npm run dev
```

it should print `connected to mongodb` and `server is running on port 5000`

---

## API endpoints

the base URL when running locally is `http://localhost:5000`

| method | path | what it does |
|--------|------|-------------|
| GET | /tasks | get all tasks (supports ?search=, ?status=, ?priority=) |
| GET | /tasks/:id | get one task by id |
| POST | /tasks | create a task (title required) |
| PUT | /tasks/:id | update a whole task (title still required) |
| PATCH | /tasks/:id | update just some fields (I use this for toggling status) |
| DELETE | /tasks/:id | delete a task |

### what a task looks like

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "buy groceries",
  "description": "milk, eggs, bread",
  "due_date": "2025-07-01T00:00:00.000Z",
  "priority": "medium",
  "status": "pending",
  "created_at": "2025-06-15T10:30:00.000Z"
}
```

priority can be: `low`, `medium`, `high`
status can be: `pending`, `completed`

### error responses look like this

```json
{
  "message": "task not found"
}
```

status 400 = bad input, 404 = not found, 500 = server broke

---

## Environment variables

PORT - which port to run on (defaults to 5000 if not set)
MONGODB_URI - your full mongodb connection string, required

---

## Deploying to Render

1. push this backend folder to github
2. go to render.com and create a new Web Service
3. connect your repo
4. build command: `npm install`
5. start command: `npm start`
6. add environment variables PORT and MONGODB_URI in the Render dashboard
7. use a free MongoDB Atlas cluster for the database

---

## Stuff I got stuck on

**UUID as _id** - MongoDB normally uses its own ObjectId for the `_id` field but the assignment wanted UUID v4 strings. I had to set `_id: { type: String, default: uuidv4 }` in the schema and pass `{ _id: false }` to the schema options so mongoose doesn't try to generate its own. Then I added a `toJSON` transform so the response shows `id` instead of `_id` (frontend was getting confused with the underscore).

**PUT vs PATCH** - I wasn't sure when to use which. PUT is for replacing the whole resource so I kept title required there. PATCH is just for partial updates so I used mongoose's `$set` to only change the fields that were actually sent. I mainly use PATCH for toggling the completed status from the frontend.

**Error handling middleware** - express error handlers need exactly 4 parameters `(err, req, res, next)` or it won't work as an error handler. I kept forgetting that at first and my errors weren't being caught.
