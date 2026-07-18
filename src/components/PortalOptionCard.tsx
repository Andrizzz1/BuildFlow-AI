import {MoveUpRight} from 'lucide-react'
import type { LucideIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
type PortalCardProps = {
  logo: LucideIcon ;
  name: string;
  desc: string;
  link: string;
};

export default function PortalCard({logo:Logo, name,desc, link}:PortalCardProps){
    const navigate = useNavigate();
    return<div className='bg-[#033363] 
    flex flex-col 
    justify-around 
    cursor-pointer 
    text-white 
    border-l-4 p-1 
    w-full md:h-50 lg:h-40 lg:w-md md:w-xs 
    border-[#FF8C00] 
    rounded-sm
    max-sm:gap-1
    hover:shadow-2xl
    hover:translate-y-0.5
    transition-all
    duration-100 
    ' onClick={()=>{navigate(`${link}`)}}>
        <div>
            <Logo/>
        </div>
        <h3 className='text-2xl font-bold '>{name}</h3>
        <p className='text-[#6FA9C9]'>{desc}</p>
        <div className='flex justify-between text-xs '>
            <p className='text-[#ffb690]'>LAUNCH PORTAL</p>
            <MoveUpRight size={15} />
        </div>
    </div>
}