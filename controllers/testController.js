const express = require('express')

exports.getTest = (req, res) => {
    console.log('testController.get(/)')

    res.status(200).json({
        status: 'success'
    })
}