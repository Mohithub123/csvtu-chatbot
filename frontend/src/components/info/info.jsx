import React from "react";
import "./info.css";
import logo from "../../csvtu-logo.png";
import swami from "../../swami-vivekanand.png";



export default function Info(props) {
  const { className } = props;
  return (
    <div className="mt-24 ml-10">
      <div className="container mx-auto px-4 py-6">

        {/* College Logo */}
<img 
  src={logo} 
  alt="CSVTU Logo"
  className="college-logo"
/>

        <h1 className="text-2xl font-bold mb-6 text-white">
          CSVTU Chatbot - College Info &#128218;
        </h1>

        <div className="text-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold font-bol mb-4">About CSVTU UTD Bhilai &#127891;</h2>
          <p>
            Chhattisgarh Swami Vivekanand Technical University (CSVTU) is a prestigious University located in Bhilai. CSVTU UTD Bhilai
            offers a wide range of programs in various disciplines including
            engineering, technology, pharmacy.
          </p>
        </div>

        <div className="text-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            Chatbot Features &#128172;
          </h2>

          
          <ul className="list-disc list-inside">
            <li>Instant answers to basic program queries &#128161;</li>
            <li>Customizable responses tailored to CSVTU's requirements &#128187;</li>
            <li>User-friendly interface for easy interaction &#128526;</li>
            <li>Natural Language Processing for better understanding &#128161;</li>
          </ul>
        </div>

        
<img
  src={swami}
  alt="Swami Vivekanand"
  className="swami-img-bottom"
/>
      

        <div className="text-white py-4 text-center mt-6">
          <p>
            &#169; {new Date().getFullYear()} Chhattisgarh Swami Vivekanand Technical University (CSVTU) of engineering, technology, pharmacy &#127891;
          </p>
        </div>
      </div>
    </div>
  );
}
