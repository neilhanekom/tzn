'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function(req, res) {
	// var article = new Article(req.body);
	console.log(req.body);
	console.log(req.files);

	// article.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.json(article);
	// 	}
	// });

	var user = req.user;
	var message = null;

	if (user) {
		fs.writeFile('./modules/articles/client/img/uploads/' + req.files.articleForm.name, req.files.articleForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for article'
				});
			} else {
				// var imagePath = 'modules/articles/img/uploads/' + req.files.articlesForm.name;

				var article = new Article(req.body);
				// Adding and Correcting some Stringified Fields
				article.user = req.user;
				article.imageUrl = 'modules/articles/img/uploads/' + req.files.articleForm.name;
				// article.articleDate = articleDate;
				
				article.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(article);
					}
				});

				
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.updateFile = function(req, res) {
	var article = req.article;
	var user = req.user;
	var message = null;
	var oldFile = article.imageUrl;
	console.log(article);

	if (user) {
		fs.writeFile('./modules/articles/client/img/uploads/' + req.files.articleForm.name, req.files.articleForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for article'
				});
			} else {
				// var imagePath = 'modules/articles/img/uploads/' + req.files.articlesForm.name;

				article = _.extend(article , req.body);
				// Adding and Correcting some Stringified Fields
				article.user = req.user;
				article.imageUrl = 'modules/articles/img/uploads/' + req.files.articleForm.name;
				// article.articleDate = articleDate;

				
				
				article.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(article);
						var filename = oldFile.split('/').pop();
						var checkedFile = fs.readFileSync('./modules/articles/client/img/uploads/' + filename);
						if (checkedFile) { 
							fs.unlink( './modules/articles/client/img/uploads/' + filename, function (err) {
						  if (err) throw err;
							}); 
						} else {
							return;
						}
					}
				});

				
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};


exports.update = function(req, res) {
	var article = req.article;

		article = _.extend(article , req.body);

		article.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(article);
			}
		});
};


/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};
