"use client"

import {useEffect, useRef, useState} from "react";
import FileInformation from "@/app/utils/constants";
import ContextMenu, {MenuItem} from "@/app/contextMenu/ContextMenu";
import InputComponent from "@/app/contextMenu/InputComponent";

export default function FetchFiles() {


    const [files, setFiles] = useState<FileInformation[]>([])
    const [currentPath, setCurrentPath] = useState("/")
    const [parentPath, setParentPath] = useState("/")

    const storeCopyFileItemsRef = useRef<FileInformation[]>([]);


    const [menu, setMenu] = useState<{
        x:number,
        y:number,
        visible:boolean,
        file:FileInformation | null
    }>({
        x:0,
        y:0,
        visible:false,
        file:null,
    })

    const [showInput, setShowInput] = useState<{
        visible:boolean,
        file:FileInformation | null
    }>({
        visible:false,
        file:null
    })


    function onOpenMenuClick() {
        // opens directory
        if(menu.file && menu.file.isDirectory) setCurrentPath(menu.file.absPath)
        // TODO implement on file click
        console.log("contextMenu Open option click for file is not implemented")
    }

    function onDownloadMenuClick() {
        if(menu.file && menu.file.isFile) onFileClick(menu.file)
        // TODO when user clicks on folder, we need to download it with zip format
    }

    function onCopyMenuClick() {
        if(!menu.file) return
        const currentStoredItems = storeCopyFileItemsRef.current;
        const exists = currentStoredItems.some(item => item.absPath === menu.file?.absPath);
        if(!exists) {
            currentStoredItems.push(menu.file)
        }
        console.log(currentStoredItems)
    }

    function onPasteMenuClick() {

        const url = `http://192.168.0.207:7000/copyFiles`;
        const filesToCopy = storeCopyFileItemsRef.current;
        const destinationTo = menu.file?.parentDirectory;
        fetch(url,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({filesToCopy,destinationTo})
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.log(err));

        // clear the stored copy items
        storeCopyFileItemsRef.current = []
    }

    function onDeleteMenuClick() {

    }


    function onMoveMenuClick() {

    }

    function onDoubleClick(file: FileInformation) {
        setShowInput({
            visible:true,
            file:file,
        })
    }

    const contextMenuItems: MenuItem[] = [
        {
            label:"Open",
            action:() => onOpenMenuClick(),
            icon:null
        },
        {
            label:"Rename",
            action: () => {
                if(menu.file) onDoubleClick(menu.file)

            },
            icon:null
        },
        {
            label:"Download",
            action:() => onDownloadMenuClick(),
            icon:null
        },
        {
            label:"Copy",
            action:() => onCopyMenuClick(),
            icon:null
        },
        {
            label:"Paste",
            action:() => onPasteMenuClick(),
            icon:null
        },
        {
            label:"Move",
            action:() => onMoveMenuClick(),
            icon:null
        },
        {
            label:"Delete",
            action:() => onDeleteMenuClick(),
            icon:null
        },
    ]


    function rightClickHandler(event: React.MouseEvent<HTMLDivElement,MouseEvent>,FileInformation: FileInformation | null) {
        event.preventDefault()
        setMenu({
            x:event.clientX,
            y:event.clientY,
            visible:true,
            file:FileInformation
        })
    }

    function getParentPath(path:string) {
        if(path === "/") return "/"
        const paths = path.split("/").filter(Boolean);
        paths.pop()
        return "/" + paths.join("/")
    }

    function onFolderClick(file: FileInformation) {
        if (file.isDirectory) {
            setCurrentPath(file.absPath);
        }
    }

    function onFileClick(file: FileInformation) {
        const url = `http://192.168.0.207:7000/download?absPath=${encodeURIComponent(file.absPath)}`;

        // otherwise download normally
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName;
        link.click();
    }

    function onNavigateUp() {
        setCurrentPath(parentPath);
    }

    useEffect(() => {
        fetch(`http://192.168.0.207:7000/browse?absPath=${encodeURIComponent(currentPath)}`)
            .then((res) => res.json())
            .then((data) => {
                setFiles(data)
                setParentPath(getParentPath(currentPath));
            })
            .catch(err => console.log(err.message));
    },[currentPath])



    return <div className="flex h-full gap-1">
        <aside className="w-64 bg-gray-400 shadow-sm overflow-auto text-white p-2">
            <div className="flex items-end justify-end">
                <div className="p1 shadow transition cursor-pointer" onClick={onNavigateUp}>
                    <div className="text-4xl">⬆️</div>
                    <div className="truncate text-sm">UP</div>
                </div>
            </div>
        </aside>
        <div className=" flex-1 p-4 overflow-auto grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] auto-rows-[100px] gap-5 content-start items-start">
            {files.map((file:FileInformation) => (
                <div key={file.absPath}>
                    <div onClick={() => {
                        if (file.isFile) {
                            onFileClick(file);
                        } else {
                            onFolderClick(file);
                        }
                    }}  className="p-1 shadow hover:shadow-2xl transition cursor-pointer"
                         onContextMenu={(event) => rightClickHandler(event, file)}

                    >
                        {
                            file.isDirectory ? <div className="text-4xl">📁</div> : <div className="text-4xl">📄</div>
                        }

                    </div>
                    <div onDoubleClick={() => onDoubleClick(file)} className="truncate text-sm p-2">{file.fileName}</div>
                </div>
            ))}
        </div>

        <ContextMenu x={menu.x}
                     y={menu.y}
                     visible={menu.visible}
                     menuItems={contextMenuItems}
                     onClose={() => setMenu((prev) => ({...prev,visible:false}))}/>

        <InputComponent visible={showInput.visible} fileName={showInput.file?.fileName?showInput.file.fileName:""}
                        onClose={() => setShowInput((prev) => ({...prev,visible:false}))}
                        />

    </div>
}