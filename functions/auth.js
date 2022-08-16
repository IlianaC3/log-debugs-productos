function publicAuthorization(req, res, next) {
    // console.log(req)
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = {publicAuthorization}