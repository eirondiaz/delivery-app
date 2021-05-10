const History = require('../models/history.model')


exports.getAllHistory = async (req,res)=>{

    try {
        
        const history = await History.find()
        .populate('user')
        .populate('order')
        
        return res.status(200).json({ok:true, data: history})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }
}

exports.getHistoryById = async (req,res)=>{

    const {id}=req.params

    try {
        
        const history = await History.findById(id)
        .populate('user')
        .populate('order')

        return res.status(200).json({ok:true, data: history})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }
}

exports.getHistoryByUserLogged = async (req,res)=>{
    
    try {
        const userLogged = req.user._id
        
        const history = await History.find({user: userLogged})
        .populate('user')
        .populate('order')

        return res.status(200).json({ok:true, data: history})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }
}