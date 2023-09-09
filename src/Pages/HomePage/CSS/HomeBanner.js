import React from "react";
import { Link } from 'react-router-dom';
import './CSS/HomeBanner.css';
import Url from '../../ApiServices/BackendUrl';

const HomepageBanner = (props) => {
  let text = null;
  let Banner = null;

  if (props.img === 'all') {
    text = (<p className="Banner-text">Best place to <br />learn new things</p>);
    Banner = (<div className="BannerSection">
      <img className="BannerImage"
        src={Url + props.img + ".jpg"} alt="banner1" />
    </div>);
  }

  if (props.img) {
    Banner = (<div className="BannerSection">
      <img className="BannerImage"
        src={"https://shelp-webapp.herokuapp.com/" + props.img + ".jpg"} alt="banner1" />
    </div>);
  }

  if (props.img === null) {
    text = (
      <div className="Teacher-banner">
        <p className="Teacher-text">Share Your Knowledge <br />with the whole World!</p>
        <Link to="teacher">
          <button className="createCourse">Create New Course</button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {Banner}
      {text}
    </>
  );
}

export default HomepageBanner;
