import asyncHandler from "express-async-handler";
import Note from "../models/noteModel.js";
import User from "../models/userModel.js";

// Create a note
export const createNote = asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400);
    throw new Error("Title and body are required");
  }

  const note = await Note.create({
    title,
    body,
    user: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { notes: note._id },
  });

  res.status(201).json(note);
});

// Get all notes for user
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

// Update note
export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  note.title = req.body.title || note.title;
  note.body = req.body.body || note.body;
  const updatedNote = await note.save();

  res.json(updatedNote);
});

// Delete note
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this note");
  }

  await note.remove();
  res.json({ message: "Note deleted" });
});
