import {
  IconCheck,
  IconMessage,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  DragEvent,
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Conversation } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';
import ChatbarContext from '@/components/Chatbar/Chatbar.context';

interface Props {
  conversation: Conversation;
}

export const ConversationComponent = ({ conversation }: Props) => {
  const {
    state: {
      currentDrag,
      selectedConversation,
      messageIsStreaming,
    },
    handleSelectConversation,
    handleUpdateConversation,
    setDragData,
    removeDragData,
  } = useContext(HomeContext);

  const { handleDeleteConversation } = useContext(ChatbarContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const enterTarget = useRef<HTMLElement>();

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectedConversation && handleRename(selectedConversation);
    }
  };

  const handleButtonFocusKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["Space", "Enter"].includes(e.code)) {
      if (!messageIsStreaming)
        handleSelectConversation(conversation);
    }
  }

  const handleDrop = (e: any) => {
    e.currentTarget.style.background = 'none';
    e.preventDefault();
  };

  const handleDragStart = () => {
    setDragData({ data: conversation, type: 'conversation'});
  };

  const highlightDrop = (e: any) => {
    enterTarget.current = e.target;
    e.currentTarget.style.background = '#343541';
    e.preventDefault();
    e.stopPropagation();
  };

  const removeHighlight = (e: any) => {
    if (enterTarget.current === e.target)
      e.currentTarget.style.background = 'none';
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRename = (conversation: Conversation) => {
    if (renameValue.trim().length > 0) {
      handleUpdateConversation(conversation, {
        key: 'name',
        value: renameValue,
      });
      setRenameValue('');
      setIsRenaming(false);
    }
  };

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      handleDeleteConversation(conversation);
    } else if (isRenaming) {
      handleRename(conversation);
    }
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    selectedConversation && setRenameValue(selectedConversation.name);
  };
  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className={`
      relative flex items-center
      ${ !currentDrag || currentDrag.type === 'conversation' && currentDrag.data.id === conversation.id ? 'pointer-events-auto' : 'pointer-events-none' }
    `}>
      {isRenaming && selectedConversation?.id === conversation.id ? (
        <div className="flex w-full items-center gap-3 rounded-lg bg-[#343541]/90 p-3">
          <IconMessage size={18} />
          <input
            className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleEnterDown}
            autoFocus
          />
        </div>
      ) : (
        <div
          className={
            `flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:!bg-[#343541]/90 translate-x-0 z-10
            ${ messageIsStreaming ? 'disabled:cursor-not-allowed' : '' }
            ${ selectedConversation?.id === conversation.id ? '!bg-[#343541]/90' : '' }
          `}
          onClick={() => {
            if (!messageIsStreaming)
              handleSelectConversation(conversation);
          }}
          draggable="true"
          onDrop={handleDrop}
          onDragEnter={highlightDrop}
          onDragLeave={removeHighlight}
          onDragStart={handleDragStart}
          onDragEnd={removeDragData}
          onKeyDown={handleButtonFocusKeyDown}
          tabIndex={0}
        >
          <IconMessage size={18} />
          <div
            className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 ${
              selectedConversation?.id === conversation.id ? 'pr-12' : 'pr-1'
            }`}
          >
            {conversation.name}
          </div>
        </div>
      )}

      {(isDeleting || isRenaming) &&
        selectedConversation?.id === conversation.id && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <SidebarActionButton handleClick={handleConfirm}>
              <IconCheck size={18} />
            </SidebarActionButton>
            <SidebarActionButton handleClick={handleCancel}>
              <IconX size={18} />
            </SidebarActionButton>
          </div>
        )}

      {selectedConversation?.id === conversation.id &&
        !isDeleting &&
        !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <SidebarActionButton handleClick={handleOpenRenameModal}>
              <IconPencil size={18} />
            </SidebarActionButton>
            <SidebarActionButton handleClick={handleOpenDeleteModal}>
              <IconTrash size={18} />
            </SidebarActionButton>
          </div>
        )}
    </div>
  );
};
