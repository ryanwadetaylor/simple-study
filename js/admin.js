console.log('at admin.js')

$(function() {

	$('.add-lesson-form .add-btn').on('click', function(e) {
		e.preventDefault()
		var topicId = $('#topic-name').val()
		console.log(topicId)
		var lessonName = $('#lesson-name').val()
		console.log(lessonName)

		$.post('http://localhost:3000/lessons', {
	    	topicId: topicId,
	    	name: lessonName
	  	}).done(function (lessonData) {
	  		// call post Video fn (id)
	  		$.post('http://localhost:3000/videos', { 
				lessonId: lessonData.id, 
				videoSrc: $('#video-link').val()
			})
	  		// call post question data fn (id)
			$('.add-lesson-form input[type=text], textarea').val('')
		})
	})

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


})