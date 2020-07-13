const Image = require('../models/image');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {
    // CREATE Comment
    app.get("/", (req, res) => {
        var currentUser = req.user;
        console.log(currentUser)
        Image.find().lean().then(images => {
            console.log(images)
            res.render("main-view", {images, currentUser})
        }).catch(err => {
      console.log(err.message);
    });

    });

    app.post("/images/upload", (req, res) => {
        var image = new Image(req.body);
        image.author = req.user._id
        image.save().then((image) => {
            return User.findById(req.user._id)
        }).then(user => {
            user.images.unshift(image);
            user.save()
            res.redirect("/")
        })
    });

    app.get("/images/upload", (req, res) => {
        var currentUser = req.user
        res.render('upload-image', {currentUser})
    });


    app.get("/images/:imid", (req, res) => {
        var currentUser = req.user;
        Image.findById(req.params.imid).populate('comments').lean().then(image => {
            res.render("image-view", {image, currentUser})
        });

    });

    app.get("/user/:uid", (req, res) => {
        currentUser = req.user;
        User.findById(req.params.uid).populate("images").lean().then(user =>{
            res.render("user-view", {user, currentUser})
        })
    })

    app.post("/images/comment/:imid", (req, res) => {
        comment = new Comment(req.body)
        comment.author = req.user._id
        comment.save().then(comment => {
            return Image.findById(req.params.imid)
        }).then(image => {
            image.comments.unshift(comment);
            image.save();
            res.redirect(`/images/${req.params.imid}`)
        })
    })

};
