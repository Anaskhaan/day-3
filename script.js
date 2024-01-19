// script.js

let videoStream;
let mediaRecorder;
let recordedChunks = [];

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      const videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.srcObject = stream;
      videoStream = stream;

      // Initialize MediaRecorder
      mediaRecorder = new MediaRecorder(stream);

      // Event listeners for MediaRecorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        recordedChunks = [];

        // For demo purposes, create a download link for the captured video
        const a = document.createElement("a");
        a.href = url;
        a.download = "captured-video.webm";
        a.textContent = "Download Video";
        document.body.appendChild(a);

        // Display the captured image below the video player
        const capturedImage = document.getElementById("capturedImage");
        capturedImage.src = dataUrl;
        capturedImage.style.display = "block";
      };
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
    });
}

function stopWebcam() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

function captureImage() {
  if (videoStream) {
    const videoPlayer = document.getElementById("videoPlayer");
    const canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    // For demo purposes, create a download link for the captured image
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "captured-image.png";
    a.textContent = "Download Image";
    document.body.appendChild(a);
  }
}
