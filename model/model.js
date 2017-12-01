var admin = require("firebase-admin");
var MicroGear = require('microgear')
var firebase = require('firebase')
var CustomError = require('../utils/error')

firebase.initializeApp({
  apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

var database = firebase.database();

module.exports = {
	getAllReview: async function() {
		return await new Promise((resolve, reject) => {
			database.ref('post').once('value')
			.then((s) => {
				const data = []
				s.forEach((cs) => {
					const reviewKey = cs.key
					const reviewDetail = s.child(reviewKey).val()
					const review = Object.assign(reviewDetail, { id: reviewKey })
					data.push(review)
				})
				resolve(data)
			})
			.catch((err) => reject(err))
		})
	},
	getReviewById: async function(reviewId) {
		try {
			const review = await database.ref('post').once('value')
			return Object.assign(review.child(reviewId).val(), { id: reviewId })
		}catch(err) {
			throw CustomError(404, 'not found')
		}
	},
	subscribe: async function(subscriber, follower) {
			try {
				await validateSubscribe(subscriber, follower)
				await checkSubscribe(subscriber, follower)
				database.ref('subscribe').push({
					'subscriber': subscriber,
					'follower': follower
				})
			} catch(err) {
				throw err
			}
	},
	postReview: async (review) => {
		return await new Promise((resolve, reject) => {
			const data = {
				reviewer: {
					id: review.uId
				},
				book: {
					name: review.bookName,
					image: "url"
				},
				review:	{
					title: review.reviewTitle,
					content: review.reviewContent,
					rating: 0,
					like: 0,
				},
				comment:[]
			}
			database.ref('post').push(data)
			getMessage(review.uId)
				.then((message)=> {
					microgear.connect('noti')
					microgear.on('connected', () => {
						microgear.publish('/message', JSON.stringify(message))
						microgear.disconnect()
					})
					resolve('success')
				})
		})
	},
	comment: async function(review) {
		try {
			await validateComment(review)
			database.ref('post').child(`/${review.reviewId}/comment`).push({
				uId: review.uId,
				reviewContent: review.reviewContent,
				reviewId: review.reviewId
			})
		} catch(err) {
			throw err
		}
	}
}

function isBlank(str) {
	return (!str || 0 === str.length || /^\s*$/.test(str));
}

function validateComment(review) {
	return new Promise((resolve, reject) => {
		if(isBlank(review.uId) || isBlank(review.reviewContent) || isBlank(review.reviewId)) {
			reject(CustomError(400, 'data is empty'))
		}
		resolve()
	})
}

function validateSubscribe(subscriber, follower) {
	return new Promise((resolve, reject) => {
		if(isBlank(subscriber) || isBlank(follower)){
			reject(CustomError(400, 'subscribe or follow empty'))
		}
		resolve()
	})
}

async function checkSubscribe(subscriber, follower) {
	const s = await database.ref('subscribe').once('value')
	return await new Promise((resolve, reject) => {
		s.forEach(cs => {
			if(cs.val().subscriber == subscriber && cs.val().follower == follower) {
				reject(CustomError(400, 'already subscribe'))
			}
		})
		resolve()
	})
}

async function getMessage(reviewerId) {
	var allFollower = []
	const s = await database.ref('subscribe').once('value')
	s.forEach(cs => {
		if(cs.val().subscriber == reviewerId){
			allFollower.push(cs.val().follower)
		}
	})
	return allFollower
}