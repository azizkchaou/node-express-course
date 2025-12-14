const authorize = (req , res , next) => {
    const {user} = req.query // assuming user info is attached to req object
    if (user === 'aziz') {
        req.user = {name: 'aziz' , id: 3};
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = authorize;