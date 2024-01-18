import { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import cn from 'classnames'

const VideoFileInput = ({ label, onChange, file = null, className, accept = 'image/*,video/*' }) => {
  const [currentFile, setCurrentFile] = useState(file)
  const videoFileInput = useRef(null)

  useEffect(() => {
    if (file !== currentFile) {
      setCurrentFile(file)
    }
  }, [file])

  const getBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setCurrentFile(reader.result)
      onChange(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <div className={cn(styles.container, className)}>
      <label className={styles.label}>
        {label}
      </label>
      <input
        className={styles.videoFileInput}
        type='file'
        ref={videoFileInput}
        onChange={e => {
          const file = e.target.files[0]
          getBase64(file)
        }}
        accept={accept}
      />
      <div
        onClick={() => {
          videoFileInput.current.click()
        }}
        className={styles.button}
        type='button'
      >
        Выбрать файл
      </div>
      {currentFile && (
        <div className={styles.mediaContainer}>
            <video className={styles.video} controls>
              <source src={currentFile} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
        </div>
      )}
    </div>
  )
}

export default VideoFileInput