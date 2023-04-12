import React, { useState } from 'react';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-react';
import { toast } from 'react-hot-toast';

export const FeedbackContainer: React.FC = () => {
  const [isThumbsUp, setIsThumbsUp] = useState<boolean | null>();

  const submitFeedback = () => {
    setIsThumbsUp(isThumbsUp);
    toast.remove('feedback-toast');
    toast.success('Thank you for your feedback!');
  };

  const thumbButtonOnClick = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } pointer-events-auto flex w-full max-w-md rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-500`}
        >
          <div className="flex flex-col p-4 text-sm">
            <p className="">
              Thank you for your feedback! Can we upload your current conversation to
              our server for product improvement purposes? We will never share
              your data with anyone.
            </p>
            <div className="mt-2 flex flex-row justify-between">
              <button
                type="button"
                className="rounded-md border border-neutral-500 px-2 py-1 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
                onClick={() => submitFeedback()}
              >
                Sure!
              </button>
              <button
                type="button"
                className="rounded-md border border-neutral-500 px-2 py-1 text-neutral-900 shadow hover:bg-neutral-300 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:text-black dark:hover:bg-neutral-300"
                onClick={() => toast.remove('feedback-toast')}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 999999,
        id: 'feedback-toast',
      },
    );
  };

  return (
    <>
      <div className="mt-3 flex flex-row">
        <button
          className={`cursor-pointer text-gray-500 hover:text-gray-300 ${
            isThumbsUp === true ? 'text-transparent hover:text-transparent' : ''
          }`}
          onClick={() => {
            setIsThumbsUp(true);
            thumbButtonOnClick();
          }}
        >
          <IconThumbUp
            size={18}
            fill={isThumbsUp === true ? 'lightgray' : 'none'}
          />
        </button>
        <button
          className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-300 ${
            isThumbsUp === false ? 'text-transparent hover:text-transparent' : ''
          }`}
          onClick={() => {
            setIsThumbsUp(false);
            thumbButtonOnClick();
          }}
        >
          <IconThumbDown
            size={18}
            fill={isThumbsUp === false ? 'lightgray' : 'none'}
          />
        </button>
      </div>
    </>
  );
};
