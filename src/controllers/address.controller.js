const Address = require('../models/address.model')

exports.createAddress = async (req, res) => {
    
    try {
        const address = new Address(req.body)
        
        await address.save()

        return res.status(201).json({ok:true, data: address})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }

}

exports.getAddressByUserLogged = async (req, res)=>{
    
    const {id} = req.user._id

    try {
        
        const address = await (await Address.findOne({user: id}))
        .populate('user')
        
        return res.status(200).json({ok:true, data: address})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }

}

exports.editAddress = async (req,res)=>{

    const {id} = req.params
    const {user, _id, ...address} = req.body

    try {

        const existId = await Address.findOne({_id: id})

        !existId && res.status(404).json({ok:false, msg: `address ${id} not found!`})

        const editedAddress = await Address.findByIdAndUpdate(id, address, {new: true})
        
        return res.status(200).json({ok:true, data: editedAddress})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }
}

exports.deleteAddress = async (req, res)=>{
    const {id} = req.params

    try {
        const existId = await Address.findOne({_id: id})

        !existId && res.status(404).json({ok:false, msg: `address ${id} not found!`})

        const deletedAddress = await Address.findByIdAndDelete(id)
        
        return res.status(200).json({ok:true, data: deletedAddress})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ok:false, msg: error})
    }
}