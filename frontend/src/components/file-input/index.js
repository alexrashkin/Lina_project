import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import cn from 'classnames';

const FileInput = ({ label, onChange, file = null, className }) => {
  const [currentFiles, setCurrentFiles] = useState([]);
  const fileInput = useRef(null);

  useEffect(() => {
    if (file) {
      setCurrentFiles(file);
    }
  }, [file]);

  const getBase64 = (files) => {
    const base64Files = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        base64Files.push({'image': reader.result});
        setCurrentFiles(prevFiles => [...prevFiles, reader.result]);
        onChange([...base64Files]);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      }
    });
  }

  return (
    <div className={cn(styles.container, className)}>
      <label className={styles.label}>
        {label}
      </label>
      <input
        className={styles.fileInput}
        type='file'
        ref={fileInput}
        onChange={e => {
          const files = e.target.files;
          getBase64(files);
        }}
        multiple
        style={{ display: 'none' }} // Скрываем стандартный input
      />
      <div
        onClick={() => {
          fileInput.current.click();
        }}
        className={styles.button}
        type='button'
      >
        Выбрать файл
      </div>
      <div className={styles.imageContainer}>
        {currentFiles.map((file, index) => (
          <div
            key={index}
            className={styles.image}
            style={{ backgroundImage: `url(${file})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default FileInput;