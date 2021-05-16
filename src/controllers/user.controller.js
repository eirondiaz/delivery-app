const User = require("../models/user.model")

// @desc        get all users
// @route       GET /api/v1/users/
// @access      public
exports.getAllUsers = async (req, res)=> {
    try {
        const users = await User.find({status: true})
        
        res.status(200).json({ok: true, data: users},{new: true})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

// @desc        get an user by id
// @route       GET /api/v1/users/:id
// @access      public
exports.getUserById = async(req, res)=>{
    const {id} = req.params

    try {

        const user = await User.findOne({$and: [{_id: id}, {status: true}]})

        res.status(200).json({ok: true, data: user})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// @desc        get user logged
// @route       GET /api/v1/users/current-user
// @access      private ADMIN, USER
exports.getCurrentUser = async (req, res)=>{
    try {
        return res.status(200).json({ok: true, data: req.user})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        edit an user by id
// @route       PUT /api/v1/users/:id
// @access      private ADMIN, USER
exports.editUser = async (req, res)=>{
    const {id}= req.params

    const {pass, email, _id, user,...userRest } = req.body

    try {
        
        const _user = await User.findOne({_id: id})

        if (!_user) return res.status(404).json({ok:false, msg:'User Not Found!'})

        const editedUser = await User.findByIdAndUpdate(id, userRest, {new: true})

        res.status(200).json({ok: true, data: editedUser})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// @desc        delete an user by id
// @route       PUT /api/v1/users/:id
// @access      private ADMIN, USER
exports.deleteUser = async (req, res)=>{
    const {id}= req.params

    try {
        
        const _user = await User.findOne({_id: id})

        if (!_user) return res.status(404).json({ok:false, msg:'User Not Found!'})

        const deletedUser = await User.findByIdAndUpdate(id, {status:false}, {new: true})

        res.status(200).json({ok: true, data: deletedUser})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}