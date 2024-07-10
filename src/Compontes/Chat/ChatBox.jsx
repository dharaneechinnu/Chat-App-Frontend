/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContent";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react'; // Import EmojiPicker
import { MdEmojiEmotions, MdArrowBack } from "react-icons/md";
import styled from 'styled-components';

const ChatBox = ({handleGoBack}) => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages = [], isMessageLoading, sendtextmessage } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [textmessage, settextmessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Ref to input element
  const emojiPickerRef = useRef(null); // Ref to emoji picker element
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();  // Scroll to bottom on initial render
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior of form submission
      handleSendMessage();
    }
  };

  const handleEmojiClick = (event) => {
    settextmessage(prevMessage => prevMessage + event.emoji); // Append emoji to message
    setShowEmojiPicker(false); // Hide emoji picker after selection
    inputRef.current.focus(); // Focus on the input after selecting an emoji
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker); // Toggle emoji picker visibility
  };

  const handleSendMessage = () => {
    if (textmessage.trim() !== "") {
      sendtextmessage(textmessage, user, currentChat._id);
      settextmessage(""); // Clear the input after sending the message
      scrollToBottom(); // Ensure scroll to bottom after sending a message
    }
  };

  const handleInputChange = (e) => {
    settextmessage(e.target.value); // Update textmessage state
  };

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !event.target.closest('.emoji')) {
      setShowEmojiPicker(false); // Hide emoji picker if click is outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation Selected yet...
      </p>
    );
  }

  if (isMessageLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Loading Chat...
      </p>
    );
  }



  return (
    <ChatBoxWrapper>
      {!recipientUser ? null : (
        <Stack gap={5} className="chat-box">
          <div className="chat-header">
            <MdArrowBack className="arrow" onClick={handleGoBack} />
            <strong>{recipientUser?.name}</strong>
          </div>
          <Stack gap={3} className="messages">
            {messages && messages.map((message, index) => (
              <Stack
                key={index}
                className={`${
                  message?.senderId !== user?._id
                    ? "message align-self-start flex-grow-0"
                    : "message self align-self-end flex-grow-0"
                }`}
              >
                <span>{message.text}</span>
                <span className="message-footer">
                  {moment(message.createdAt).calendar()}
                </span>
              </Stack>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
            <input
              ref={inputRef}
              type="text"
              value={textmessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="form-control"
              placeholder="Type your message..."
            />
            <div className="emoji" onClick={toggleEmojiPicker}>
              <MdEmojiEmotions className='em' />
            </div>
            {showEmojiPicker && (
              <EmojiPickerWrapper ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </EmojiPickerWrapper>
            )}
            <button className="send-btn" onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
              </svg>
            </button>
          </Stack>
        </Stack>
      )}
    </ChatBoxWrapper>
  );
};

const ChatBoxWrapper = styled.div`
  width: 100%;

  .chat-box {
    max-width: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: black;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: auto;

    .chat-header {
      .arrow {
        display: block; /* Show arrow icon */
      }
    }
  }

  @media (max-width: 480px) {
    width: 100%;
    margin: auto;

    .chat-header {
      .arrow {
        display: block;
        position: relative;
        right: 100px;
      }
    }
  }

  /* Default styles for larger screens */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Hide arrow on screens larger than 1200px */
  @media screen and (min-width: 1200px) {
    .chat-header .arrow {
      display: none;
    }
  }

  .chat-input {
    position: relative;
    width: 100%;
  }

  .messages {
    height: calc(100vh - 200px); /* Adjust this value as per your layout */
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: black;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 4rem;
  right: 4rem;
  z-index: 10;
`;

export default ChatBox;
