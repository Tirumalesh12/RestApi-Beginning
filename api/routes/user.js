const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var User = require("../models/user");

router.post("/signup", (req, res, next) =>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length > 0){
            return res.status(409).json({
                message: "email already exists"
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        return res.status(201).json({
                            message: "user created successfully",
                            body: {
                                id: result._id,
                                email: result.email
                            }
                        })
                    })
                    .catch(error => {
                        return res.status(500).json({
                            error: error
                        })
                    })
                }
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            errorMsg: error
        })
    })
    
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1 ){
            return res.status(401).json({
                message : "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, resp) => {
            if(err){
                return res.status(401).json({
                    message : "Auth failed"
                });
            }
            if(resp){
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        id: user[0].id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message : "Auth successful",
                    token : token
                });
            }
            return res.status(401).json({
                message : "Auth failed"
            });
        }) 
    })
    .catch(error => {
        res.status(500).json({
            errorMsg: error
        })
    })
});

router.delete('/:userId', (req, res, next) => {
    User.remove( {_id: req.params.userId})
    .exec()
    .then(result => {
        return res.status(200).json({
            message : "user deleted"
        })
    })
    .catch(err => {
        return res.status(400).json({
            message : "user not found"
        })
    })
});

module.exports = router;