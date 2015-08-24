//handlebars compile fn for Challenge Question
function renderQues(id, question, answerA, answerB, answerC, answerD) {
	var tmpl = $('#question-template').html()
	var quesTmpl = Handlebars.compile(tmpl)
	var data = {
		id: id,
		question: question,
		answerA: answerA,
		answerB: answerB,
		answerC: answerC,
		answerD: answerD
	}
	return quesTmpl(data)
}

// collect users correct and incorrect answer attempts
function postQuestionAnswer(userId, questionId, correct) {
	// post to userAnswers
	$.post('http://localhost:3000/userAnswers', {
		userId: userId,
		questionId: questionId,
		correct: correct
	})
}

// load video and question
$('.module-lessons-nav').on('click', '.lesson', function(e) {
	e.preventDefault();
	// stylize nav bar
	$('.lesson').removeClass('active')
	$(this).closest('.lesson').addClass('active')

	var lessonId = $(this).data('id') 
	$.get('http://localhost:3000/lessons/' + lessonId + '/videos').done(function (videos) {
		$('.study-content').html(videos[0].videoSrc)
	})
	$.get('http://localhost:3000/lessons/' + lessonId + '/questions').done(function (questions) {
		var ques = questions[0]
		$('.challenge').html(renderQues(ques.id, ques.question, ques.answerA, ques.answerB, ques.answerC, ques.answerD))
	})	
})

// Check answer to challenge question
$('.challenge').on('click', 'button', function(e) {
	e.preventDefault()
	var ans = $('input[name=dq1]:checked').val()
	var questionId = $('.question-container').data('id')
	$.get('http://localhost:3000/questions/' + questionId).done(function (question) {	
		if (ans == question.correctAnswer) {
			$('.feedback').html('right on!')
			postQuestionAnswer(1, questionId, true)
		} else {
			$('.feedback').html('Sorry, try again')
			postQuestionAnswer(1, questionId, false)
		}
	}).done(function (){
		$.get('http://localhost:3000/userAnswers?correct=true').done(function (correctAnswers) {
			$('.points').html(correctAnswers.length)
		})
	})
});




var Router = Backbone.Router.extend({
	// Route definition
	routes: {
		':topicId': 'showTopic',
	},

  	// Route handler
  	showTopic: function(topicId) {
  		console.log('SHOW TOPIC')
		console.log(topicId)

		// next topic link
		var _this = this
		$('.module-lessons-nav .next-topic').off('click')
		$('.module-lessons-nav').one('click', '.next-topic', function (e) {
			e.preventDefault();
			var nextId = Number(topicId) + 1
			_this.navigate(String(nextId), {trigger: true})
		})

	  	// Set the topic name on page load
	  	$.get('http://localhost:3000/topics/' + topicId).done(function(topic) {
	  		$('.module-lessons-nav .title').html(topic.name);
	  	});

	  	// Get lessons list for the topic on page load
	  	$.get('http://localhost:3000/topics/' + topicId + '/lessons').done(function (lessons) {
	  		var tmpl = $('#lessons-template').html()
	  		var template = Handlebars.compile(tmpl);
	  		$('.module-lessons-nav .lesson-list').html(template(lessons))
	  		// set active lesson class
	  		$( ".module-lessons-nav .lesson:first-child" ).trigger( "click" ); 
	  	})

  	}
})

var router = new Router

Backbone.history.start()
