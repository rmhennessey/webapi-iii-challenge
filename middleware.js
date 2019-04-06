function bigBoyLetters(req, res, next) {
    let name = req.body.name;

    if (name) {
       req.body.name = name.toUpperCase();
        next();
    } else {
        res.status(400).json({ message: "Go Fish" });
    }
}

module.exports = bigBoyLetters;