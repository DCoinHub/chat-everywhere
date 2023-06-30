import { useContext, useRef } from 'react';

import HomeContext from '@/pages/api/home/home.context';
import { DragDataType } from '@/types/drag';

interface Props {
  allowedDragTypes?: DragDataType[];
  canDrop?: () => boolean;
  index: number;
  onDrop: (e: React.DragEvent<HTMLElement>, index: number) => void;
}

const DropArea = ({ allowedDragTypes = [], canDrop = () => false, index, onDrop }: Props) => {
  const {
    state: { currentDrag },
  } = useContext(HomeContext);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const isDragTypeAllowed = !!currentDrag && allowedDragTypes.includes(currentDrag.type);

  const handleDrop = (e: any) => {
    onDrop(e, index);
    removeHighlight(e);
  };

  const onDragEnter = (e: any) => {
    if (canDrop() && isDragTypeAllowed) {
      if (indicatorRef.current)
        indicatorRef.current.style.background = '#343541';
    }
  };

  const handleDragLeave = (e: any) => {
    removeHighlight(e);
  };

  const allowDrop = (e: any) => {
    e.preventDefault(); // Ensures drop event occurs
  };

  const removeHighlight = (e: any) => {
    if (indicatorRef.current)
      indicatorRef.current.style.background = 'none';
  }

  return (
    <div
      className="relative h-1"
    >
      <div
        className={`
          absolute h-3 my-auto top-0 bottom-0 left-0 right-0 rounded-lg bg-red-300
          ${ isDragTypeAllowed ? 'z-50' : '-z-10' }
        `}
        ref={indicatorRef}
      />
      <div
        className={`
          absolute h-8 my-auto top-0 bottom-0 left-0 right-0
          ${ isDragTypeAllowed ? 'z-50' : '-z-10' }
        `}
        onDrop={handleDrop}
        onDragEnter={onDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={allowDrop}
      />
    </div>
  );
};

export default DropArea;
