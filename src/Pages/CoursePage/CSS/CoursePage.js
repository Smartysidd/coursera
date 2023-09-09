import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import CourseDesc from './CourseDesc';
import CourseVideo from './CourseVideo';
import axios from '../../ApiServices/axiosUrl';
import VideoList from './VideoList';
import Layout from '../../components/Layout/Layout';
import parse from 'html-react-parser';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AuthServices from '../../ApiServices/auth.service';
import Rating from './Rating';

const CoursePage = (props) => {
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [currentVideo, setCurrentVideo] = useState('');
  const [playing, setPlaying] = useState(false);
  const [videoStates, setVideoStates] = useState({
    video0: true,
    video1: false,
    video2: false,
    video3: false,
    video4: false,
    video0Completed: false,
    video1Completed: false,
    video2Completed: false,
    video3Completed: false,
    video4Completed: false,
    video0Duration: '0',
    video1Duration: '0',
    video2Duration: '0',
    video3Duration: '0',
    video4Duration: '0',
  });
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [watchedVideoCount, setWatchedVideoCount] = useState(0);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    const { CourseType, CourseId } = props.match.params;

    AuthServices.FetchCourses(CourseType, CourseId)
      .then((response) => {
        console.log("CoursePage Response", response);
        setCourseInfo(response.data.course);
        setCurrentVideo(response.data.course.videoContent[0]);
        setLoading(false);

        let count = 0;
        for (let j in response.data.course.videoContent) {
          for (let i in response.data.course.videoContent[j].usersWatched) {
            if (localStorage.getItem('userId') === response.data.course.videoContent[j].usersWatched[i]) {
              setVideoStates((prevVideoStates) => ({
                ...prevVideoStates,
                ['video' + j + 'Completed']: true,
              }));
              count += 1;
              break;
            }
          }
        }
        let progress = (count / response.data.course.videoContent.length) * 100;
        setWatchedVideoCount(count);
        setProgress(progress);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [props.match.params]);

  const VideochangeHandler = (event, video, index, playing) => {
    setCurrentVideo(video);
    setIndex(index);
    for (let i = 0; i < 5; i++) {
      setVideoStates((prevVideoStates) => ({
        ...prevVideoStates,
        ['video' + i]: i === index,
      }));
    }
    setPlaying(playing);
  };

  const videoCompleted = (index) => {
    if (!videoStates['video' + index + 'Completed']) {
      setWatchedVideoCount((prevWatchedVideoCount) => prevWatchedVideoCount + 1);

      const form = {};
      form['courseId'] = props.match.params.CourseId;
      form['userId'] = localStorage.getItem('userId');
      form['videoId'] = courseInfo.videoContent[index]._id;
      console.log(form['videoId']);
      axios.post('/watchedByuser', form)
        .then((response) => {
          console.log("Video information sent Response", response);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    let progress = (watchedVideoCount / courseInfo.videoContent.length) * 100;
    setProgress(progress);
    setVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      ['video' + index + 'Completed']: true,
    }));
  };

  const videoDuration = (duration, index) => {
    setVideoStates((prevVideoStates) => ({
      ...prevVideoStates,
      ['video' + index + 'Duration']: duration,
    }));
  };

  if (redirect) return <Redirect to={redirect} />;

  let title = null;
  let short_description = null;
  let teacher = null;
  let createdAt = null;
  let VideoUrl = null;
  let rating = '0';
  let ratingtimesUpdated = null;
  let requirement = null;
  let longDescription = null;
  let willLearn = null;
  let videourl = null;
  let playingVideo = false;
  let completed = false;
  let progressbar = null;

  if (loading === false) {
    title = courseInfo.title;
    short_description = courseInfo.discription;
    teacher = courseInfo.name;
    createdAt = courseInfo.createdAt.split("T")[0];
    rating = courseInfo.rating.ratingFinal;
    requirement = parse(courseInfo.requirement);
    longDescription = parse(courseInfo.discriptionLong);
    willLearn = parse(courseInfo.willLearn);
    ratingtimesUpdated = courseInfo.rating.timesUpdated;
    videourl = courseInfo.videoContent.slice(0);
    bookmark = courseInfo.bookmark.includes(localStorage.getItem('userId'));

    if (rating === 0) rating = 1;

    VideoUrl = videourl.map((video, index) => {
      if (videoStates['video' + index]) {
        playButton = 'VideoSelected';
        playingVideo = true;
      } else {
        playButton = 'VideoNotSelected';
        playingVideo = false;
      }

      if (videoStates['video' + index + 'Completed']) {
        completed = 'VideoCompleted';
      } else if (!videoStates['video' + index + 'Completed']) {
        completed = false;
      }

      return (
        <VideoList
          key={index}
          video={video}
          changed={(event) => VideochangeHandler(event, video, index, playingVideo)}
          playButton={playButton}
          completed={completed}
          title={'Video ' + index}
          Duration={videoStates['video' + index + 'Duration']}
        />
      );
    });
  }

  if (progress === 100) {
    progressbar = (
      <p>
        Congratulations {localStorage.getItem('userName')}!
        <i className="fa fa-birthday-cake" style={{ marginLeft: '5px' }} aria-hidden="true"></i>
      </p>
    );
  } else {
    progressbar = (
      <>
        <p>You have Completed <b>{progress.toPrecision(2)}% </b> of your course!</p>
        <ProgressBar variant="success" now={progress} />
      </>
    );
  }

  return (
    <Layout>
      <div className="coursePage">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to='/home'>Home</NavLink>
              </li>
              <li className="breadcrumb-item">
                <NavLink to={`/Home/${props.match.params.CourseType}`}>{props.match.params.CourseType}</NavLink>
              </li>
              <li className="breadcrumb-item">
                <NavLink to={`/course/${props.match.params.CourseType}/${props.match.params.CourseId}`} activeStyle={{ textDecoration: 'underline' }}>{title}</NavLink>
              </li>
            </ol>
          </nav>
          <div className="Main-Section">
            <div className="Description-main">
              <CourseDesc
                title={title}
                short_description={short_description}
                teacher={teacher}
                createdat={createdAt}
                CourseId={props.match.params.CourseId}
                rating={parseInt(rating)}
                ratingtimesUpdated={ratingtimesUpdated}
                CourseType={props.match.params.CourseType}
                bookmark={bookmark}
              />
            </div>
            <div className="Course-Video">
              <CourseVideo
                playing={playing}
                videoUrl={currentVideo}
                index={index}
                videoCompleted={videoCompleted}
                videoDuration={videoDuration}
              />
            </div>
          </div>
          <div className="Breakpoint"></div>
          <div className="Section2">
            <div className="section2part1">
              <div className="Small-nav-section">
                <p>About</p>
              </div>
              <div className="flex-col-requirement">
                <h1>Requirement of this Course</h1>
                <p>{requirement}</p>
              </div>
              <div className="flex-col-requirement">
                <h1>Descripton</h1>
                <p>{longDescription}</p>
              </div>
              <div className="flex-col-requirement">
                <h1>What will you learn from this course?</h1>
                <p>{willLearn}</p>
              </div>
            </div>
            <div style={{ marginBottom: "100px" }} className="flex-center">
              {VideoUrl}
              <div className='progressBar'>
                {progressbar}
              </div>
              <div className="progressBar">
                <p className="Rating_coursePage">Rate the course here please</p>
                <Rating
                  style={{ justifyContent: 'center' }}
                  rating={parseInt(rating)}
                  edit={true}
                  specialrating={true}
                  CourseId={props.match.params.CourseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursePage;
