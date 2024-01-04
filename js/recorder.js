var recorder = {
   record : function(recordingDuration){
		var events = [];
		var startTime = Date.now();

		function recordEvent(event) {
		  var currentTime = Date.now() - startTime;
		  var eventType = event.type;
		  
		  var eventDetails = {
			"type": eventType,
			"time": currentTime,
			"x": event.pageX,
			"y": event.pageY
		  };

		  if (eventType == "keyup" || eventType == "keydown")
		  {
			  eventDetails.key  = event.key;
		  }
		  
		  events.push(eventDetails);
		}

		function downloadJSON(filename, json) {
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(json)));
		  element.setAttribute('download', filename);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		}

		function stopRecording() {
		  $(document).off('mousemove click keydown keyup', recordEvent);
		  var filename = 'recorded_events.json';
		  downloadJSON(filename, events);
		}

		$(document).on('mousemove click keydown keyup', recordEvent);

		setTimeout(stopRecording, recordingDuration);
	   },
  playback: function(jsonFile){
	 $.getJSON(jsonFile, function(data) {
        replayEvents(data);
      });
		 function replayEvents(events) {
			 var startTime = events[0].time;

			  function simulateEvent(event) {
				var simulatedEvent;
				switch (event.type) {
				  case 'mousemove':
					simulatedEvent = $.Event('mousemove', {
					  pageX: event.x,
					  pageY: event.y,
					  target : $(document.elementFromPoint(event.x, event.y))
					});
					break;
				  case 'click':
					simulatedEvent = $.Event('click', {
					  pageX: event.x,
					  pageY: event.y,
					  target : $(document.elementFromPoint(event.x, event.y))
					});
					break;
				  case 'keydown':
					simulatedEvent = $.Event('keydown', {
					  key: event.key,
					  target : $(document)
					 });
					break;
				  case 'keyup':
					simulatedEvent = $.Event('keyup', {
						key: event.key,
					    target : $(document)
					});
					break;
				  default:
					return;
				}

				var currentTime = event.time - startTime;
				setTimeout(function() {
				  simulatedEvent.target.trigger(simulatedEvent);
					}, currentTime);
				  console.log(JSON.stringify(simulatedEvent));
				  return simulatedEvent;
			  }

			  events.forEach(function(event) {
				simulateEvent(event);
			  });
		   }
	   }
};