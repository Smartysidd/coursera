import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import CartCard from './CartCard';
import './CSS/Cart.css';
import Layout from '../../components/Layout/Layout';
import EmptyCart from './EmptyCart';
import Url from '../../ApiServices/BackendUrl';

function Cart(props) {
  const [state, setState] = useState({
    CourseLink: props.match.params.CourseName,
    Courses: null,
    loading: true,
    redirect: null,
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      const mockData = [
        {
          _id: '1',
          title: 'Course 1',
          name: 'Teacher 1',
          imageurl: 'image1.jpg',
          rating: { ratingFinal: 4 },
          price: 19.99,
        },
        {
          _id: '2',
          title: 'Course 2',
          name: 'Teacher 2',
          imageurl: 'image2.jpg',
          rating: { ratingFinal: 5 },
          price: 29.99,
        },
      ];

      setState({
        ...state,
        Courses: mockData,
        loading: false,
      });
    }, 1000); // Simulated delay of 1 second
  }, [state.CourseLink]);

  const remove = (id) => {
    const updatedCourse = state.Courses.filter((course) => course._id !== id);
    setState({
      ...state,
      Courses: updatedCourse,
    });
  };

  if (state.redirect !== null) {
    return <Redirect to={state.redirect} />;
  }

  let noOfCourses = null;
  let classes = [];
  let title = null;

  let data = (
    <Loader
      type="Puff"
      color="#08BD80"
      height={50}
      width={50}
      className="loader"
    />
  );

  if (!state.loading) {
    let CourseArray = state.Courses.slice(0);
    noOfCourses = CourseArray.length;

    if (CourseArray.length === 0) {
      data = (
        <div className="empty-center">
          <EmptyCart />
        </div>
      );
    } else {
      title = (
        <div>
          <div className="row">
            <div className="col-12">
              <p className="CartTitle">My Courses</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="CartSubTitle">
                You have {noOfCourses} Courses!
              </p>
            </div>
          </div>
        </div>
      );

      classes = ['flex-row'];
      data = CourseArray.map((item, index) => (
        <CartCard
          key={index}
          title={item.title}
          teacher={item.name}
          img={Url + item.imageurl}
          rating={parseInt(item.rating.ratingFinal)}
          courseId={item._id}
          price={item.price}
          Link={`/course/${state.CourseLink}/${item._id}`}
          remove={() => remove(item._id)}
        />
      ));
    }
  }

  return (
    <Layout>
      <div className="container">
        {title}
        <div className={classes.join(' ')}>{data}</div>
      </div>
    </Layout>
  );
}

export default Cart;
