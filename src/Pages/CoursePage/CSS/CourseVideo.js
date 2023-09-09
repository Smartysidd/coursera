import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './CSS/CoursePage.css';
import Url from '../../ApiServices/BackendUrl';

const CourseVideo = (props) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleProgress = (state) => {
    let currentProgress = (state.playedSeconds / duration) * 100;

    if (currentProgress === 0) {
      props.videoDuration(duration, props.index);
    }

    if (currentProgress >= 80) {
      props.videoCompleted(props.index);
    }

    setProgress(currentProgress);
  };

  const handleDuration = (state) => {
    setDuration(state);
  };

  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        width='100%'
        height='100%'
        controls={true}
        onProgress={handleProgress}
        onDuration={handleDuration}
        playing={props.playing}
        url={Url + [props.videoUrl ? props.videoUrl.videoUrl : '']}
      />
    </div>
  );
}

export default CourseVideo;
