const User = require('../models/user')

const asyncHandler = require('express-async-handler')

const{generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')

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
// RefreshToken => lam moi access Token
// Access Token => Xac thuc nguoi dung, quan ly nguoi dung
const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password)
    return res.status(400).json({
        sucess: false,
        mes: 'Missing inputs'
    })

    const response = await User.findOne({email})
    if (response && await response.isCorrectPassword(password)) {
        // Tach password va role ra khoi response
        const { password, role, ...userData } = response.toObject()
        // Tao accessToken
        const accessToken = generateAccessToken(response._id, role)
        // Tao refresg Token
        const refreshToken = generateRefreshToken(response._id)
        // Luu refreshToken vao database
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new: true})
        // Luu refresg Token vao cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000})
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    }else {
        throw new Error('Invalid Credentials!')
    }
})

const getCurrent = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs: user ? user: 'User not found'
    })
})

module.exports = {
    register,
    login,
    getCurrent
}