const User = require('../models/user')

const asyncHandler = require('express-async-handler')

const{generateAccessToken} = require('../middlewares/jwt')

// Đăng kí
const register = asyncHandler(async(req, res) => {
    const {email, password, firstname, lastname} = req.body
    if(!email || !password || !lastname || !firstname)
    return res.status(400).json({
        sucess: false,
        mes: 'Missing inputs'
    })

    const user = await User.findOne({email})
    if(user){
        throw new Error('User was existed!')
    }else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successful. Please go logic' : 'Something went wrong'
        })
    }


    const response = await User.create(req.body)
    return res.status(200).json({
        sucess: response ? true : false,
        response
    })
})

// Đăng nhập 
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password)
    return res.status(400).json({
        sucess: false,
        mes: 'Missing inputs'
    })

    const response = await User.findOne({email})
    if (response && await response.isCorrectPassword(password)) {
        
        const { password, role, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    }else {
        throw new Error('Invalid Credentials!')
    }
})

module.exports = {
    register,
    login
}