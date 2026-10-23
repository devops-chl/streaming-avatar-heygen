'use strict';

let screensaverTimeout;
const screensaver = document.getElementById('screensaver');
const content = document.getElementById('content');
const screensaverVideo = document.getElementById('screensaver-video');
const listenerStatus = document.querySelector('#listenerStatus');
const videoSource = document.querySelector('#videoSource');
const footerText = document.querySelector('#footerText');
const footer = document.querySelector('.footer');
const videos = [
  'videos/WELCOME.webm',
  'videos/1A.webm', // 1 The Art Hike is a self-guided tour that immerses you in Choctaw artistic heritage...
  'videos/1B.webm', // 2 The Art Hike website is your comprehensive guide to the artwork and Choctaw artists...
  'videos/1C.webm', // 3 Our interactive artwork marked by green plaques offers a gamified experience...
  'videos/2A.webm', // 4 Locate any artwork with a QR code, scan it with your smart phone, and follow the prompts...
  'videos/2B.webm', // 5 The Art Hike doesn't have a set starting point, so feel free to begin anywhere...
  'videos/3A.webm', // 6 The Art Hike features a variety of artwork, including paitings, scultpures...
  'videos/3B.webm', // 7 Discover a palette of emotions and colors in the paintings... 
  'videos/4A.webm', // 8 While the Art Hike is family-friendly, please note...
  'videos/5A.webm', // 9 The Art Hike showcases various Choctaw artists...
  'videos/5B.webm', // 10 Explore the unique pieces by Wani Marshall Coker, who draws inspiration... 
  'videos/5C.webm', // 11 Explore the Art Hike’s unique collection, which includes Jane Semple...
  'videos/6A.webm', // 12 The Art Hike exists to celebrate and share Choctaw culture...
  'videos/6B.webm', // 13 Choctaw art in this exhibition highlights the traditions and creative... 
  'videos/7A.webm', // 14 The interactive art pieces on the Art Hike include “Itti Kana,”...
  'videos/7B.webm', // 15 Interactive Art Hike elements at Choctaw Landing can be found... 
  'videos/7C.webm', // 16 You can scan the QR codes on the green plaques next to the pieces...
  'videos/8A.webm', // 17 To learn more about each artwork, scan the QR code next to it...
  'videos/8B.webm', // 18 To explore the rich stories behind each artwork, scan the QR code...
  'videos/9A.webm', // 19 The duration of the Art Hike depends entirely on your pace...
  'videos/9B.webm', // 20 Your experience on the Art Hike is self-paced; you can explore...
  'videos/10A.webm', // 21 At Choctaw Landing, you can try your luck with over 600... 
  'videos/11A.webm' // 22 
];
const offtopic_videos = [
    'videos/OTHER_A.webm', // As an AI, I do not have personal opinions or the capacity
    'videos/OTHER_B.webm', // While that’s a good question, it falls outside our focus on 
    'videos/OTHER_C.webm', // I’m here to focus on the Choctaw Art Hike. For other inquiries, i
    'videos/OTHER_D.webm', // I’m sorry. I’m not sure. 
    'videos/OTHER_E.webm', // Happy hiking!
];
let videoIndex = null;
let previousIndex = 0;
let isRecognitionStarted = false;
const toggleButton = document.querySelector('#toggleButton');
const actionButton = document.querySelector('#action-button');
const inputStatus = document.querySelector('#footerText');
const recordTest = document.querySelector('#recordTest');

var video = document.getElementById('videoPlayer');
toggleButton.addEventListener('click', toggleVideo);
showScreensaver()

// Function to show the screensaver
function showScreensaver() {
  const footer = document.querySelector('.footer');
  if (footer && footer.classList.contains('waiting')) 
  {
    screensaver.style.display = 'flex';
    screensaverVideo.play();
    content.style.display = 'none';
  } else {
    screensaverTimeout = setTimeout(showScreensaver, 10000);
  }
}

