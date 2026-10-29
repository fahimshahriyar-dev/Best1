import React, { FC, useRef, useEffect } from 'react'
import { Modal, Box } from "@mui/material"
import gsap from "gsap"

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    component: any;
    setRoute?: (route: string) => void;
}

const CustomModal: FC<Props> = ({ open, setOpen, setRoute, component:Component }) => {
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && boxRef.current) {
            gsap.fromTo(boxRef.current, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" });
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-describedby"
        >
            <Box ref={boxRef} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-background-Modal rounded-[8px] shadow p-4 outline-none">
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    )
}

export default CustomModal