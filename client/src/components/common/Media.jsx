import { SERVER_PATH } from "@/utils/const";
import { Image, Modal } from "antd";
import React, { useState } from "react"
import "./Media.css";

export const Media = ({ width, src, type, small }) => {
  const [preview, setPreview] = useState(false);
  const isVideo = (type) => type && type.split("/")[0] == "video";

  return (
    isVideo(type) ?
      <div>
        {small &&
          <div className="media-preview" style={{ width: width }} onClick={() => setPreview(true)}>
            <img src="/img/preview.png" width={16} />
            <span>&nbsp;Play</span>
          </div>
        }
        <video width={width} height="100%" className="media-content" controls={!small} >
          <source src={`${SERVER_PATH}/uploads/${src}`} type={type} />
        </video>
        <Modal 
        className="preview-modal"
        open={preview} 
        onCancel={() => setPreview(false)} 
        width="50%"
        centered
        footer={null}>
          <video width="100%" controls>
            <source src={`${SERVER_PATH}/uploads/${src}`} type={type} />
          </video>
        </Modal>
      </div>
      : <Image
        width={width}
        src={`${SERVER_PATH}/uploads/${src}`}
        fallback="/img/fallback.png" />
  );
};

export default Media