let allCourses = []; // will be saving course data fetched for all tabs
let keys = ["python", "excel", "web", "js", "ds", "aws", "drawing"];

/** @ description the function that fetches courses from the server (local) and renders it into the page
 * also it saves the data in the json file in allCourses to use it in searching
 */
const fetchCourses = async () => {
  let courses = null;
  for (let key of keys) {
    // get json file
    let response = await fetch("http://localhost:3000/" + key);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    courses = await response.json();

    //reset carousel data
    document.getElementsByClassName("carousel-inner-" + key)[0].innerHTML = "";

    //fill carousel with items satisfying search bar
    first = true;
    let arr = [];
    for (let x of courses) {
      arr.push(x);

      newCourse = createCourseElement(x);
      courseContainer = document.createElement("div");
      courseContainer.className += " carousel-item";
      courseContainer.className += " carousel-item" + key;
      courseContainer.innerHTML = newCourse;
      ctitle = x.title.toLowerCase();
      if (first) {
        courseContainer.className += " active";
        first = false;
      }
      document
        .getElementsByClassName("carousel-inner-" + key)[0]
        .appendChild(courseContainer);
    }
    allCourses[key] = arr;
    let items = document.querySelectorAll(".carousel .carousel-item" + key);

    items.forEach((el) => {
      const minPerSlide = Math.min(
        document.getElementsByClassName("carousel-inner-" + key)[0].childNodes
          .length,
        5
      );
      let next = el.nextElementSibling;
      for (var i = 1; i < minPerSlide; i++) {
        if (!next) {
          // wrap carousel by using first child
          next = items[0];
        }
        let cloneChild = next.cloneNode(true);
        el.appendChild(cloneChild.children[0]);
        next = next.nextElementSibling;
      }
    });
  }
  return courses;
};
fetchCourses();

// description : return the number with thousand comma e.g. : 1284 --> 1,284
//@ param x : the number
function numberWithCommas(x) {
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

//description : returns html of course element
// @param course : course data (id , url , .. etc) in object format
function createCourseElement(course) {
  let ratingStars = "";
  let bs = "";
  let rNumber = numberWithCommas(course.raters_no);
  if (course.isBestSeller == "True") {
    bs = `
    <span class="best-seller">Bestseller</span>
    `;
  }
  for (let i = 0; i < Math.floor(course.rating); i++) {
    ratingStars += '<i class="fa-solid fa-star"></i>';
  }

  let x = course.rating;
  if (x - Math.floor(x) >= 0.2)
    ratingStars += '<i class="fa-solid fa-star-half"></i>';

  return `<div class="course">
<img src=${course.imgurl} alt="course image">
<h3 class="course-title">${course.title}</h3>
<p class="instructor">${course.author}</p>
<div class="rating-container">
  <span class="rating">${course.rating}</span>
  ${ratingStars}
  <span class="raters-number"> (${rNumber}) </span>
</div>
<div class="price-container">
  <span class="new-price">E£${course.newPrice} </span>
  <span class="old-price">E£${course.oldPrice} </span>
</div>
${bs}</div>`;
}

const searchForm = document.getElementsByClassName("search-form")[0];
searchForm.addEventListener("submit", search);

// description : search function that filters courses using search string in current tab
// @param : event
function search(event) {
  event.preventDefault();
  // get key from input
  ss = document.getElementsByClassName("input-field")[0].value.toLowerCase();

  a = document.getElementsByClassName("tab-pane active")[0].id; // get id of currently selected  tab
  b = document.getElementsByClassName(`carousel-inner-${a}`)[0]; // get it's corresponding inner carousel

  b.innerHTML = ""; // clear it
  c = allCourses[a]; // get courses related to that tab

  let first = true;

  for (let x of c) {
    // loop on these courses
    newCourse = createCourseElement(x);
    courseContainer = document.createElement("div");
    courseContainer.className += " carousel-item";
    courseContainer.className += " carousel-item" + a;
    courseContainer.innerHTML = newCourse;
    ctitle = x.title.toLowerCase();
    if (ctitle.includes(ss)) {
      // only add those satisfying search string
      if (first) {
        // give active to first course
        courseContainer.className += " active";
        first = false;
      }
      document
        .getElementsByClassName("carousel-inner-" + a)[0]
        .appendChild(courseContainer);
    }
  }

  let items = document.querySelectorAll(".carousel .carousel-item" + a);

  items.forEach((el) => {
    const minPerSlide = Math.min(
      document.getElementsByClassName("carousel-inner-" + a)[0].childNodes
        .length,
      5
    );
    let next = el.nextElementSibling;
    for (var i = 1; i < minPerSlide; i++) {
      if (!next) {
        // wrap carousel by using first child
        next = items[0];
      }
      let cloneChild = next.cloneNode(true);
      el.appendChild(cloneChild.children[0]);
      next = next.nextElementSibling;
    }
  });
}
