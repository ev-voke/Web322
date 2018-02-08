const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema ({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});

let Comment; // to be defined on new connection (see initialize)

module.exports = {
    initialize: () => {
        return new Promise(function (resolve, reject) {
            let db = mongoose.createConnection("mongodb://databaseuser:dbpassword@ds######.mlab.com:#####/dbname");
            db.on('error', (err) => {
                reject(err); // reject the promise with the provided error
            });
            db.once('open', () => {
                Comment = db.model("comments", commentSchema);
                resolve();
            });
        });
    },
    addComment: (data) => {
        return new Promise(function (resolve, reject) {
            data.postedDate = Date.now();
            let newComment = new Comment(data);
            newComment.save((err) => {
                if(err) {
                    reject("There was an error saving the comment:" + err);
                } else {
                    resolve(newComment._id);
                }
            });
        });
    },
    getAllComments: () => {
        return new Promise(function (resolve, reject) {
            Comment.find()
            .sort({postedDate: 1})
            .exec()
            .then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    addReply: (data) => {
        return new Promise(function (resolve, reject) {
            data.repliedDate = Date.now();
            Comment.update({ _id: data.comment_id},
            { $addToSet: { replies: data } },
            { multi: false })
            .exec()
            .then((data) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
