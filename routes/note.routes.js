const express = require("express");
const { Router } = require("express");
const {
  allNotes,
  addNote,
  deleteNote,
  updateNote,
} = require("../controller/note.controller");

const noteRoute = Router();

noteRoute.use(express.json());

noteRoute.get("/", allNotes);

noteRoute.post("/", addNote);

noteRoute.patch("/:id", updateNote);

noteRoute.delete("/:id", deleteNote);

module.exports = { noteRoute };
