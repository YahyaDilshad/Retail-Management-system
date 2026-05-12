import { MailOpen, MessageCircle, Phone } from 'lucide-react'
import React from 'react'
MessageCircle
const About = () => {
  return (
    <div className='flex-1 ml-60 min-h-screen flex items-center justify-center bg-[#F8FAFC]'>
      <div className='w-[50vw] h-[90vh] flex flex-col items-center justify-center rounded-xl shadow-2xl shadow-black-50 py-10 bg-white'>
        <div className='border-b border-gray-400  flex items-center justify-center flex-col'>
        <h1 className='text-[#13786E] text-3xl '>Apexiums School System</h1>
        <p className='first-letter:font-bold text-start text-[#4B5563] first-letter:pr-2 first-letter:text-4xl first-letter:text-[#13786E] text-xl p-10'>Apexiums School Managemt is dedicated to delivering and Inovative , relaible and coast-effective degigtal solutions.We Specialize in software development , web and mobile applications,Pos systems , School Management System , Retail Management System and IT services tailored to meet modern business teams. Working as a virtual team allow us to colaborate efficiently , serve client glally and give high quality-solutions with flexibilty and speed.At Apexiums school system , our mission in to turn ideas into powerfull digital products that help businesses grow and succeed in to digital world .</p>
        <h3 className='py-1 px-3 rounded-full w-fit mb-10  bg-[#13786e31] text-[#13786E] '>Our Mission Turning Ideas into Reality</h3>
      </div>
      <div className='flex items-center mt-10 flex-col justify-between'>
        <div className='flex gap-3'>
        <MailOpen className='text-[#13786E]' />
        <p className='text-[#4B5563]'>Apexiumstechnologies@gmail.com</p>
        </div>
        <div className='flex mt-3 gap-3'>
        <Phone className='text-[#13786E]' />
        <p className='text-[#4B5563]'>+92 340 5542097</p>
        </div>
      </div>
      </div>
    </div>
  )
}

export default About
