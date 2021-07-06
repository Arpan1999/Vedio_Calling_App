import React, { useState, useContext, useEffect, useRef } from "react";
import { Input, Button, Tooltip, Modal, message } from "antd";
import Phone from "../../assests/phone.gif";
import Teams from "../../assests/teams.mp3";
import "./Options.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VideoContext from "../../context/VideoContex";
import Hang from "../../assests/hang.svg";
import {
  
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import {
  UserOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { socket } from "../../context/VideoState";

const Options = () => {
  const [idToCall, setIdToCall] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    otherUser,
    setOtherUser,
    leaveCall1,
  } = useContext(VideoContext);

  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };
  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
  }, [call.isReceivingCall]);

  return (
    <div className= "optiondiv">
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>USER NAME</h2>
        <Input
          size="large"
          style={{border:"1.5px solid #000000"}}
          placeholder="Your name"
          prefix={<UserOutlined />}
          maxLength={15}
          suffix={<small>{name.length}/15</small>}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("name", e.target.value);
          }}
          className= "inputgroup"
        />

        <div className="share_options">
          <CopyToClipboard text={me}>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              style={{border:"1px solid #000000"}}
              className= "btn"
              tabIndex="0"
              onClick={() => message.success("Id copied to clipboard successfully!")}
            >
              COPY YOUR ID
            </Button>
          </CopyToClipboard>

          <div className="share_social">
            <WhatsappShareButton
              //url={``}
              title={`Join this meeting with the given code ""\n`}
              separator="Link: "
              className= "share_icon"
            >
              <WhatsappIcon size={26} round />
            </WhatsappShareButton>
            <FacebookShareButton
              //url={``}
              title={`Join this meeting with the given code ""\n`}
              className= "share_icon"
            >
              <FacebookIcon size={26} round />
            </FacebookShareButton>
            
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>CALLING CODE</h2>
        <Input
          placeholder="Enter code to call"
          size="large"
          className= "inputgroup"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          style={{ marginRight: "0.5rem", marginBottom: "0.5rem", border:"1.5px solid #000000"}}
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Enter code of the other user">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />

        {/* {true ? ( */}
        {callAccepted && !callEnded ? (
          <Button
            variant="contained"
            onClick={leaveCall}
            className= "hang"
            tabIndex="0"
          >
            <img src={Hang} alt="hang up" style={{ height: "15px" }} />
            &nbsp; Hang up
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PhoneOutlined />}
            onClick={() => {
              if (name.length) callUser(idToCall);
              else message.error("Enter your name to call!");
            }}
            className= "btn"
            tabIndex="0"
            style = {{border:"1px solid #000000"}}
          >
            CALL
          </Button>
        )}
      </div>

      {call.isReceivingCall && !callAccepted && (
        <>
          <audio src={Teams} loop ref={Audio} />
          <Modal
            title="Incoming Call"
            visible={isModalVisible}
            onOk={() => showModal(false)}
            onCancel={handleCancel}
            footer={null}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <h1>
                {call.name} is calling you:{" "}
                <img
                  src={Phone}
                  alt="phone ringing"
                  className= "phone"
                  style={{ display: "inline-block" }}
                />
              </h1>
            </div>
            <div className= "btnDiv">
              <Button
                variant="contained"
                className= "answer"
                color="#29bb89"
                icon={<PhoneOutlined />}
                onClick={() => {
                  answerCall();
                  Audio.current.pause();
                }}
                tabIndex="0"
              >
                RECIEVE
              </Button>
              <Button
                variant="contained"
                className= "decline"
                icon={<PhoneOutlined />}
                onClick={() => {
                  setIsModalVisible(false);
                  Audio.current.pause();
                }}
                tabIndex="0"
              >
                DECLINE
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Options;