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

  useEffect(() => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/generate-sentence', {
          prompt: { entry }
        });
        console.log(response.data);
        setData(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        await sleep(2000);
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
      
      <div className = "flex flex-col items-center">

        <div className="flex justify-evenly items-center">
            <div className="flex border border-gray-300 rounded-md p-4">
            {loading ? (
                <LoadingBook width={200} height={200}/>
            ) : (
                <Recorder data = {data}></Recorder>
            )}
            </div>
        </div>

        <form onSubmit={regenerateSentence} className = "flex w-fit gap-2">
            <Input
                type="text"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Enter your Topic.."
            />
            <Button type="submit"  className = "border self-center">Submit</Button>
        </form>
    </div>
    </>
  );
}