// Function to hide the screensaver
function hideScreensaver() {
  screensaver.style.display = 'none';
  content.style.display = 'block';
  screensaverVideo.pause();
  footerStatus('waiting', 'Tap to chat')
  toggleVideo();
  resetScreensaverTimeout(); // Reset the timeout when the screensaver is hidden
}

// Function to reset the screensaver timeout
function resetScreensaverTimeout() {
  clearTimeout(screensaverTimeout);
  screensaverTimeout = setTimeout(showScreensaver, 40000); // 30 seconds
}

// Add event listener to hide the screensaver on click
screensaver.addEventListener('click', hideScreensaver);

// Reset the screensaver timeout on user interactions
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetScreensaverTimeout);
});

// Initialize the screensaver timeout when the page loads
document.addEventListener('DOMContentLoaded', resetScreensaverTimeout);


video.addEventListener('ended', function () {
  console.log('Video playback has ended. Starting speech rec...');
  actionButton.style.display = 'block';
  footerText.style.display = 'block';
  footerStatus('waiting', 'Tap to chat');
  // recognition.start();
  // Perform actions when video playback has ended
});

// let videoClickCount = 0;
// const screenSizeSpan = document.querySelector('#screen-size');
// video.addEventListener('click', () => {
//     videoClickCount = videoClickCount + 1;
//     if ( videoClickCount > 20 ) {
//         screenSizeSpan.innerHTML = 'Window: '+window.innerWidth+' x '+window.innerHeight;
//         video.style.display = 'none';
//     }
// })

function toggleVideo() {
  const wrapper = document.querySelector('#videoWrapper');
  const toggleButton = document.querySelector('#toggleButton');
  wrapper.style.display = 'block';
  toggleButton.style.display = 'none';
  video.src = 'videos/WELCOME.webm';
  //actionButton.style.display = 'none';
  footerText.style.display = 'none';
  footerStatus('speaking','');
  video.play();
  //console.log('Initial speech recognition startup...')
  //recognition.start();
}

footer.addEventListener('click', () => {
    if (footer.classList.contains('waiting')) {
        footerStatus('listening', 'listening...');
        recordAndTranscribe();
    }    
});

let offTopicVideoCount = 0;


// Add this function to handle microphone input and send audio to the OpenAI Whisper API
// Function to handle microphone input and send audio to OpenAI Whisper API
async function recordAndTranscribe() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = function (event) {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async function () {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' }); // Assuming Whisper API accepts MPEG audio format
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.mp3');
      formData.append('model', 'whisper-1');

      // Send the audio file to the server, which adds the OpenAI API key
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Whisper API Transcription:' + responseData.text); // Log the response data

        if (responseData.text && responseData.text.length > 0) {
          const transcription = responseData.text; // Get text from transcription
          //recordTest.innerHTML = transcription;
          console.log('Audio transcribed successfully');
          handleVideoSelection(transcription);
          // Automatically submit the form
          //document.querySelector('#talkBtn').click(); // Triggers the form submission
        } else {
          console.log('No transcription received from OpenAI');
        }
      } else {
        console.log('Error fetching transcription');
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000); // Record for 5 seconds
  } catch (error) {
    console.error('Error recording audio:', error);
    updateStatus(statusElement, 'Error recording audio');
  }
}

document.querySelector('#recordBtn').addEventListener('click', recordAndTranscribe);

function updateStatus(status) {
  inputStatus.innerHTML = status;
}

