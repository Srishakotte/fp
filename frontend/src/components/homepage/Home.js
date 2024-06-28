// import React from 'react';
// import './Home.css';

// const Home = () => {
//   return (
//     <div className="home">
//       <h1>Welcome to the Guest Lecture System</h1>
//       <video width="100%" height="auto" controls autoplay loop muted>
//       <source src="https://vnrvjiet.ac.in/assets/images/Website Hero Video.mp4" type="video/mp4">
// </video>

//       <p>Manage and request guest lectures with ease.</p>
//     </div>
//   );
// };

// export default Home;
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <video autoPlay muted loop className="background-video">
        <source src="https://vnrvjiet.ac.in/assets/images/Website Hero Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Welcome to the Guest Lecture System</h1>
        <p>Manage and request guest lectures with ease.</p>
      </div>
    </div>
  );
};

export default Home;
