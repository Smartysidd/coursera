import React, { useState } from 'react';
import axios from '../../ApiServices/axiosUrl';
import CourseTitle from './CourseTitle';
import { Redirect } from 'react-router-dom';
import Alert from '../Auth/Forms/alert'
import Layout from '../../components/Layout/Layout';

const Preference = () => {
  const [interest, setInterest] = useState([]);
  const userId = localStorage.getItem('userId');

  const [courses, setCourses] = useState({
    "Web Development": {
      touched: false,
    },
    "Web Designing": {
      touched: false,
    },
    "React": {
      touched: false,
    },
    "ML": {
      touched: false,
    },
    "Photography": {
      touched: false,
    },
    "NodeJs": {
      touched: false,
    },
  });

  const [redirect, setRedirect] = useState(null);

  const [alert, setAlert] = useState({
    valid: false,
    msg: "",
    alertType: "",
  });

  const [alertPressed, setAlertPressed] = useState(false);

  const token = localStorage.getItem('user');

  const alertError = (alertmsg, alertType) => {
    const updatedAlert = { ...alert };
    updatedAlert.msg = alertmsg;
    updatedAlert.valid = true;
    updatedAlert.alertType = alertType;
    setAlert(updatedAlert);
  }

  const categoryHandler = (courseName) => {
    if (courses[courseName].touched) {
      const updatedCourses = { ...courses };
      updatedCourses[courseName].touched = false;
      setCourses(updatedCourses);
      const index = interest.indexOf(courseName);
      if (index > -1) interest.splice(index, 1);
    } else {
      const updatedCourses = { ...courses };
      updatedCourses[courseName].touched = true;
      setCourses(updatedCourses);
      interest.push(courseName);
    }
    setInterest([...interest]);
  }

  const sumbitHandler = () => {
    const formData = { "interest": interest, 'userId': userId };
    setAlertPressed(true);
    setTimeout(() => setAlertPressed(false), 3000);
    axios.post("/home/interests/", formData, {
      headers: {
        Authorization: 'Bearer ' + token + " " + localStorage.getItem('ref_token')
      }
    })
      .then(response => {
        console.log("Preference Added");
        alertError("Preferences Added", "success");
        setRedirect('/home/preferences');
      })
      .catch(error => {
        console.log(error.response);
        if (error.response.statusText === "Internal Server Error") {
          setRedirect('/login');
        }
      })
  }

  let alertContent = null;

  if (redirect) {
    return <Redirect to={redirect} />
  }

  var webdev, webdesigning, react, ml, photo, nodejs;

  if (courses["Web Development"].touched) {
    webdev = ['touched']
  } else {
    webdev = ['']
  }

  if (courses["Web Designing"].touched) {
    webdesigning = ['touched']
  } else {
    webdesigning = ['']
  }

  if (courses["React"].touched) {
    react = ['touched']
  } else {
    react = ['']
  }

  if (courses["ML"].touched) {
    ml = ['touched']
  } else {
    ml = ['']
  }

  if (courses["Photography"].touched) {
    photo = ['touched']
  } else {
    photo = ['']
  }

  if (courses["NodeJs"].touched) {
    nodejs = ['touched']
  } else {
    nodejs = ['']
  }

  if (alert.valid) {
    alertContent = (<Alert value={alertPressed}
      alertMsg={alert.msg}
      alertType={alert.alertType} />)
  }

  return (
    <Layout>
      <div className="container">
        {alertContent}
        <div className="title">
          <CourseTitle welcomeMessage={"Choose Your interests,"} />
        </div>
        <div className="Preference-buttons">
          <button className={webdev.join(' ')} onClick={() => categoryHandler("Web Development")}> Development</button>
          <button className={webdesigning.join(' ')} onClick={() => categoryHandler("Web Designing")}> Designing</button>
          <button className={react.join(' ')} onClick={() => categoryHandler("React")}> React</button>
          <button className={ml.join(' ')} onClick={() => categoryHandler("ML")}> ML</button>
          <button className={photo.join(' ')} onClick={() => categoryHandler("Photography")}> Photography</button>
          <button className={nodejs.join(' ')} onClick={() => categoryHandler("NodeJs")}> Node JS</button>
        </div>
        <div className="SumbitBtn">
          <button onClick={sumbitHandler}>SUMBIT</button>
        </div>
      </div>
    </Layout>
  );
}

export default Preference;
