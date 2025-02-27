import {
  IconBulbFilled,
  IconCheck,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Prompt } from '@/types/prompt';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';

import HomeContext from '@/pages/api/home/home.context';

import PromptbarContext from '../PromptBar.context';
import { PromptModal } from './PromptModal';

interface Props {
  prompt: Prompt;
}

export const PromptComponent = ({ prompt }: Props) => {
  const {
    state: { currentDrag },
    setDragData,
    removeDragData,
  } = useContext(HomeContext);

  const {
    dispatch: promptDispatch,
    handleUpdatePrompt,
    handleDeletePrompt,
  } = useContext(PromptbarContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleUpdate = (prompt: Prompt) => {
    handleUpdatePrompt(prompt);
    promptDispatch({ field: 'searchTerm', value: '' });
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isDeleting) {
      handleDeletePrompt(prompt);
      promptDispatch({ field: 'searchTerm', value: '' });
    }

    setIsDeleting(false);
  };

  const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleButtonFocusKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["Space", "Enter"].includes(e.code)) {
      setShowModal(true);
    }
    e.stopPropagation();
  }

  const handleDragStart = () => {
    setDragData({ data: prompt, type: 'prompt' });
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
      ${ !currentDrag || currentDrag.type === 'prompt' && currentDrag.data.id ===  prompt.id ? 'pointer-events-auto' : 'pointer-events-none' }
    `}>
      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 translate-x-0 z-10"
        draggable="true"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        onDragStart={handleDragStart}
        onDragEnd={removeDragData}
        onKeyDown={handleButtonFocusKeyDown}
        onMouseLeave={() => {
          setIsDeleting(false);
          setIsRenaming(false);
          setRenameValue('');
        }}
        tabIndex={0}
      >
        <IconBulbFilled size={18} />

        <div
          className={`${
            isDeleting || isRenaming ? 'pr-12' : 'pr-4'
          } relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3`}
        >
          {prompt.name}
        </div>
      </div>

      {(isDeleting || isRenaming) && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <SidebarActionButton handleClick={handleDelete}>
            <IconCheck size={18} />
          </SidebarActionButton>

          <SidebarActionButton handleClick={handleCancelDelete}>
            <IconX size={18} />
          </SidebarActionButton>
        </div>
      )}

      {!isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <SidebarActionButton handleClick={handleOpenDeleteModal}>
            <IconTrash size={18} />
          </SidebarActionButton>
        </div>
      )}

      {showModal && (
        <PromptModal
          prompt={prompt}
          onClose={() => setShowModal(false)}
          onUpdatePrompt={handleUpdate}
        />
      )}
    </div>
  );
};
