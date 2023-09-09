import React, { useState, useEffect } from 'react';
import './CSS/CourseDesc.css';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import AuthServices from '../../ApiServices/auth.service';
import Url from '../../ApiServices/BackendUrl';

const CourseDesc = (props) => {
  const [bookmarked, setBookmarked] = useState(props.bookmark);
  const [CourseId, setCourseId] = useState(props.CourseId);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (props.bookmark !== bookmarked && count === 0) {
      setBookmarked(props.bookmark);
      setCount(7);
    }
  }, [props.bookmark, bookmarked, count]);

  const bookmark = () => {
    const user = localStorage.getItem('userId');
    const fd = new FormData();
    const form = {};
    fd.append('_userID', user);
    fd.append('_id', CourseId);
    form['_userID'] = user;
    form['_id'] = CourseId;

    AuthServices.BookMark(CourseId, props.CourseType, form)
      .then((response) => {
        setBookmarked((prevState) => !prevState);
        setCount(7);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const DownloadPdf = () => {
    AuthServices.Download(CourseId)
      .then((response) => {
        const path = Url + 'Files/invoice-' + CourseId + '.pdf';
        window.open(path);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const classArray = bookmarked
    ? ['bookmarked-color', 'fa fa-bookmark']
    : ['fa fa-bookmark-o'];

  return (
    <div>
      <p className="Course-title-main">{props.title}</p>

      <div className="Course-Rating-section">
        <p>{props.rating}</p>
        <div className="RatingStars">
          <Rating
            rating={props.rating}
            edit={false}
            specialrating={true}
            CourseId={props.CourseId}
          />
        </div>

        <p className="ratingtimesUpdated"> ( {props.ratingtimesUpdated} ratings )</p>
      </div>

      <div className="break1"></div>

      <div className="Short-Description">
        <p>{props.short_description}</p>
      </div>

      <div className="break2"></div>

      <div className="Course-Teacher-bookmark">
        <div className="Course-teacher-name">
          <p>Created at {props.createdat}</p>
          <h2>By {props.teacher}</h2>
          <Link
            to={`/chat/?room=${CourseId}&CourseName=${props.title}&UserName=${localStorage.getItem(
              'userName'
            )}&userId=${localStorage.getItem('userId')}`}
          >
            <h4 className="Course_live_classes">Join Live discussion</h4>
          </Link>
        </div>

        <div className="flex-row">
          <div onClick={DownloadPdf} className="play-btn">
            <i className="fa fa-download" aria-hidden="true"></i>
            <p>Resources</p>
          </div>

          <div className="Bookmarkbtn">
            <i
              onClick={bookmark}
              className={classArray.join(' ')}
              aria-hidden="true"
            ></i>
            <p>BookMark</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDesc;
