const { handleGetAllUsers, handleDeleteUser, handleUpdateUser } = require('../controller/user.controller')

const router = require('express').Router()


// GET ALL USER ROUTE
router.get('/', handleGetAllUsers)

// DELETE USER ROUTE
router.delete('/:id', handleDeleteUser)

// UPDATE USER ROUTE
router.patch('/:id', handleUpdateUser)


module.exports = router
