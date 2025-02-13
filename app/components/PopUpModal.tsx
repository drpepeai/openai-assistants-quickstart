import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

interface PopUpModalProps {
  children: React.ReactNode;
  visible: boolean;
  onClosePopUpModal: () => void;
  classNames?: string;
}
export default function PopUpModal({
  children,
  visible,
  onClosePopUpModal,
  classNames = "",
}: PopUpModalProps): JSX.Element {

  const onClickParent = (e: any) => {
    if (e.target === e.currentTarget) {
      onClosePopUpModal();
    }
  };

  return (
    <Transition.Root show={visible}>
      <Dialog as="div" className="relative z-10" onClose={onClickParent}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity md:hidden" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto md:hidden">
          <div className="flex min-h-full items-end justify-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform overflow-hidden transition-all w-full ${classNames}`}
              >
                <div className=" w-full h-full pb-8 px-2 pt-5">
                  <span className="flex flex-row px-4 justify-between">
                    <p className="text-[#d1d1d1] text-xl font-semibold">
                      Threads
                    </p>
                    <XMarkIcon
                      className="w-6 h-6 text-[#d1d1d1] justify-self-end"
                      onClick={onClosePopUpModal}
                      role="button"
                    />
                  </span>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
