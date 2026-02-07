"use client"

import { Button } from '@/components/ui/button'
import { useCreateEmptyRecord } from '@/hooks/Dashboard'
import { toast } from 'react-toastify';

const AddRecord = () => {
  const { mutate, isPending } = useCreateEmptyRecord();

  const handleClick = () => {
    mutate({ isTest: true }, {
      onSuccess: () => toast.success("Record added successfully!"),
      onError: () => toast.error("Error adding record")
    });
  }

  return (
    <div className="flex pb-1.5 justify-end">
      <Button 
        disabled={isPending} 
        className="font-bold text-xl p-6 cursor-pointer" 
        onClick={handleClick}
      >
        {isPending ? "Adding..." : "Add Record"}
      </Button>
    </div>
  )
}
 
export default AddRecord