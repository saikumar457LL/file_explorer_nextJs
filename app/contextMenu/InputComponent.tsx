"use client"

import {useEffect} from "react";
import FileInformation from "@/app/utils/constants";

interface InputProps {
    visible: boolean,
    fileName: string,
    onClose: () => void,
}

export default function InputComponent({visible,fileName}: InputProps) {


    if(!visible) return null

    return (
        <div className="p-1 flex flex-col" style={{left:50,top:50}}>
            <input value={fileName} placeholder="Enter file name" />
        </div>
    )
}