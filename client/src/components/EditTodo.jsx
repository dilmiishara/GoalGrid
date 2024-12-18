import React from 'react'
import EditIcon from './icons/EditIcon';
import {
    Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Button } from './ui/button';
export default function EditTodo ({title, id, handleUpdate}){
    const [updatedTitle, setUpdatedTitle] = useState(title);

    return(
        <Dialog>
            <DialogTrigger asChild>
                <EditIcon classname="iconHover"/>
            </DialogTrigger>
            <DialogContent classname="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Todo</DialogTitle>
                    <DialogDescription>
                        Make changes to your todo here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <DialogTrigger asChild>
                    <form className='flex flex-col gap-2' action={handleUpdate}>
                        <input type="hidden" value={id} name="id"/>
                        <Label htmlFor="title">Previous Todo</Label>
                        <Input
                            id="title"
                            name="title"
                            value={updatedTitle}
                            onCange={(e)=> setUpdatedTitle(e.target.value)}
                            className="col-span-3"
                        />
                        <DialogFooter>
                            <Button>Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogTrigger>
            </DialogContent>
        </Dialog>
    );
}

// const EditTodo = () => {
//   return (
//     <div>
//       <EditTodo classname="iconHover"/>
//     </div>
//   );
// };

// export default EditTodo;
