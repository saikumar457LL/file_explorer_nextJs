"use client"


import {useEffect} from "react";

export interface MenuItem {
    label: string
    action: () => void
    icon: string|null
}

interface contextMenuProps {
    x:number,
    y:number,
    visible:boolean,
    menuItems:MenuItem[]
    onClose:() => void,
}

export default function ContextMenu({x,y,visible,menuItems,onClose}: contextMenuProps){

    useEffect(() => {
        const handler = ()=> onClose()
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [onClose]);
    if(!visible) return null

    return (
        <div className="fixed pb-1 pt-1 overflow-auto rounded flex flex-col gap-1 shadow bg-white border border-gray-300" style={{top:y,left:x}}>
            {menuItems.map((item,index)=>(
                <div key={index} className="border-b-1 border-gray-300 cursor-pointer pl-1 pt-2 pr-1 hover:shadow-xl hover:bg-gray-400"
                     onClick={() => {
                         item.action()
                         onClose()
                     }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    )
}