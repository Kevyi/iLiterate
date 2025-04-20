"use client";

import WordBox from "../../components/wordbox.jsx";
import { Button } from "../../components/button.jsx";
import Navbar from "@/components/navbar.jsx";
import LoadingBook from "../../components/loadingbook.jsx";
import { useEffect, useState } from "react";
import {Input} from "@/components/ui/input.jsx"
import axios from 'axios';
import Recorder from "@/components/recorder.jsx"

export default function testPage() {
  const [data, setData] = useState(null);
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(true);

  const [blankOptions1, setBlankOptions1] =  useState([]);
  const [blankOptions2, setBlankOptions2] =  useState([]);

  useEffect(() => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/generate-sentence', {
          prompt: { entry }
        });
        console.log(response.data);
        setData(response.data);
        setBlankOptions1(response.data.blank_options_1);
        setBlankOptions2(response.data.blank_options_2);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);

      }
    };
  
    fetchData();
  }, []);

    const regenerateSentence = (event) => {
        setLoading(true);
        event.preventDefault();
        console.log('Entry:', entry);

        const fetchData = async () => {
            try {
              const response = await axios.post('http://127.0.0.1:5000/api/generate-sentence', {
                prompt: {entry}
              });
              console.log(response.data)
              setData(response.data);
              setBlankOptions1(response.data.blank_options_1);
              setBlankOptions2(response.data.blank_options_2);
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        
    };

  //if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      
      <div className = "flex flex-col items-center mt-20">

         <form onSubmit={regenerateSentence} className = "flex w-fit gap-2 mb-2">
            <Input
                type="text"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Enter your Topic.."
            />
            <Button type="submit"  className = "border self-center">Submit</Button>
        </form>

        <div className="flex justify-evenly items-center">
            <div className="flex">
            {loading ? (
                <LoadingBook width={200} height={200}/>
            ) : (
                <Recorder data = {data}></Recorder>
            )}
            </div>
        </div>
    </div>
    <div className = "flex justify-center gap-4 m-3">
        {/* <WordBox text={sentence} /> */}
        {loading ? "" : <b className = "text-2xl flex items-center justify-center text-[#3c5037]">Option 1: </b>}
    
        {blankOptions1.map((option, index) => (
            <div key={`${index}${option}`}  className = "border-2">
                <WordBox text={option} />
            </div>   
      ))}
    </div>

    <div className = "flex justify-center gap-4 m-3">
        {/* <WordBox text={sentence} /> */}
        {loading ? "" : <b className = "text-2xl flex items-center justify-center text-[#3c5037]">Option 2: </b>}
    
        {blankOptions2.map((option, index) => (
            <div key={`${index}${option}`}  className = "border-2">
                <WordBox text={option} />
            </div>   
      ))}
    </div>
    </> 
  );
}
