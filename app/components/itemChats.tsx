'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from './modal';
import { a } from '../config';
import Success from './success';
import dayjs from 'dayjs';
import {
  ChatBubbleLeftEllipsisIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { truncate } from '../helpers';

interface ChatMessage {
  id: number;
  senderId: number;
  sender: IUser;
  content: string;
  createdAt: Date;
}

interface ItemChat {
  id: number;
  itemId: number;
  item: IItem;
  title: string;
  participants: IUser[];
  messages: ChatMessage[];
  createdAt: Date;
}

export default function ItemChats() {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [showStartChat, setShowStartChat] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItem>();
  const [availableItems, setAvailableItems] = useState<IItem[]>([]);
  const [chats, setChats] = useState<ItemChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<ItemChat>();
  const [message, setMessage] = useState('');
  const [chatStartSuccess, setChatStartSuccess] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEnlargedPhoto, setShowEnlargedPhoto] = useState(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<IUser>();

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    return user;
  };

  const getAvailableItems = async () => {
    try {
      const { data: response } = await a.get('/items/unclaimed');
      setAvailableItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const getChats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { data: response } = await a.get(
        `/chats/getChatsByUserId/${user.id}`,
      );
      setChats(response);
      if (response.length > 0 && !selectedChat) {
        setSelectedChat(response[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const startNewChat = async () => {
    try {
      if (!selectedItem) return;
      const user = getCurrentUser();
      // Prevent creating a chat with oneself
      if (user.id === selectedItem.authorId) {
        alert('You cannot create a chat about your own item');
        return;
      }
      const { data: response } = await a.post('/chats', {
        participantIds: [user.id, selectedItem.authorId],
        title: `Chat about ${selectedItem.itemName}`,
        itemId: selectedItem.id,
      });
      if (response) {
        setShowStartChat(false);
        setSelectedItem(undefined);
        setItemSearch('');
        setChatStartSuccess(true);
        getChats();
        const timer = setTimeout(() => setChatStartSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { data: response } = await a.post(
        `/chats/sendMessage/${selectedChat.id}`,
        {
          message: message,
          senderId: user.id,
        },
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const getMessageDate = (createdAt: Date) => {
    const messageDate = dayjs(createdAt);
    const today = dayjs();
    const daysAgo = today.diff(messageDate, 'day');

    if (daysAgo === 0) {
      return `Today at ${messageDate.format('hh:mm A')}`;
    } else if (daysAgo === 1) {
      return `Yesterday at ${messageDate.format('hh:mm A')}`;
    } else {
      return messageDate.format('MM/DD/YYYY hh:mm A');
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      setCurrentUser(user);
      getAvailableItems();
      getChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChat?.id) {
        getChats();
      }
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id]);

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='absolute top-0 right-0 pointer-events-none'>
        <Success
          title={'Success!'}
          description={'Chat started successfully.'}
          show={chatStartSuccess}
          setShow={setChatStartSuccess}
        />
      </div>

      <Modal open={showStartChat} setOpen={setShowStartChat}>
        <div className='flex flex-col space-y-4'>
          <div>
            <label className='block text-sm font-bold text-gray-900 mb-2'>
              Search Items
            </label>
            <input
              type='text'
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder='Search by item name...'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
            />
          </div>

          <div className='flex flex-col space-y-2 max-h-96 overflow-auto'>
            {availableItems
              .filter((item) =>
                item.itemName.toLowerCase().includes(itemSearch.toLowerCase()),
              )
              .map((item, i) => (
                <div
                  key={i}
                  className={`rounded-md border border-gray-300 p-3 ${currentUser?.id === item.authorId ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:bg-gray-50 cursor-pointer'}`}
                  onClick={() =>
                    currentUser?.id !== item.authorId && setSelectedItem(item)
                  }
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-900'>
                        {item.itemName}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {truncate(item.description, 50)}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        By: {item.author?.name || 'Unknown'}
                      </p>
                    </div>
                    <div
                      className={`font-semibold h-fit px-2 py-1.5 text-sm rounded-md ${
                        selectedItem?.id === item.id
                          ? 'text-gray-700 border border-gray-300'
                          : currentUser?.id === item.authorId
                            ? 'text-gray-400 bg-gray-200'
                            : 'text-white bg-indigo-500 hover:bg-indigo-600'
                      }`}
                    >
                      {selectedItem?.id === item.id
                        ? 'Selected'
                        : currentUser?.id === item.authorId
                          ? 'Your Item'
                          : 'Select'}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={startNewChat}
            disabled={
              !selectedItem || currentUser?.id === selectedItem?.authorId
            }
            className='bg-indigo-500 disabled:bg-gray-300 w-full text-center hover:bg-indigo-600 rounded-md text-white font-semibold py-2 px-3.5 hover:cursor-pointer'
          >
            Start Chat
          </button>
        </div>
      </Modal>

      <Modal open={showItemModal} setOpen={setShowItemModal}>
        {selectedChat?.item && (
          <div className='flex flex-col space-y-4'>
            <div>
              <p className='text-lg font-bold text-gray-900'>
                {selectedChat.item.itemName}
              </p>
              <p className='text-sm text-gray-600 mt-2'>
                By: {selectedChat.item.author?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-1'>
                Description
              </p>
              <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                {selectedChat.item.description}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-1'>Status</p>
              <p className='text-sm text-gray-600'>
                {selectedChat.item.claimed ? 'Claimed' : 'Unclaimed'}
              </p>
            </div>
            {selectedChat.item.photos &&
              selectedChat.item.photos.length > 0 && (
                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>
                    Photos(Click to enlarge)
                  </p>
                  <div className='grid grid-cols-3 gap-2'>
                    {selectedChat.item.photos.map((photo) => {
                      const photoSrc = `data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`;
                      return (
                        <img
                          key={photo.id}
                          src={photoSrc}
                          alt='item'
                          onClick={() => {
                            setEnlargedPhoto(photoSrc);
                            setShowEnlargedPhoto(true);
                          }}
                          className='w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity'
                        />
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      <Modal open={showEnlargedPhoto} setOpen={setShowEnlargedPhoto}>
        <div className='flex items-center justify-center'>
          <img
            src={enlargedPhoto}
            alt='enlarged item'
            className='max-w-full max-h-[70vh] object-contain rounded-md'
          />
        </div>
      </Modal>

      <div className='rounded-lg border border-gray-300 bg-white w-full flex-1 flex'>
        {/* Sidebar */}
        <div className='max-w-[20rem] flex flex-col w-fit h-full border-r border-gray-300'>
          <div className='px-4 py-4 border-b border-gray-300 w-full'>
            <button
              onClick={() => setShowStartChat(true)}
              className='text-black flex justify-center hover:cursor-pointer px-4 py-2 text-sm font-semibold w-full text-center mb-2.5 rounded-md border border-gray-300 hover:bg-gray-100'
            >
              <PlusIcon className='w-5 h-5' />
            </button>
            <p className='text-sm text-center font-semibold text-gray-700 px-2'>
              Chats
            </p>
          </div>

          <div className='flex flex-col overflow-auto flex-1'>
            {chats.length > 0 ? (
              chats.map((chat, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedChat(chat)}
                  className={`px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <p className='font-semibold text-sm text-gray-900'>
                    {chat.item.itemName}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {dayjs(chat.createdAt).format('MM/DD/YYYY')}
                  </p>
                </div>
              ))
            ) : (
              <div className='p-4 text-gray-500 text-sm'>No chats yet</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className='flex flex-col w-full h-full'>
          {selectedChat ? (
            <>
              <div className='border-b border-gray-300 p-4 flex justify-between items-start'>
                <div>
                  <p className='font-semibold text-lg text-gray-900'>
                    {selectedChat.item.itemName}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    Participants:{' '}
                    {selectedChat.participants.map((p) => p.name).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => setShowItemModal(true)}
                  className='flex w-fit items-center gap-2 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold hover:cursor-pointer'
                >
                  <EyeIcon className='w-4 h-4' />
                  View Item
                </button>
              </div>

              <div className='flex-1 overflow-auto text-black p-6 space-y-4'>
                {selectedChat.messages && selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((msg, i) => (
                    <div key={i} className='flex flex-col'>
                      <div
                        className={`max-w-[75%] py-2 px-3 rounded-md text-base font-medium whitespace-pre-wrap ${
                          msg.senderId === currentUser?.id
                            ? 'ml-auto bg-indigo-100'
                            : 'mr-auto bg-gray-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span
                        className={`text-xs text-gray-500 mt-1 ${
                          msg.senderId === currentUser?.id ? 'text-right' : ''
                        }`}
                      >
                        {msg.sender?.name} • {getMessageDate(msg.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className='text-center text-gray-500 my-auto'>
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className='p-6 border-t border-gray-300'>
                <div className='border border-gray-300 rounded-md'>
                  <div className='flex items-start w-full'>
                    <div className='mt-[1.15rem] mb-4 ml-3'>
                      <ChatBubbleLeftEllipsisIcon className='size-5 text-gray-400' />
                    </div>
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        adjustHeight();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder='Ask about this item...'
                      rows={1}
                      className='flex-1 resize-none overflow-hidden rounded-md block focus:outline-none w-full bg-white py-4 px-2.5 text-base text-gray-900 placeholder:text-gray-400'
                      style={{ overflowY: 'hidden', lineHeight: '1.5' }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-full text-gray-500'>
              {chats.length > 0
                ? 'Select a chat to view messages'
                : 'No chats yet. Start one to ask about an item!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
