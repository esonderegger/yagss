import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from './VideoPlayer.jsx';

export default function Video(props) {
  const { src, videos } = props;
  const video = videos.find((v) => v.name === src);

  return (
    <div className="video-instance">
      <VideoPlayer src={video ? video.hlsUrl : 'not-found.m3u8'} />
    </div>
  );
}

Video.propTypes = {
  src: PropTypes.string.isRequired,
  videos: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    hlsUrl: PropTypes.string,
  })).isRequired,
};
