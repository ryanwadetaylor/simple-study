
$(function () {

// Get lessons lists for the topics on page load
  	var tmpl = $('#lessons-template').html()
  	var template = Handlebars.compile(tmpl)

  	$.get('http://localhost:3000/topics/1/lessons').done(function (lessons) {
  		$('.metaphysics-lesson-list').html(template(lessons))
  	})

  	$.get('http://localhost:3000/topics/2/lessons').done(function (lessons) {
  		$('.epistem-lesson-list').html(template(lessons))
  	})

  	$.get('http://localhost:3000/topics/3/lessons').done(function (lessons) {
  		$('.anthro-lesson-list').html(template(lessons))
  	})

  	$.get('http://localhost:3000/topics/4/lessons').done(function (lessons) {
  		$('.rel-lesson-list').html(template(lessons))
  	})

  	$.get('http://localhost:3000/topics/5/lessons').done(function (lessons) {
  		$('.ethics-lesson-list').html(template(lessons))
  	})

	
})