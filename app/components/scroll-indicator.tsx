'use client';
import { useEffect, useRef, useState } from 'react';
import { RiArrowDownDoubleFill } from 'react-icons/ri';
import { RiArrowUpDoubleFill } from 'react-icons/ri';

const ScrollIndicator = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;

    const onScroll = () => {
      setCanScrollUp(el.scrollTop > 0);
      setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };

    onScroll();
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {canScrollUp && (
        <div className="absolute z-10 top-[178px] left-0 flex justify-end w-full p-5 pe-10 ">
          <RiArrowUpDoubleFill className="text-customSecondary opacity-70" size={24} />
        </div>
      )}
      {canScrollDown && (
        <div className="absolute z-10 bottom-0 left-0 flex justify-end w-full p-5 pe-10 ">
          <RiArrowDownDoubleFill className="text-customSecondary opacity-70" size={28} />
        </div>
      )}
      <div ref={ref} />
    </>
  );
};

export default ScrollIndicator;
