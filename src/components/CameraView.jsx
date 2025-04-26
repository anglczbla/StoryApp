// src/components/CameraView.jsx
import React, { useEffect, useRef } from 'react';
import Webcam from 'webcam-easy';

const CameraView = ({ setPhotoBlob }) => {
  const webcamRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const webcam = new Webcam(webcamRef.current, 'user', canvasRef.current);
    webcam.start()
      .then(() => console.log('Webcam started'))
      .catch(err => console.error(err));

    return () => {
      webcam.stop();
    };
  }, []);

  const capture = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      setPhotoBlob(blob);
    }, 'image/jpeg');
  };

  return (
    <div>
      <video ref={webcamRef} autoPlay playsInline width="320" height="240" />
      <canvas ref={canvasRef} style={{ display: 'none' }} width="320" height="240"></canvas>
      <button type="button" onClick={capture}>Capture Photo</button>
    </div>
  );
};

export default CameraView;
