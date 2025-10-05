import React, { useRef, useEffect } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const GestureControl = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const imageRef = useRef(null);
  const objX = useRef(320);
  const objY = useRef(240);
  const scale = useRef(1);

  // Load and resize overlay image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/test_image.png";
    img.onload = () => {
      const maxSize = 200;
      const scaleFactor = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const offCanvas = document.createElement("canvas");
      offCanvas.width = img.width * scaleFactor;
      offCanvas.height = img.height * scaleFactor;
      const ctx = offCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

      const resized = new Image();
      resized.src = offCanvas.toDataURL();
      resized.onload = () => {
        imageRef.current = resized;
      };
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fullscreen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: window.innerWidth,
      height: window.innerHeight,
    });
    camera.start();

    // Draw hand landmarks
    function drawLandmarks(ctx, landmarks, connections = []) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;

      // Draw points
      landmarks.forEach((lm) => {
        ctx.beginPath();
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw skeleton
      connections.forEach(([i, j]) => {
        const start = landmarks[i];
        const end = landmarks[j];
        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
        ctx.stroke();
      });
    }

    // Hand connections for skeleton
    const HAND_CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],       // Thumb
      [0,5],[5,6],[6,7],[7,8],       // Index
      [0,9],[9,10],[10,11],[11,12],  // Middle
      [0,13],[13,14],[14,15],[15,16],// Ring
      [0,17],[17,18],[18,19],[19,20] // Pinky
    ];

    function onResults(results) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw camera feed
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks) {
        let rightHand = null;
        let leftHand = null;

        results.multiHandedness.forEach((hand, i) => {
          if (hand.label === "Right") rightHand = results.multiHandLandmarks[i];
          if (hand.label === "Left") leftHand = results.multiHandLandmarks[i];
        });

        // Draw hand skeletons
        results.multiHandLandmarks.forEach((landmarks) =>
          drawLandmarks(ctx, landmarks, HAND_CONNECTIONS)
        );

        // Move with right index
        if (rightHand) {
          objX.current = rightHand[8].x * canvas.width;
          objY.current = rightHand[8].y * canvas.height;
        }

        // Scale with left thumb–pinky
        if (leftHand) {
          const thumb = leftHand[4];
          const pinky = leftHand[20];
          const dx = (thumb.x - pinky.x) * canvas.width;
          const dy = (thumb.y - pinky.y) * canvas.height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          scale.current = Math.min(Math.max(dist / 150, 0.3), 3.0);
        }
      }

      // Draw overlay image
      if (imageRef.current) {
        const w = imageRef.current.width * scale.current;
        const h = imageRef.current.height * scale.current;
        ctx.drawImage(imageRef.current, objX.current - w / 2, objY.current - h / 2, w, h);
      }
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      camera.stop();
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <p style={{ position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "5px" }}>
        👉 Right hand index = move | ✋ Left hand thumb–pinky distance = scale
      </p>
    </div>
  );
};

export default GestureControl;
