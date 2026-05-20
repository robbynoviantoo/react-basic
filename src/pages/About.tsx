import { useEffect } from "react";

const About = () => {
    useEffect(() => {
      document.title = "About";
    }, []);
  
  return (
    <div className="h-[1500px] flex items-center justify-center">
      <h1 className="text-4xl font-bold">About Us</h1>
    </div>
  )
}

export default About
