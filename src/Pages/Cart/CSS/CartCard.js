import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Cart.css';
import Rating from '../CoursePage/Rating';

function CartCard(props) {
  return (
    <div className="CartContent">
      <div className="CardMain">
        <Link className="productLink" to={props.Link}>
          <div className="CardImageParent">
            <img src={props.img} alt="course" />
          </div>
        </Link>
        <div className="CardSideContent">
          <p className="CourseTitle">{props.title}</p>
          <div className="CardParent1">
            <p className="CourseTeacher">By {props.teacher}</p>
            <p onClick={props.remove} className="CourseRemove">
              Remove
            </p>
          </div>
          <Link className="productLink" to={props.Link}>
            <div className="CardParent2">
              <span className="CourseRating">{props.rating}</span>
              <span className="Coursestar">
                <Rating rating={props.rating} edit={false} />
              </span>
              <p className="CourseSave">Go to Course</p>
            </div>
          </Link>
          <div className="CardParent3">
            <p className="CoursePrice">₹ {props.price}</p>
            <p className="CourseWhishlist">Move to Wishlist</p>
          </div>
          <div className="CourseBuy">
            <Link to={`/stripe/${props.courseId}`} style={{ textDecoration: "none" }}>
              <p>Buy Now</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
