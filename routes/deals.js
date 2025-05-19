const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Get all deals
router.get('/', async (req, res) => {
    try {
        const deals = await Deal.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(deals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get deals by customer ID
router.get('/customer/:customerId', async (req, res) => {
    try {
        const deals = await Deal.find({ customer: req.params.customerId })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        res.json(deals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get deal by ID
router.get('/:id', async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).populate('customer', 'name email');
        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.json(deal);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Create a deal
router.post('/', async (req, res) => {
    try {
        const newDeal = new Deal(req.body);
        const deal = await newDeal.save();
        const populatedDeal = await Deal.findById(deal._id).populate('customer', 'name email');
        res.json(populatedDeal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a deal
router.put('/:id', async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('customer', 'name email');

        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.json(deal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.json({ msg: 'Deal removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deal not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 