function handleVideoSelection(transcript) {
  console.log('You said:', transcript);
  //inputStatus.innerHTML = transcript;

  previousIndex = videoIndex;
  videoIndex = findClosestMatch(transcript);
  console.log('findClosestMatch videoIndex='+videoIndex);
  if (videoIndex == -1) {
    videoIndex = previousIndex + 1;
  }
  if (videoIndex >= videos.length && videoIndex != 100 ) {
    videoIndex = 0;
  }
  //videoIndex = videoIndex > 0 ? videoIndex -1 : 0;
  console.log('video index=' + videoIndex);
  if (videoIndex != null && videoIndex >= 0 && (videoIndex < videos.length || videoIndex == 100 ) ) {
    if ( videoIndex == 100 ) {
        video.src = offtopic_videos[offTopicVideoCount%offtopic_videos.length];
        offTopicVideoCount = offTopicVideoCount + 1;
    } else {
        video.src = videos[videoIndex];
    }
    console.log('About to play video in 1 second...');
    setTimeout(function () {
      //actionButton.style.display = 'none';
      footerText.style.display = 'none';
      footerStatus('speaking', '');
      video.play();
      //footerStatus('speaking', '<i>' + transcript + '</i>');
      listenerStatus.innerHTML = '';
      isRecognitionStarted = false;
      sendTrackingData(transcript,videoIndex);
      //recognition.stop();
      // setTimeout(() => {
      //     if ( isRecognitionStarted ) {
      //         recognition.start();
      //     } else {
      //         console.log('Choosing not to restart speech recognition.');
      //     }
      // }, 20000);
    }, 1000);
  } else {
    console.log('invalid video index='.videoIndex);
  }
}

function footerStatus(status, text) {
  footer.classList.remove('speaking', 'listening', 'microphone', 'waiting');
  footer.classList.add(status);
  inputStatus.innerHTML = text;
}

