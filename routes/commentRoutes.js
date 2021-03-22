const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    commentController.setVehicleIds,
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.restrictTo('user', 'admin'),
    commentController.updateComment
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    commentController.deleteComment
  );
  
module.exports = router;