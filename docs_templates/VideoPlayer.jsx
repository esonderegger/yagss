import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
import Hls from 'hls.js';
import Slider from 'react-slider-simple';
import { FaPlay, FaPause } from 'react-icons/fa';
import {
  RiVolumeDownFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
  RiClosedCaptioningLine,
  RiPictureInPictureExitLine,
  RiPictureInPicture2Line,
  RiFullscreenLine,
  RiFullscreenExitLine,
} from 'react-icons/ri';

function formatTime(t) {
  const pad = (num, size) => (`000${num}`).slice(size * -1);
  const total = Math.round(t);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  if (hours < 1) {
    return `${minutes}:${pad(seconds, 2)}`;
  }
  return `${hours}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}

function volumeIcon(val, isMuted) {
  if (isMuted) {
    return <RiVolumeMuteFill />;
  }
  if (val > 0.5) {
    return <RiVolumeUpFill />;
  }
  return <RiVolumeDownFill />;
}

export default function VideoPlayer(props) {
  const { src } = props;
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setMuted] = useState(false);
  const [showClosedCaptions, setShowClosedCaptions] = useState(true);
  const [canGoPiP, setCanGoPiP] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const parentRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const parent = parentRef.current;
    const video = videoRef.current;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => {
      setDuration(video.duration);
      setLoaded(true);
    };
    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);
    parent.addEventListener('fullscreenchange', handleFullScreenChange);
    const hls = new Hls();
    hls.attachMedia(video);
    hls.loadSource(src);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
      hls.detachMedia();
    };
  }, [src]);

  useEffect(() => {
    if ('pictureInPictureEnabled' in document) {
      setCanGoPiP(true);
    }
  }, []);

  function playPause() {
    const { current } = videoRef;
    if (playing) {
      current.pause();
    } else {
      current.play();
    }
    setPlaying(!playing);
  }

  function handleSliderChange(percent) {
    const { current } = videoRef;
    const value = (percent / 100) * duration;
    current.currentTime = value;
  }

  function handleVolumeChange(percent) {
    const { current } = videoRef;
    const value = (percent / 100);
    setVolume(value);
    current.volume = value;
  }

  function toggleMuted() {
    const { current } = videoRef;
    if (isMuted) {
      current.volume = volume;
      setMuted(false);
    } else {
      current.volume = 0;
      setMuted(true);
    }
  }

  function toggleClosedCaptions() {
    const { current } = videoRef;
    if (showClosedCaptions) {
      for (let i = 0; i < current.textTracks.length; i += 1) {
        current.textTracks[i].mode = 'disabled';
      }
      setShowClosedCaptions(false);
    } else {
      if (current.textTracks.length > 0) {
        current.textTracks[0].mode = 'showing';
      }
      setShowClosedCaptions(true);
    }
  }

  function togglePiP() {
    if (isPiP) {
      document.exitPictureInPicture();
    } else {
      const { current } = videoRef;
      current.requestPictureInPicture();
    }
  }

  function toggleFullscreen() {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      const { current } = parentRef;
      current.requestFullscreen();
    }
  }

  const elapsedPercent = (100 * currentTime) / duration;

  return (
    <div className="video-player" ref={parentRef}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} className="video-element" />
      <div className="video-controls">
        <button type="button" className="video-control-button" onClick={playPause} disabled={!loaded} title={playing ? 'Pause' : 'Play'}>
          {playing ? <FaPause /> : <FaPlay /> }
        </button>
        <div className="video-volume">
          <button type="button" className="video-control-button" onClick={toggleMuted} title={isMuted ? 'Unmute' : 'Mute'}>
            {volumeIcon(volume, isMuted)}
          </button>
          <div className="video-volume-slider">
            <Slider value={volume * 100} onChange={handleVolumeChange} thumbColor="#fff" shadowColor="#aaa" sliderPathColor="#666" />
          </div>
        </div>
        <button type="button" className="video-control-button" onClick={toggleClosedCaptions} title={`${showClosedCaptions ? 'Hide' : 'Show'} Closed Captions`}>
          <RiClosedCaptioningLine />
        </button>
        <div className="video-time">{formatTime(currentTime)}</div>
        <div className="video-slider">
          <Slider value={elapsedPercent} onChange={handleSliderChange} thumbColor="#fff" shadowColor="#aaa" sliderPathColor="#666" />
        </div>
        <div className="video-time">{formatTime(duration - currentTime)}</div>
        <button type="button" className="video-control-button" disabled={!canGoPiP} onClick={togglePiP} title={isPiP ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}>
          {isPiP ? <RiPictureInPictureExitLine /> : <RiPictureInPicture2Line /> }
        </button>
        <button type="button" className="video-control-button" onClick={toggleFullscreen} title={isPiP ? 'Exit Full-Screen' : 'Enter Full-Screen'}>
          {isFullScreen ? <RiFullscreenExitLine /> : <RiFullscreenLine /> }
        </button>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};
