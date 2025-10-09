'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Button } from './button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TestForm from './test-form';

type TTestFormWrapperProps = {
  testId: string;
  deleteTestHandler: () => void;
  setTestId: Dispatch<SetStateAction<string | null>>;
};

const TestFormWrapper: FC<TTestFormWrapperProps> = ({ testId, deleteTestHandler, setTestId }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div>
      <div className="flex mb-5">
        <Button variant="custom" className="ml-4" onClick={() => setShowEditForm(!showEditForm)}>
          <FaEdit size={22} />
          <span className="ml-2">Редактировать</span>
        </Button>
        <Button
          variant="custom"
          className="ml-4"
          onClick={() => {
            setTestId(testId);
            deleteTestHandler();
          }}
        >
          <FaTrash size={16} />
          <span className="ml-2">Удалить</span>
        </Button>
      </div>
      {showEditForm && <TestForm mode="edit" testId={testId} />}
    </div>
  );
};

export default TestFormWrapper;
