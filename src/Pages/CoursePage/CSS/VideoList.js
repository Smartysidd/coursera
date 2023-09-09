import React from 'react';
import './CSS/VideoList.css';

const VideoList = (props) => {
  let className = [];
  let PlayIcon = [];

  if (props.playButton) {
    className = ['video-list', props.playButton];
  }

  if (props.completed) {
    PlayIcon = ['fa fa-check-circle', props.completed];
  } else if (!props.completed) {
    PlayIcon = ['fa fa-pause-circle'];
  }

  return (
    <div onClick={props.changed} className={className.join(' ')}>
      <div className="play-title">
        <i className={PlayIcon.join(' ')} aria-hidden="true"></i>
        <span> {props.title}</span>
      </div>

      <div className="video-duration">
        <span>4.22</span>
      </div>
    </div>
  );
};

export default VideoList;
