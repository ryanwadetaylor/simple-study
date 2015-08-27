// handlebars compile fn for Challenge Question
function renderQues(id, question, answerA, answerB, answerC, answerD, lessonId) {
	var tmpl = $('#question-template').html()
	var quesTmpl = Handlebars.compile(tmpl)
	var data = {
		id: id,
		question: question,
		answerA: answerA,
		answerB: answerB,
		answerC: answerC,
		answerD: answerD,
		lessonId: lessonId
	}
	return quesTmpl(data)
}

// collect users correct and incorrect answer attempts
function postQuestionAnswer(userId, questionId, correct, lessonId) {
	// post to userAnswers
	$.post('http://localhost:3000/userAnswers', {
		userId: userId,
		questionId: questionId,
		correct: correct,
		lessonId: lessonId
	})
}

// load video and question
$('.module-lessons-nav').on('click', '.lesson', function(e) {
	e.preventDefault();
	// stylize nav bar
	$('.lesson').removeClass('active')
	$(this).closest('.lesson').addClass('active')
	// load video
	var lessonId = $(this).data('id') 
	$.get('http://localhost:3000/lessons/' + lessonId + '/videos').done(function (videos) {
		$('.study-content').html(videos[0].videoSrc)
	})
	// load question
	$.get('http://localhost:3000/lessons/' + lessonId + '/questions').done(function (questions) {
		var ques = questions[0]
		$('.challenge').html(renderQues(ques.id, ques.question, ques.answerA, ques.answerB, ques.answerC, ques.answerD, lessonId))
	}).done (function () {
		$('.feedback').html('')
	})	
})

// Check answer to challenge question
$('.challenge').on('click', 'button', function(e) {
	e.preventDefault()
	var ans = $('input[name=dq1]:checked').val()
	var questionId = $('.question-container').data('id')
	var lessonId = $('.question-container #lessonId').val()
	$.get('http://localhost:3000/questions/' + questionId).done(function (question) {	
		if (ans == question.correctAnswer) {
			$('.feedback').html('Right on!')
			postQuestionAnswer(1, questionId, true, lessonId)
			// add checkmark for correct answer
			var idSelector = $('[data-id=' + lessonId + ']')
			idSelector.find('i.fa').removeClass('fa-play-circle-o').addClass('fa-check')
			$('.lesson.active').removeClass('active')
		} else {
			$('.feedback').html('Sorry, try again')
			postQuestionAnswer(1, questionId, false, lessonId)
			// remove feedback text
			setTimeout(function() {
				$('.feedback').html('');
			}, 3000);
		}
		
	}).done(function (){
		// set points value
		$.get('http://localhost:3000/userAnswers?correct=true').done(function (correctAnswers) {
			$('.points').html(correctAnswers.length)
		})
	})

});


var Router = Backbone.Router.extend({
	// Route definition
	routes: {
		':topicId': 'showTopic',
		'#1': 'metaphys',
		'#2': 'epistem',
		'#3': 'anthro',
		'#4': 'relig',
		'#5': 'ethics'
	},

  	// Route handlers
  	metaphys: function () {
  		router.navigate('/#1', { trigger: true })
  	},
  	epistem: function () {
  		router.navigate('/#2', { trigger: true })
  	},
  	anthro: function () {
  		router.navigate('/#3', { trigger: true })
  	},
  	relig: function () {
  		router.navigate('/#4', { trigger: true })
  	},
  	ethics: function () {
  		router.navigate('/#5', { trigger: true })
  	},	

  	showTopic: function(topicId) {
	  	// set topic name on page load
	  	$.get('http://localhost:3000/topics/' + topicId).done(function(topic) {
	  		$('.module-lessons-nav .title').html(topic.name);
	  	}).done(function (){
		// set points value
		$.get('http://localhost:3000/userAnswers?correct=true').done(function (correctAnswers) {
			$('.points').html(correctAnswers.length)
		})
		})

	  	// Get lessons list for the topic on page load
	  	$.get('http://localhost:3000/topics/' + topicId + '/lessons').done(function (lessons) {
	  		var tmpl = $('#lessons-template').html()
	  		var template = Handlebars.compile(tmpl);
	  		$('.module-lessons-nav .lesson-list').html(template(lessons))
	  		// set active lesson class
	  		$( ".module-lessons-nav .lesson:first-child" ).trigger( "click" ); 
	  	}).done(function (lessons) {
  			// check if lesson question has been answered correctly and add styling
	  		lessons.forEach(function(lesson) {
	  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
					var idSelector = $('[data-id=' + lesson.id + ']')
					if (correctAnswers.length) {
						idSelector.addClass('completed')
						// add checkmark if correct
						idSelector.find('i.fa').removeClass('fa-play-circle-o').addClass('fa-check')
					}
				})
	  		})
	  	})
  	}
})

var router = new Router

Backbone.history.start()
