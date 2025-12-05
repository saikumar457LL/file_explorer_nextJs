
class FileInformation {
    fileName:string
    absPath:string
    parentDirectory:string
    isFile:boolean
    isDirectory:boolean
    fileSize:string
    extension:string
    createdAt:string
    modifiedAt:string
    constructor(fileName:string, absPath:string, parentDirectory:string,isFile:boolean, isDirectory:boolean,fileSize:string ,extension:string,createdAt:string, modifiedAt:string) {
        this.fileName = fileName
        this.absPath = absPath
        this.parentDirectory = parentDirectory
        this.isFile = isFile
        this.isDirectory = isDirectory
        this.fileSize = fileSize
        this.extension = extension
        this.createdAt = createdAt
        this.modifiedAt = modifiedAt
    }
}

export default FileInformation