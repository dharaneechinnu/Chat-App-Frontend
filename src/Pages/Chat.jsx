import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChatContext } from '../Context/ChatContent';
import { Container, Stack } from 'react-bootstrap';
import UsersChats from '../Compontes/Chat/UsersChats';
import { AuthContext } from '../Context/AuthContext';
import PotentialChat from '../Compontes/Chat/PotentialChat';
import ChatBox from '../Compontes/Chat/ChatBox';
import NavBar from '../Compontes/NavBar';

const ChatContainer = () => {
  const navigator = useNavigate();
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatLoading, updataCurrentChat } = useContext(ChatContext);
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigator('/login');
    }
  }, [navigator]);

  const handleChatClick = (chat) => {
    updataCurrentChat(chat);
    setIsChatBoxVisible(true);
  };

  const handleGoBack = () => {
    updataCurrentChat(null); // Clear current chat when going back
    setIsChatBoxVisible(false);
  };

  return (
    <StyledContainer>
      <PotentialChat />
      {userChats?.length < 1 ? null : (
        <ChatWrapper>
          <ContactsWrapper className={isChatBoxVisible ? 'hide-mobile' : ''}>
            {isUserChatLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => (
              <div key={index} onClick={() => handleChatClick(chat)}>
                <UsersChats chat={chat} user={user} />
              </div>
            ))}
          </ContactsWrapper>
          <ChatBoxWrapper className={!isChatBoxVisible ? 'hide-mobile' : ''}>
            <ChatBox handleGoBack={handleGoBack}/>
          </ChatBoxWrapper>
        </ChatWrapper>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  /* Add any necessary styling for the Container */
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContactsWrapper = styled(Stack)`
  flex-grow: 0;
  padding-right: 15px; /* Example padding */

  &.hide-mobile {
    display: none;
  }

  @media (min-width: 768px) {
    display: block !important;
  }
`;

const ChatBoxWrapper = styled.div`
  flex-grow: 1;

  &.hide-mobile {
    display: none;
  }

  @media (min-width: 768px) {
    display: block !important;
  }
`;

export default ChatContainer;
