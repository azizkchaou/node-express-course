const notFound = (req , res ) => {
    res.status(404);
    res.send('<h1>resource not found</h1>');
    res.end();
}

module.exports = notFound;