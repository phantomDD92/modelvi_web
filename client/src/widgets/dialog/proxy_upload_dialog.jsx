import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
} from "@material-tailwind/react";
import { DatePicker } from "antd";

export const ProxyUploadDialog = ({ open, onCancel, onConfirm }) => {
    const [text, setText] = useState('');
    const handleConfirm = () => {
        const proxies = []
        text.split("\n").forEach(entry => {
            proxies.push(entry.trim())
        })
        onConfirm(proxies)
    }
    return (
        <Dialog open={open}>
            <DialogHeader>Proxy Upload Dialog</DialogHeader>
            <DialogBody>
                <Textarea
                    label="Proxy list"
                    rows={20}
                    onChange={e => setText(e.target.value)}
                />
                <DatePicker />
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={onCancel}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button 
                    variant="gradient" 
                    color="green" 
                    onClick={handleConfirm}
                >
                    <span>Confirm</span>
                </Button>
            </DialogFooter>
        </Dialog>
    )
}