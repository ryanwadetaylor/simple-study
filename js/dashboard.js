
$(function () {

// Get lessons lists for the topics on page load
  	var tmpl = $('#lessons-template').html()
  	var template = Handlebars.compile(tmpl)

  	$.get('http://localhost:3000/topics/1/lessons').done(function (lessons) {
  		$('.metaphysics-lesson-list').html(template(lessons))
  	}).done(function (lessons) {
  		// check if lesson question has been answered correctly
  		lessons.forEach(function(lesson) {
  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
				var idSelector = $('[data-id=' + lesson.id + ']')
				if (correctAnswers.length) {
					idSelector.find('i.fa').removeClass('fa-play-circle-o').addClass('fa-check')	
				}
			})
  		})
  	})

  	$.get('http://localhost:3000/topics/2/lessons').done(function (lessons) {
  		$('.epistem-lesson-list').html(template(lessons))
  	}).done(function (lessons) {
  		// check if lesson question has been answered correctly
  		lessons.forEach(function(lesson) {
  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
				var idSelector = $('[data-id=' + lesson.id + ']')
				if (correctAnswers.length) {
					idSelector.addClass('completed')
					$('.completed > i').removeClass('fa-play-circle-o').addClass('fa-check')
				}
			})
  		})
  	})

  	$.get('http://localhost:3000/topics/3/lessons').done(function (lessons) {
  		$('.anthro-lesson-list').html(template(lessons))
  	}).done(function (lessons) {
  		// check if lesson question has been answered correctly
  		lessons.forEach(function(lesson) {
  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
				var idSelector = $('[data-id=' + lesson.id + ']')
				if (correctAnswers.length) {
					idSelector.find('i.fa').removeClass('fa-play-circle-o').addClass('fa-check')
				}
			})
  		})
  	})

  	$.get('http://localhost:3000/topics/4/lessons').done(function (lessons) {
  		$('.rel-lesson-list').html(template(lessons))
  	}).done(function (lessons) {
  		// check if lesson question has been answered correctly
  		lessons.forEach(function(lesson) {
  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
				var idSelector = $('[data-id=' + lesson.id + ']')
				if (correctAnswers.length) {
					idSelector.addClass('completed')
					$('.completed > i').removeClass('fa-play-circle-o').addClass('fa-check')
				}
			})
  		})
  	})

  	$.get('http://localhost:3000/topics/5/lessons').done(function (lessons) {
  		$('.ethics-lesson-list').html(template(lessons))
  	}).done(function (lessons) {
  		// check if lesson question has been answered correctly
  		lessons.forEach(function(lesson) {
  			$.get('http://localhost:3000/lessons/' + lesson.id + '/userAnswers?correct=true').done(function (correctAnswers) {
				var idSelector = $('[data-id=' + lesson.id + ']')
				if (correctAnswers.length) {
					idSelector.addClass('completed')
					$('.completed > i').removeClass('fa-play-circle-o').addClass('fa-check')
				}
			})
  		})
  	}).done(function (){
  		// load points
		$.get('http://localhost:3000/userAnswers?correct=true').done(function (correctAnswers) {
			$('.dashboard-points').html(correctAnswers.length)
		})
	})

		


})