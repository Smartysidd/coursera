import ReactStars from "react-rating-stars-component";
import React from "react";
import AuthServices from "../../ApiServices/auth.service";

const Rating = (props) => {
  const ratingChanged = (newRating) => {
    const form = {};
    form['courseId'] = props.CourseId;
    form['rating'] = newRating;

    AuthServices.Rating(form)
      .then((response) => {
        console.log("Rating", response);
        alert("Your rating has been successfully added");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ReactStars
      edit={props.edit}
      count={5}
      onChange={ratingChanged}
      size={24}
      isHalf={true}
      value={props.rating || 0} // Use 0 as the default value if props.rating is undefined
      activeColor="#FF9529"
    />
  );
};

export default Rating;
