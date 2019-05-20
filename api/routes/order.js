const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message : "Handling GET requests to /orders "
    }); 
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message : "Order Created"
    }); 
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message : "order feteched ",
        id: id
    }); 
    
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message : "Deleted order ",
        id: id
    }); 
});


module.exports = router;