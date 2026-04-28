# Todo App - Frontend

React frontend for my assignment 8 todo app. It connects to the Express backend using Axios and lets you create, edit, delete and complete tasks. You can also search and filter them.

---

## Folder structure

```
frontend/
├── index.html
├── vite.config.js      ← vite config, also sets up the proxy to the backend
└── src/
    ├── main.jsx        ← renders App into the page
    ├── App.jsx         ← main component, holds all the state
    ├── App.css         ← all the styles
    ├── api/
    │   └── taskApi.js  ← all the axios calls in one place
    └── components/
        ├── TaskCard.jsx      ← shows one task
        ├── TaskForm.jsx      ← the create/edit popup
        ├── SearchFilter.jsx  ← search box + dropdowns
        └── LoadingSpinner.jsx
```

---

## How to run it

the backend has to be running first (see the backend README)

1. install packages:
```
npm install
```

2. start the dev server:
```
npm run dev
```

open http://localhost:3000 in your browser

for production you need a `.env` file:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/tasks
```

in development you don't need this because vite proxies `/tasks` requests to `localhost:5000` automatically (configured in vite.config.js)

---

## What you can do in the app

- add a task with a title, optional description, due date and priority
- edit a task by clicking the Edit button
- delete a task (asks you to confirm first)
- click the circle on the left to mark it done or pending
- search tasks by typing in the search box
- filter by status (pending/completed) or priority (low/medium/high)
- tasks with a past due date show a warning if they're not done yet

---

## How the API calls work

all the axios code is in `src/api/taskApi.js`. I created an axios instance with a base URL so I don't have to type the full URL every time. There's also an interceptor that pulls out the error message from the server response so I can just show `err.message` in the UI.

```js
// example of how I call the API in App.jsx
const tasks = await taskApi.getAllTasks({ search: 'groceries', status: 'pending' })
await taskApi.patchTask(taskId, { status: 'completed' })
await taskApi.deleteTask(taskId)
```

every time something changes (create, edit, delete, toggle) I just call `fetchTasks()` again to reload from the server. It's a bit slower than updating state manually but it keeps the frontend in sync with whatever the database actually has.

---

## Deploying to Netlify

1. push the frontend folder to github
2. go to netlify.com and create a new site from your repo
3. base directory: `frontend`
4. build command: `npm run build`
5. publish directory: `frontend/dist`
6. add environment variable `VITE_API_BASE_URL` pointing to your Render backend URL

make sure the backend allows requests from your Netlify domain (cors)

---

## Stuff I got stuck on

**Vite proxy** - in development I didn't want to hardcode localhost:5000 in the code and deal with CORS. I found you can set up a proxy in vite.config.js so `/tasks` gets forwarded to the backend automatically. That was pretty handy.

**VITE_ prefix for env variables** - spent a while confused why my env variable wasn't working. Turns out Vite only exposes env variables to the frontend if they start with `VITE_`. So it has to be `VITE_API_BASE_URL` not just `API_BASE_URL`.

**useEffect re-running** - when I first wrote it I had `fetchTasks` inside useEffect and also in the dependency array and it caused an infinite loop. I fixed it by putting `filters` in the dependency array instead, and defining `fetchTasks` outside of useEffect so it can be called from other functions too (like after saving a task).
