import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FileUpload from './FileUpload.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FileUpload />
  </StrictMode>,
)
