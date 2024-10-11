# E-commerce website for all that matter foods

## Description

This is completely Dockerized MERN stack app with docker compose running Node & Express backend service, React frontend, mongo DB and Redis. Zustand is used to manage state.

## Features

1. Local Authentication with JWT.
2. Google Oauth.
3. Image upload.
4. Redis Catching for query optimization.
5. Zustand State Mangement.

### .env variables

```.env
PORT=8000
API_VERSION= /api/v1
REDIS_URL=redis://[username]:[password]@localhost:6379
MONGO_URI=mongodb://localhost:2717/[dbname]
JWT_ACCESS_KEY=
JWT_REFRESH_KEY=
SESSION_KEY=
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=
SMTP_PASSWORD= 
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### To run

```zsh
cd project
docker compose up -d
docker ps
```

### End points

Frontend: [http://localost:5173]

Backend: [http://localhost:8000/api/v1]
