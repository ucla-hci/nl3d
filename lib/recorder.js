//
//
//
//	adapted from https://www.webrtc-experiment.com/RecordRTC/simple-demos/audio-recording.html
//

RECORDER = function(audio) {
	this.audio = audio
	this.isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)
	this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	this.isRecording = false
}

RECORDER.prototype = {
	constructor: RECORDER
}

RECORDER.prototype.startRecording = function() {
	if (!this.microphone) this.gainMicrophoneAccess()

	this.isRecording = true

	this.replaceAudio();

	this.audio.muted = true;
	setSrcObject(this.microphone, this.audio);
	this.audio.play();

	var options = {
		type: 'audio',
		numberOfAudioChannels: isEdge ? 1 : 2,
		checkForInactiveTracks: true,
		bufferSize: 16384
	};

	if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
		options.sampleRate = 48000; // or 44100 or remove this line for default
	}

	if (this.recorder) {
		this.recorder.destroy();
		this.recorder = null;
	}

	this.recorder = RecordRTC(this.microphone, options);

	this.recorder.startRecording();
}

RECORDER.prototype.stopRecording = function() {
	this.isRecording = false
	this.recorder.stopRecording(function() {
		this.replaceAudio(URL.createObjectURL(this.recorder.getBlob()))

		// btnStartRecording.disabled = false

		// setTimeout(function() {
		// 	if (!this.audio.paused) return

		// 	setTimeout(function() {
		// 		if (!this.audio.paused) return
		// 		this.audio.play()
		// 	}, 1000)

		// 	this.audio.play()
		// }, 300)

		this.audio.play()
	}.bind(this))
}

RECORDER.prototype.gainMicrophoneAccess = function() {
	this.captureMicrophone(function(mic) {
		this.microphone = mic

		if (this.isSafari) {
			this.replaceAudio()

			this.audio.muted = true
			setSrcObject(this.microphone, this.audio)
			this.audio.play()

			// btnStartRecording.disabled = false
			// btnStartRecording.style.border = '1px solid red'
			// btnStartRecording.style.fontSize = '150%'

			// alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.')
			// return
		}

	}.bind(this))
}

RECORDER.prototype.captureMicrophone = function(callback) {
	// btnReleaseMicrophone.disabled = false

	if (this.microphone) {
		callback(this.microphone)
		return
	}

	if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
		alert('This browser does not supports WebRTC getUserMedia API.')

		if (!!navigator.getUserMedia) {
			alert('This browser seems supporting deprecated getUserMedia API.')
		}
	}

	navigator.mediaDevices.getUserMedia({
		audio: isEdge ? true : {
			echoCancellation: false
		}
	}).then(function(mic) {
		callback(mic)
	}).catch(function(error) {
		alert('Unable to capture your microphone. Please check console logs.')
		console.error(error)
	})
}

RECORDER.prototype.replaceAudio = function(src) {
	var newAudio = document.createElement('audio')
	newAudio.controls = true

	if (src) {
		newAudio.src = src
	}

	var parentNode = this.audio.parentNode
	parentNode.innerHTML = ''
	parentNode.appendChild(newAudio)

	this.audio = newAudio
}

RECORDER.prototype.stopRecordingCallback = function() {
	this.replaceAudio(URL.createObjectURL(this.recorder.getBlob()))

	// btnStartRecording.disabled = false

	setTimeout(function() {
		if (!this.audio.paused) return

		setTimeout(function() {
			if (!this.audio.paused) return
			this.audio.play()
		}, 1000)

		this.audio.play()
	}, 300)

	this.audio.play()

	// btnDownloadRecording.disabled = false

	// if (isSafari) {
	// 	click(btnReleaseMicrophone)
	// }
}