function resetTextFade() {
  inputStatus.classList.remove('fade-out-text');
  void inputStatus.offsetWidth;
  inputStatus.classList.add('fade-out-text');
}
const phrases = [
  ['what is the art hike experience', 1], // 1
  ['what can i expect from the art hike here at choctaw landing', 1], // 1
  ['what’s involved in the art hike experience at this location', 2], // 1
  ['could you tell me what to look forward to during the art hike', 3], // 1
  ['what is the art hike', 1], // 1
  ['how do I start the art hike experience', 4], // 2
  ['how do I start the art hike', 4], // 2
  ['where should i go to start the art hike', 4], // 2
  ['what are the first steps to take to join the art hike', 4], // 2
  ['can you guide me on how to start the art hike', 5], // 2
  ['where do I start', 5], // 2
  ['how do I start', 5], // 2
  ['what types of artwork can I expect to see on the art hike', 6], // 3
  ['can you describe the art featured on the art hike', 6], // 3
  ['what variety of artwork are is included in the art hike', 6], // 3
  ['what kind of art will i see', 7], // 3
  ['tell me about the artwork', 7], // 3
  ['is the art hike family friendly', 8], // 4
  ['can i bring my kids on the art hike', 8], // 4
  ['is there an age limit to the art hike', 8], // 4
  ['can i bring children on the art hike', 8], // 4
  ['is it family friendly', 8], // 4
  ['who are some of the feature Choctaw artists', 9], // 5
  ['who are some of the artists', 9], // 5
  ['can you tell me about some of the artists featured on the art hike', 10], // 5
  ['are all the artists choctaw', 10], // 5
  ['do you have any recommendations', 11], // 5
  ['tell me about the artists', 11], // 5
  ['what is the significance of Choctaw art in this exhibition', 12], // 6
  ['what makes the choctaw art here special', 12], // 6
  ['what’s the importance of the art', 12], // 6
  ['is there a theme to the art', 13], // 6
  ['what is the significance of Choctaw art', 13], // 6
  ['what are the interactive artworks', 14], // 7
  ['tell me about the interactive art', 14], // 7
  ['how do i interact with the artwork', 15], // 7
  ['where are the interactive pieces', 15], // 7
  ['what interactive experiences are part of this tour', 16], // 7
  ['how can I learn more about each artwork', 17], // 8
  ['how can I learn more about the art', 17], // 7
  ['where can i get more information about these artwork', 17], // 8
  ['what resources are there to learn more about the art', 18], // 8
  ['how long is the art hike', 19], // 9
  ['how much time should i plan for the art hike', 19], // 9
  ['where do i start the art hike', 20], // 9
  ['how long is it', 20], // 9
  ['Tell me more about Choctaw Landing.', 21], // 9
  ['What else should I check out while I am here?', 21], // 9
  ['What else can I do here?', 21], // 9
  ['what should I do if I want to explore more Choctaw culture after the art hike', 22], // 10
  ['what should I do if I want to explore more Choctaw culture', 22], // 10
  ['how can I learn more about Choctaw culture', 22], // 10
  ['tell me about Choctaw culture', 22], // 10
  ['where can i get more information about these artwork', 22], // 10
  ['what resources are there to learn more about the art', 22], // 10
  ['is there a website for the art', 22], // 10
  ['play video one', 1],
  ['play video 1', 1],
  ['video 1', 1],
  ['video one', 1],
  ['1', 1],
  ['one', 1],
  ['play video 2', 2],
  ['play video two', 2],
  ['play video too', 2],
  ['video 2', 2],
  ['video two', 2],
  ['video too', 2],
  ['2', 2],
  ['two', 2],
  ['too', 2],
  ['to', 2],
  ['play video three', 3],
  ['play video 3', 3],
  ['video three', 3],
  ['video 3', 3],
  ['3', 3],
  ['three', 3],
  ['play video four', 4],
  ['play video for', 4],
  ['play video 4', 4],
  ['video four', 4],
  ['video for', 4],
  ['video 4', 4],
  ['4', 4],
  ['four', 4],
  ['for', 4],
  ['play video five', 5],
  ['play video 5', 5],
  ['video five', 5],
  ['video 5', 5],
  ['5', 5],
  ['five', 5],
  ['play video six', 6],
  ['play video 6', 6],
  ['video six', 6],
  ['video 6', 6],
  ['six', 6],
  ['6', 6],
  ['play video seven', 7],
  ['play video 7', 7],
  ['video seven', 7],
  ['video 7', 7],
  ['seven', 7],
  ['7', 7],
  ['play video eight', 8],
  ['play video 8', 8],
  ['video eight', 8],
  ['video 8', 8],
  ['eight', 8],
  ['8', 8],
  ['play video nine', 9],
  ['play video 9', 9],
  ['video nine', 9],
  ['video 8', 9],
  ['nine', 9],
  ['9', 9],
  ['play video ten', 10],
  ['play video 10', 10],
  ['video ten', 10],
  ['video 10', 10],
  ['ten', 10],
  ['10', 10],
  ['tell me more', -1],
  ['what else can you tell me', -1],
  ['what else', -1],
  ['pulido', 0],
  ['halido', 0],
  ['halito', 0],
  ['hello', 0],
  ['howdy', 0],
  ['hi chief', 0],
  ['hi gary', 0],
  ['hi gary batton', 0],
  ['hi chief gary batton', 0],
  ['buenos dias', 0],
  ['hi there', 0],
  ['how are you', 0],
];

function findClosestMatch(phrase) {
  // Initialize variables to store the closest match and its distance
  let closestMatch = null;
  let minDistance = Infinity;

  // Calculate Levenshtein distance for each phrase in the array
  phrases.forEach(function (pair) {
    const candidate = pair[0];
    const value = pair[1];

    // Calculate Levenshtein distance between the candidate and the given phrase
    const distance = levenshteinDistance(phrase.toLowerCase(), candidate.toLowerCase());

    // Update closest match if the distance is smaller
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = value;
    }
  });
  console.log('minDistance='+minDistance);
  if ( minDistance > 29 ) {
    closestMatch = 100;
  }
  return closestMatch;
}

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

async function sendTrackingData(question,response) {
    const now = new Date();
    const currentTimestamp = now.toISOString(); // Outputs the current date and time in ISO format
    console.log(currentTimestamp);

    const values = [
        [currentTimestamp, question, response] // Replace with your data
    ];

    try {
        const response = await fetch('https://google-sheets-relay.vercel.app/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
        });

        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error appending data:', error);
    }
}
