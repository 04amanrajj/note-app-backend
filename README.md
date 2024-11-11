# Note App Backend

A RESTful backend server for a note-taking application, built with Node.js, Express, and MongoDB. This backend allows for user authentication, note creation, and retrieval with JWT-based authorization.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)

## Features
- User authentication (registration and login) using JWT
- Secure password hashing with bcrypt
- CRUD operations for user notes
- Middleware-based request validation and authorization
- Configurable CORS settings

## Getting Started
Ensure you have the following prerequisites:
- **Node.js**: >=14.0.0
- **MongoDB**: Local instance or MongoDB Atlas for cloud hosting

## Environment Variables
Create a `.env` file in the root directory with the following:
PORT=3400 
MONGODB_URL= Your MongoDB URL


## Installation
Clone the repository:
git clone https://github.com/04amanrajj/note-app-backend.git cd note-app-backend

## Install dependencies:
npm install

## Running the Server
To start the server, run:
npm run server

The server will start on the specified port (default: 3400).

## API Endpoints
### User Authentication
- `POST /user/register`: Register a new user
- `POST /user/login`: Log in an existing user and receive a JWT token

### Notes
- `GET /note`: Retrieve all notes (Requires authentication)
- `POST /note`: Create a new note (Requires authentication)
- `PUT /note/<id>`: Update a note by ID (Requires authentication)
- `DELETE /note/<id>`: Delete a note by ID (Requires authentication)

## Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT implementation for secure authentication
- **bcrypt**: Password hashing for security
- **dotenv**: Manage environment variables
- **cors**: Enable Cross-Origin Resource Sharing
