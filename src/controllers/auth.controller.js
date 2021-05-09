const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// @desc        login an user
// @route       POST /api/v1/auth/register
// @access      public
exports.login = async (req, res) => {
    const { email, pass } = req.body
    try {
        const _user = await User.find({email})
            .select('+pass')

        if (!_user) return res.status(404).json({ok: false, msg: 'user not found'})

        const isMatch = await bcrypt.compare(pass, _user.pass)

        if (!isMatch) return res.status(400).json({ok: false, msg: 'pass not match'})

        const {pass, ...userRest} = _user

        res.status(200).json({ok: true, data: userRest})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        register an user
// @route       POST /api/v1/auth/register
// @access      public
exports.register = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}