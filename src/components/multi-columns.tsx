import { ReactNode } from "react";

export default function MultiColumns({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col md:flex-row'>
      {children}
    </div>
  )
}
