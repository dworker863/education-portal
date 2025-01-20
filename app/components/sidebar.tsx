import { FC } from 'react';
import { FaUser } from 'react-icons/fa';
import { Button } from './button';

type TSidebarProps = {
  clickHandler: () => void;
};

const Sidebar: FC<TSidebarProps> = ({ clickHandler }) => {
  return (
    <>
      <div className="fixed right-0 flex justify-center align-middle w-14 h-svh py-2 bg-primary">
        <Button onClick={clickHandler}>
          <FaUser size={22} color="#E11D48" />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
