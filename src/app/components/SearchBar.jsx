'use client'

import {useState} from "react";

export function SearchBar({ search }) {
    const [text, setText] = useState("");

    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    const handleSubmit = (e) => {
        e?.preventDefault();
        // const formData = new FormData(e.target);
        // const text = formData.get('text');
        if(text) search(text);
    }
    return (
        <div
            // onSubmit={handleSubmit}
            className='relative flex flex-row items-center mb-2'
        >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 w-fit pointer-events-none cursor-auto">
        {/*<div className="flex items-center pl-3 w-fit pointer-events-none cursor-auto">*/}
        {/*<div className="-mr-16 pointer-events-none cursor-auto">*/}
            <span className="inline-flex pl-3">
                <svg className="w-7 h-7 text-white/70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </span>
        </div>
        <input
            // type="search"
            type="text"
            spellCheck={false}
            autoComplete="off"
            name="text"
            id="default-search"
            // border border-gray-300 border-gray-600
            className="block w-full p-4 pl-16 py-6
              text-[16px]
              border-none focus:border-none
              rounded-md
              bg-slate-50/10 focus:bg-slate-50/14
              placeholder-white/80 text-white
              shadow-lg"
            placeholder="Search for images..."
            value={text}
            onChange={event => setText(event.target.value)}
            onKeyDown={handleEnterKey}
            required
        />
        <button
            type="clear"
            onClick={() => setText("")}
            className="absolute right-2 bottom-2
            focus:ring-0 focus:outline-none  rounded-lg text-sm py-2
            "
        >
            <svg className="w-10 h-10 fill-white/70 hover:fill-white transition-colors" focusable="false"
                 aria-hidden="true" viewBox="0 0 24 24">
              <path
            d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
        </button>
        {/*<button*/}
        {/*    type="submit"*/}
        {/*    className="text-black font-medium absolute right-2.5 bottom-2.5*/}
        {/*    focus:ring-4 focus:outline-none focus:ring-blue-800  rounded-full text-sm px-3 py-3 aspect-square*/}
        {/*    bg-white border-2 border-black hover:bg-blue-700 "*/}
        {/*>*/}
        {/*    go*/}
        {/*</button>*/}
    </div>)
}