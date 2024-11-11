const { NoteModel } = require("../models/note.model");

exports.allNotes = async (req, res) => {
  try {
    const notes = await NoteModel.find({ userID: req.userID });
    res.status(200).send({ message: notes });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({message:error.message});
  }
};

exports.addNote = async (req, res) => {
  try {
    const userID = req.userID;
    const payLoad = req.body;
    payLoad.userID = userID;
    const newNote = new NoteModel(payLoad);
    await newNote.save();
    res.status(200).send({ message: "Note created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({message:error.message});
  }
};

exports.updateNote = async (req, res) => {
  try {
    const _id = req.params.id;
    const payLoad = req.body;

    //check for notes
    const note = await NoteModel.findOne({ _id });
    if (!note) return res.status(404).send({ message: "note not found" });

    // check authorized
    if (note.userID !== req.userID) {
      return res.status(403).send({ message: "You are not authorized" });
    }
    // Check if payload is empty
    if (Object.keys(payLoad).length === 0)
      return res.status(400).send({ message: "Write something to update" });
    await NoteModel.findOneAndUpdate({ _id }, payLoad);
    res.status(200).send({ message: "Note updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
  const _id = req.params.id;
  //check for notes
  const note = await NoteModel.findOne({ _id });
  if (!note) return res.status(404).send({ message: "note not found" });
  // check authorized
  if (note.userID !== req.userID) {
    return res.status(403).send({ message: "You are not authorized" });
  }
    await NoteModel.findOneAndDelete({ _id });
    res.status(200).send({ message: "Note deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
