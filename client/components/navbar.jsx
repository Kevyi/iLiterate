"use client";


import Image from 'next/image';
import tempImage from "@/public/sjsu image.png"
import { useEffect, useState } from "react";


export default function Navbar(){


  const [isShrunk, setIsShrunk] = useState(false);




  //Weird glitch where it spazzes out at certain points or scrolls.
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };


    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);








const navBarAnimation = `transition-all duration-300 ease-in-out ${isShrunk ? "py-2" : "py-4"}`;
const buttonStyling = "bg-green-500 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8 px-0";


   return <>
      <div className = {`${navBarAnimation} sticky top-0 z-10 bg-slate-900 border-b border-b-blue-500/50 font-sans`}>
        <div className = {`${isShrunk ? "mr-auto ml-20" : ""} transition-all duration-700 ease-in-out `}>
            {/*${isShrunk ? "p-3" : "p-2"} */}
            {/*Component wrapper in navbar.*/}
            {/* Removed container TailwindCSS. */}
            <div className = "p-5 flex h-14 items-center ">


                {/*This is where the Logo and webpage name goes.*/}
                <div className = "mr-4 hidden md:flex">
                  <a href = "/home" className = "mr-4 flex items-center gap-2 lg:mr-6">
                    {/*Click logo or name to go to home.*/}
                    <Image src={tempImage} className = "mr-5"alt="Temp" width={30} height={30} />
   
                    <span className = "hidden font-bold lg:inline-block text-2xl text-white"> iLiterate</span>


                  </a>
                 
                  {/*Lists a bunch of navigation*/}
                  <nav className = "flex items-center gap-4 text-sm xl:gap-6">
                    <a className = "transition-colors hover:text-foreground/80 text-foreground/80" href = "somewhere">
                        <span className = "font-semibold text-yellow-500">
                          Nav 1
                        </span>
                    </a>
                  </nav>
                </div>

            </div>
        </div>
      </div>    
      {/*Navbar wrapper.*/}
     
   


   </>
}

