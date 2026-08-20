import { MailOpen, MessageCircle, Phone, Globe, Award, Target } from 'lucide-react';
import React from 'react';

const About = () => {
  return (
    <div className='flex-1 ml-64 min-h-[90%] mt-14 bg-[#F8FAFC] p-8 flex items-center justify-center'>
      <div className='max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
        
        {/* Header Section with Pattern */}
        <div className='bg-[#13786E] p-10 text-center relative'>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute rotate-45 -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute rotate-45 -bottom-10 -right-10 w-60 h-60 bg-white rounded-full"></div>
          </div>
          
          <h1 className='text-white text-4xl font-bold mb-2 relative z-10'>Apexiums Retail Management</h1>
          <p className='text-teal-100 font-medium relative z-10 tracking-wide'>Empowering Businesses through Technology</p>
        </div>

        <div className='p-10'>
          {/* Main Description */}
          <div className='mb-12'>
            <p className='text-gray-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#13786E] first-letter:mr-3 first-letter:float-left'>
              Apexiums Retail Management is dedicated to delivering innovative, reliable, and cost-effective digital solutions. 
              We specialize in software development, high-performance POS systems, and retail management ecosystems tailored 
              to meet modern business needs. Our virtual collaboration model allows us to serve clients globally, 
              providing high-quality solutions with flexibility and speed. At Apexiums, our mission is to turn your 
              business ideas into powerful digital products that drive growth and success in a competitive market.
            </p>
          </div>

          {/* Mission Tagline */}
          <div className='flex items-center justify-center mb-12'>
            <div className='bg-teal-50 border border-teal-100 px-6 py-3 rounded-full flex items-center gap-3'>
              <Target className='text-[#13786E]' size={20} />
              <span className='text-[#13786E] font-semibold italic'>
                Our Mission: Turning Ideas into Reality
              </span>
            </div>
          </div>

          {/* Contact & Info Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Email Card */}
            <a href="mailto:Apexiumstechnologies@gmail.com" className='group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center'>
              <div className='bg-white group-hover:bg-teal-600 p-3 rounded-lg shadow-sm mb-3 transition-colors'>
                <MailOpen className='text-[#13786E] group-hover:text-white' size={24} />
              </div>
              <h4 className='font-bold text-gray-800 mb-1'>Email Us</h4>
              <p className='text-sm text-gray-500 break-all'>Apexiumstechnologies @gmail.com</p>
            </a>

            {/* Phone Card */}
            <div className='group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center'>
              <div className='bg-white group-hover:bg-teal-600 p-3 rounded-lg shadow-sm mb-3 transition-colors'>
                <Phone className='text-[#13786E] group-hover:text-white' size={24} />
              </div>
              <h4 className='font-bold text-gray-800 mb-1'>Call Us</h4>
              <p className='text-sm text-gray-500'>+92 340 5542097</p>
            </div>

            {/* Support Card */}
            <div className='group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center'>
              <div className='bg-white group-hover:bg-teal-600 p-3 rounded-lg shadow-sm mb-3 transition-colors'>
                <Award className='text-[#13786E] group-hover:text-white' size={24} />
              </div>
              <h4 className='font-bold text-gray-800 mb-1'>Experience</h4>
              <p className='text-sm text-gray-500'>Premium Support & Digital Excellence</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className='bg-gray-50 p-4 text-center border-t border-gray-100'>
          <p className='text-xs text-gray-400 uppercase tracking-widest'>© 2024 Apexiums Technologies. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default About;