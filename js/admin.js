var Lessons = Backbone.Collection.extend({
	url: 'http://localhost:3000/lessons',
})

// list all lessons view 
var LessonList = Backbone.View.extend({
	el: '.page',
	render: function () {
		var _this = this
		var lessons = new Lessons()
		lessons.fetch().done(function (lessonData) {
			var tmplString = $('#view-lessons-template').html()
			var tmpl = Handlebars.compile(tmplString)
			_this.$el.html(tmpl(lessonData))
		})
	}

	// events: {
	// 	'click .delete': 'deleteLesson'
	// },

	// deleteLesson: function (ev) {
	// 	this.lesson.destroy().done(function () {
	// 		console.log('destruyed')
	// 		router.navigate('', { trigger: true })
	// 	})
	// }
})

// add lesson view
var AddLesson = Backbone.View.extend({
	el: '.page',
	editMode: false,

	render: function (lessonId) {
		var _this = this
		console.log('add mode!')
		var tmplString = $('#add-lesson-template').html()
		var tmpl = Handlebars.compile(tmplString)
		this.$el.html(tmpl)   	
	},

	events: {
		'submit .add-lesson-form': 'submitForm'
	},

	submitForm: function () {
			// add new lesson 
			var topicId = $('#topic-name').val()
			var lessonName = $('#lesson-name').val()

			$.post('http://localhost:3000/lessons', {
		    	topicId: topicId,
		    	name: lessonName
		  	}).done(function (lessonData) {
		  		
		  		$.post('http://localhost:3000/videos', { 
					lessonId: lessonData.id, 
					videoSrc: $('#video-link').val()
				})
		  		
		  		$.post('http://localhost:3000/questions', {
		  			lessonId: lessonData.id,
		  			question: $('#question-name').val(),
		  			answerA: $('#question-answer-a').val(),
		  			answerB: $('#question-answer-b').val(),
		  			answerC: $('#question-answer-c').val(),
		  			answerD: $('#question-answer-d').val(),
		  			correctAnswer: $('#question-answer-correct').val()
		  		}).done(function () {
		  			router.navigate('', { trigger: true })
		  		})
			}) // end .done fn
		return false
	}  // end submitForm fn
}) // end addLesson view

// edit lesson view
var EditLesson = Backbone.View.extend({
	el: '.page',

	render: function (lessonId) {
		var _this = this
		// render template with lesson data in it 
		$.get('http://localhost:3000/lessons/' + lessonId).done(function (lesson) {
			var tmplString = $('#edit-lesson-name-template').html()
			var tmpl = Handlebars.compile(tmplString)
			_this.$el.html(tmpl(lesson))
		})
	},

	events: {
		'submit .edit-lesson-name-form': 'submitForm'
	},

	submitForm: function () {
	    var lessonId = $('#lessonId').val()
	    console.log(lessonId)
		$.ajax({
			url: 'http://localhost:3000/lessons/' + lessonId, 
			type: 'PUT',
			data: {
				name: $('#lesson-name').val()
			}	
		}).done(function () {
			router.navigate('', { trigger: true });
		}) 
		return false
	}
})	


// edit video src
var EditVideo = Backbone.View.extend({
	el: '.page',

	render: function (lessonId) {
		var _this = this
		// render template with video data in it 
		$.get('http://localhost:3000/lessons/' + lessonId + '/videos').done(function (videos) {
			var tmplString = $('#edit-video-template').html()
			var tmpl = Handlebars.compile(tmplString)
			_this.$el.html(tmpl(videos[0]))
		})
	},

	events: {
		'submit .edit-video-form': 'submitForm'
	},

	submitForm: function () {
	    var id = $('#videoId').val()
		$.ajax({
			url: 'http://localhost:3000/videos/' + id , 
			type: 'PUT',
			data: {
				videoSrc: $('#video-link').val()
			}	
		}).done(function () {
			router.navigate('', { trigger: true });
		}) 
		return false
	}
})	

// edit question view
var EditQuestion = Backbone.View.extend({
	el: '.page',

	render: function (lessonId) {
		var _this = this
		// render template with question data in it 
		$.get('http://localhost:3000/lessons/' + lessonId + '/questions').done(function (question) {
			console.log(question)
			var tmplString = $('#edit-question-template').html()
			var tmpl = Handlebars.compile(tmplString)
			_this.$el.html(tmpl(question[0]))
		})
	},

	events: {
		'submit .edit-question-form': 'submitForm'
	},

	submitForm: function () {
		var id = $('#questionId').val()
		console.log(id)
		$.ajax({
			url: 'http://localhost:3000/questions/' + id,
			type: 'PUT',
			data: {
				question: $('#lesson-name').val(),
				answerA: $('#question-answer-a').val(),
				answerB: $('#question-answer-b').val(),
				answerC: $('#question-answer-c').val(),
				answerD: $('#question-answer-d').val(),
				correctAnswer: $('#question-answer-correct').val()
			}	
		}).done(function () {
			router.navigate('', { trigger: true });
		}) 
		return false
	}
})	


// route definitions
var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'new': 'addLesson',
		'editLesson/:id': 'editLesson',
		'editVideo/:id': 'editVideo',
		'editQuestion/:id': 'editQuestion',
		'lesson/:id/delete': 'deleteLesson'
	}
})

// new instances of views
var lessonList = new LessonList()
var addLesson = new AddLesson()
var editLesson = new EditLesson()
var editVideo = new EditVideo()
var editQuestion = new EditQuestion()

// route handlers
var router = new Router()
router.on('route:home', function () {
	lessonList.render()
})
router.on('route:addLesson', function () {
	addLesson.render()
})
router.on('route:editLesson', function (id) {
	editLesson.render(id)
})
router.on('route:editVideo', function (id) {
	editVideo.render(id)
})
router.on('route:editQuestion', function (id) {
	editQuestion.render(id)
})
router.on('route:deleteLesson', function (id) {
	$.ajax({
		url: 'http://localhost:3000/lessons/' + id , 
		type: 'DELETE'
	}).done(function () {
		router.navigate('', { trigger: true });
	}) 

})


Backbone.history.start()

// $(function() {

	
	// function postVideo(id) {
	// 	var videoLink = $('#video-link').val()
	// 	console.log(videoLink, id)
	// 	$.post('http://localhost:3000/videos', {
	// 		// id passed in 
	// 		lessonId: id,
	// 		// val of video link field 
	// 		videoSrc: $('#video-link').val()
	// 	})
	// }


// })


		  		// .done(function () {
		  		// 	router.navigate('', { trigger: true })
		  		// })