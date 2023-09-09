import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/actions";
import Categories from './Categories';
import HomeBanner from './HomeBanner';
import CourseCards from './CourseCards';
import CourseTitle from './CourseTitle';
import { Redirect, NavLink } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import Layout from '../../components/Layout/Layout'
import Recommendation from './Recommendation';
import './CSS/Homepage.css';
import Url from '../../ApiServices/BackendUrl';

const Homepage = (props) => {
  const [isMounted, setIsMounted] = useState(true);
  const [courseLink, setCourseLink] = useState(props.match.params.CourseName);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState("");
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const fd = new FormData();
    const form = {};
    form['userId'] = localStorage.getItem('userId');
    fd.append("userId", localStorage.getItem('userId'));

    if (courseLink === "preferences" && isMounted)
      props.fetchPreferenceCourses(courseLink, form);

    if (isMounted && !props.Courses.length)
      props.fetchCourses();

    return () => {
      setIsMounted(false);
    }
  }, [courseLink, isMounted, props]);

  let BannerImage;
  let data;

  if (props.Courses.length > 0) {
    let CourseArray = props.Courses;

    if (courseLink !== "all" && courseLink !== "preferences") {
      CourseArray = props.Courses.filter(course =>
        course.category === courseLink
      );
    }
    else if (courseLink === "preferences")
      CourseArray = props.PreferenceCourses;

    data = (
      CourseArray.map(item => {
        let rating = [item ? item.rating.ratingFinal : 0];
        if (rating === 0) rating = 1;

        return (
          <NavLink className="productLink" key={item._id} exact to={`/course/${courseLink}/${item._id}`}>
            <CourseCards
              key={item._id}
              title={item.title}
              teacher={item.name}
              img={Url + item.imageurl}
              rating={parseInt(rating)}
              price={item.price}
              ratingtimesUpdated={item.rating.timesUpdated}
            />
          </NavLink>)
      })
    );

    BannerImage = courseLink;
  };

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <NavLink to='/home'>
                Home
              </NavLink>
            </li>
            <li className="breadcrumb-item">
              <NavLink to={`/Home/${courseLink}`} activeStyle={{ textDecoration: 'underline' }}>
                {courseLink}
              </NavLink>
            </li>
          </ol>
        </nav>
        <HomeBanner img={BannerImage} />
        <div className="mt-3 Course-Content">
          <Categories />
          <div className="Course-Content-col">
            <CourseTitle welcomeMessage={"Welcome"} />
            <div className="Course-Content-wrap">
              {data}
            </div>
            <Recommendation />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    Courses: state.filter.Courses,
    PreferenceCourses: state.filter.PreferenceCourse,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCourses: () => dispatch(actionCreators.fetchAsyncCourses()),
    fetchPreferenceCourses: (CourseLink, form) => dispatch(actionCreators.fetchAsyncPreferenceCourse(CourseLink, form))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
