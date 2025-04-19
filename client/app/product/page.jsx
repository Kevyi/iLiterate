"use client";

import WordBox from "../../components/wordbox.jsx";
import { Button } from "../../components/button.jsx";
import Navbar from "@/components/navbar.jsx";

export default function testPage(){
    const text = "Generated text goes here! Hello, 123";
    return (
    <>
        <Navbar></Navbar>
        <div>test</div>
        <div className="flex justify-evenly items-center border border-gray-300 rounded-md p-4">
            <div className="flex">
                <WordBox text={text} />
            </div>
        </div>
    </>
    )
}
