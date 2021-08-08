import React, { useState } from 'react'
import ReactDOM from 'react-dom'
// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export default function Dropzone(props) {
  const [files, setFiles] = useState([])
  return (
    <div className='App'>
      <FilePond
        files={files}
        allowMultiple={true}
        onupdatefiles={(fileItems) => {
          // Set currently active file objects to this.state
          setFiles(fileItems)
          const files = fileItems.map((fileItem) => fileItem.file)
          props.onFileUpload(files)
        }}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  )
}
