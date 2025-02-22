const express = require('express');
const router = express.Router();
const Tutor = require('../models/tutors');

// @route   GET /api/tutors
// @desc    Get all tutors
router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tutors
// @desc    Add a new tutor
router.post('/', async (req, res) => {
  const { id, name, email, concentration, subject, rating, imageURL, bio, reviews } = req.body;

  const newTutor = new Tutor({
    id,
    name,
    email,
    subject,
    concentration,
    rating,
    imageURL,
    bio,
    reviews,
  });

  try {
    const savedTutor = await newTutor.save();
    res.json(savedTutor);
  } catch (error) {   
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/tutors/:id
// @desc    Get a specific tutor by ID
router.get('/', async (req, res) => {
  const { subject, concentration } = req.query;

  try {
    let query = {};

    if (subject) {
      query.subject = subject;
    }

    if (concentration) {
      query.concentration = concentration;
    }

    // Debugging: Log the query being sent to the database
    console.log("Query:", query);

    const tutors = await Tutor.find(query);
    res.json(tutors);
  } catch (error) {
    // Log the full error to the console for debugging
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// @route   DELETE /api/tutors/:id
// @desc    Delete a tutor
router.delete('/:id', async (req, res) => {
  try {
    await Tutor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tutor deleted' });
  } catch (error) {
    res.status(404).json({ message: 'Tutor not found' });
  }
});

router.post('/:id/reviews', async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const newReview = {
      userId: req.user._id,  // Assuming user is added to request object in middleware
      rating,
      comment,
    };

    tutor.reviews.push(newReview);
    await tutor.save();
    res.status(201).json({ message: 'Review added successfully', tutor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

