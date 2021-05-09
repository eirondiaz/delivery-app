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

        !_user && res.status(404).json({ok: false, msg: 'user not found'})

        !_user.status && res.status(400).json({ok: false, msg: 'user unavailable'})

        const isMatch = await bcrypt.compare(pass, _user.pass)

        !isMatch && res.status(400).json({ok: false, msg: 'pass not match'})

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
    const { user, name, lastName, email, pass, phone } = req.body
    try {
        if (role.toUpperCase() === 'ADMIN_ROLE')
            return res.status(400).json({ok: false, msg: 'role admin cant be created'})

        let _user = await User.findOne({email})

        if (_user) return res.status(400).json({ok: false, msg: 'email repeated'})

        let hashed_pass = await bcrypt.hash(pass, 10)

        _user = new User({
            user,
            name,
            lastName, 
            email,
            phone,
            pass: hashed_pass
        })

        await _user.save()

        const token = await jwt.sign({_id: _user._id, role: _user.role}, process.env.JWT_SECRET || 'secretKey')
        return res.status(201).json({ok: true, data: _user, token})

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}