var scraper = require('../config/scraper');
var Workspace = require('../models/Workspace');
var Post = require('../models/Post')
var User = require('../models/User')
var { getIndex, getDifficulty, getProblemNum } = require('../config/problemDetails');
var getLastPage = require('../config/getLastPage');

module.exports = function(app, passport) {
    // app.get('/problems', function(req, res){
    //     var perPage = 10;
    //     var page = req.params.page || 1;
    //     Workspace.find({})
    //     .skip((perPage * page) - perPage)
    //     .limit(perPage)
    //     .exec(function(err, problems){
    //         Problem.countDocuments().exec(function(err, count){
    //             if(err){
    //                 return next(err);
    //             }
    //             // res.render('problems', {
    //             //     msgA: req.flash('invalidProblem'),
    //             //     msgB: req.flash('alreadyExist'),
    //             //     msgC: req.flash('error'),
    //             //     problems: problems,
    //             //     current: page,
    //             //     pages: Math.ceil(count / perPage)
    //             // });
    //             res.send("Problems page")
    //         });
    //     });
    // });

    // app.get('/problems/page/:page', function(req, res, next){
    //     var perPage = 10;
    //     var page = req.params.page || 1;
    //     Problem.find({})
    //     .skip((perPage * page) - perPage)
    //     .limit(perPage)
    //     .exec(function(err, problems){
    //         Problem.countDocuments().exec(function(err, count){
    //             if(err){
    //                 return next(err);
    //             }
    //             // res.render('problems', {
    //             //     msgA: req.flash('invalidProblem'),
    //             //     msgB: req.flash('alreadyExist'),
    //             //     msgC: req.flash('error'),
    //             //     problems: problems,
    //             //     current: page,
    //             //     pages: Math.ceil(count / perPage)
    //             // });
    //             res.send("Problems page")
    //         });
    //     });
    // });

    app.post('/addproblem',async function(req, res, next){
        if(!req.isAuthenticated()){
            // req.flash('loginfirst', 'You do not have access, please login first!');
            // res.redirect('/login');
            res.json({notLoggedIn: "You don't have access, please login first"})
        }
        const problem = req.body.problem;
        const match = problem.match(/([0-9]+)([A-Z][A-Z0-9]*)$/);
        if(!match){
            // req.flash('invalidProblem', 'Invalid Problem Id');
            // res.redirect('/problems');
            res.json({msg: "Invalid Codeforces problem Id"})
        }

        // if already exist
        Workspace.find({"problem.problemNum": problem}, async function(err, foundWorkspace){
            if(foundWorkspace.length>0){
                // req.flash('alreadyExist', 'Problem already exist, Please add another!');
                // res.redirect('/problems');
                res.json({msg: "Problem already exist, Please add another!"})
            } else {
                try {
        
                const problemData = await scraper('CF', problem);
        
                let workspace = new Workspace({
                    id: '',
                    problem: {
                        title: problemData.title,
                        index: getIndex(problemData.title),
                        problemNum: getProblemNum(problemData.link),
                        difficulty: getDifficulty(),
                        timeLimit: problemData.timeLimit,
                        memoryLimit: problemData.memoryLimit,
                        input: problemData.input,
                        output: problemData.output,
                        statement: problemData.statement,
                        link: problemData.link,
                        submitLink: problemData.submitLink,
                        author: req.user.username,
                        solved: 0
                    },
                    solution: {},
                });

                workspace.id=workspace.problem.problemNum
        
                workspace.save(function(err,result){
                    if (err){
                        res.json({msg: err})
                    }
                    else{
                        console.log('problem saved');
                        res.json({saveMsg: 'Problem saved'})
                    }
                });
        
                // Problem.countDocuments().exec(function(err, count){
                //     if(err){
                //         return next(err);
                //     } else {
                //         if(getLastPage(count)<=1){
                //             res.redirect('/problems');
                //         } else {
                //             var first = "/problems/page/";
                //             var second = getLastPage(count);
                //             second = second.toString();
                //             first+=second;
                //             res.redirect(first);
                //         }
                //     }
                // });
                } catch (err) {
                    // req.flash('error', 'Could not parse the problem, enter a valid problem id!');
                    // res.redirect('/problems');
                    res.json({msg: "Could not parse the problem, enter a valid problem id!"})
                }
            }
        });
        
    });

    app.get('/createcontest', function(req, res){
        res.send("Create contest page")
     });

    app.get('/error', function(req, res, next) {
       res.send("Error: Go back")
    });

    app.post('/getProblemsList',async function(req, res, next){
        Workspace.find({},async function(err, workspace){
            if(err) {
                console.log(err)
                res.json({error: err})
            } else {
                res.json({workspaces: workspace});
            }
        })
    })

    app.post('/postTopic', async function(req, res, next){
        title = req.body.title
        body = req.body.body
        author = req.body.author
        likes = req.body.likes
        dislikes = req.body.dislikes
        tags = req.body.tags
        tags = tags.split(' ')
        const post = new Post({
            title: title,
            body: body,
            author: author,
            likes: likes,
            dislikes: dislikes,
            tags: tags
        })
        post.save(function(err, result){
            if(err){
                res.json({error: 'Some error has occured'})
            } else {
                res.json({msg: 'problem saved'})
            }
        })
    })

    app.get('/allPosts', function(req, res){
        Post.find({}, function(err, posts){
            if(err) {
                res.json({error: 'Some error has occured'})
            } else {
                res.json({posts: posts})
            }
        })
    })

    app.post('/getPostWithId',async function(req, res){
        // console.log(req.body)
        const id = req.body.id
        Post.findById(id, await function(err, foundPost){
            if(err){
                res.json({post: 'Post not found'})
            } else {
                res.json({post: foundPost})
            }
        })
    })

    app.post('/clickedUpvoteButton', async function(req, res, next){
        var userId = req.body.userId
        var postId = req.body.postId
        Post.findOne({id: postId}, (err, post) => {
            if(err){
                console.log(err)
                res.json({error: "Some error has occured"})
            } else{
                var index=''
                var posT=post
                if(index=posT.likes.indexOf(userId)>-1){
                    posT.likes.splice(index, 1)
                    Post.findOneAndUpdate({id: postId}, {likes: posT.likes}, null, function(err, postt){
                        if(err){
                            res.json({error: "Some error has occured"})
                        } else {
                            console.log("Your upvote has been removed")
                            res.json({msg: "Your upvote has been removed"})
                        }
                    })
                }else{
                    posT.likes.push(userId)
                    console.log("You upvoted the post")
                    res.json({msg: "You upvoted the post"})
                }
            }
        })
    })

    app.post('/isBookmarkedByThisUser',async function(req, res){
        var userId = req.body.userId
        var workspaceId = req.body.workspaceId
        console.log(workspaceId, "hii")
        await User.findById(userId, (err, user) => {
            if(user){
                if(user.bookmarks.indexOf(workspaceId)>-1){
                    res.json({bookmarked: "Already bookmarked by the user"})
                } else {
                    res.json({notBookmarked: "Not bookmarked"})
                }
            } else {
                res.json({error: err})
            }
        })
    })

    app.post('/removeBookmark', async function(req, res){
        var userId = await req.body.userId
        var workspaceId = await req.body.workspaceId
        await User.findByIdAndUpdate(userId, {$pull: {bookmarks: workspaceId}}, (err, success) => {
            if(err){
                console.log(err)
            }else{
                res.json({msg: "Problem successfully removed from bookmarks"})
                console.log(success)
            }
        })
    })

    app.post('/addBookmark', async function(req, res){
        var userId = await req.body.userId
        var workspaceId = await req.body.workspaceId
        // console.log(userId, workspaceId)
        await User.findByIdAndUpdate(userId, {$addToSet: {bookmarks: workspaceId}}, (err, success) => {
            if(err){
                console.log(err)
            }else{
                console.log(success)
                res.json({msg: "Problem successfully added to bookmarks"})
            }
        })
    })

    app.post('/getWorkspaceWithId', (req, res) => {
        var id = req.body.id
        // console.log(id)
        Workspace.findOne({id: id}, (err, foundWorkspace) => {
            if(foundWorkspace){
                res.json({workspace: foundWorkspace})
            } else {
                res.json({error: "An error has occured"})
            }
        })
    })

    app.post('/getUserWithUsername', function(req, res){
        var username = req.body.username
        User.findOne({username: username}, (err, foundUser) => {
            if(err){
                console.log(err)
            }else{
                res.json({user: foundUser})
            }
        })
    })

    // app.use((req, res, next) => {
    //     res.send('Page not found')
    //   });
}