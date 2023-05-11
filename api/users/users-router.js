const express = require('express');
const { validateUserId,
validateUser, 
validatePost} = require('../middleware/middleware')

const User = require('./users-model')
const Post = require('../posts/posts-model')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
  .then(user => {
    res.json(user)
  })
  .catch(next)
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({name: req.name})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
  
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, {name: req.name})
  .then(updateUser => {
    res.status(201).json(updateUser)
  })
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try{
    await User.remove(req.params.id)
    res.json(req.user)

  }catch(err){
    next(err)
  }
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
 try{
  const result = await User.getUserPosts(req.params.id)
  res.json(result)

 }catch(err){
  next(err)
 }
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
 
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  try{
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.body.text,
    })
    res.status(201).json(result)

  }catch(err){
    next(err)
  }
  // RETURN THE NEWLY CREATED USER POST
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage:'someting wrong',
    err: err.message
  })
})

// do not forget to export the router


module.exports = router