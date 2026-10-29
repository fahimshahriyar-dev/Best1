import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoIosCall } from 'react-icons/io'
import { MdEmail, MdLocationPin } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '@/redux/features/language/languageSlice'
import { translations } from '../utils/translations'

type Props = {}

const Footer = (props: Props) => {
    const dispatch = useDispatch();
    const { language } = useSelector((state: any) => state.language);

    const handleLanguageChange = (lang: string) => {
        dispatch(setLanguage(lang));
    }

    const shareCaption = `🎓 Introducing Best1 Academy!

Are you ready to take your learning to the next level?

Best1 Academy is your go-to online learning platform 
where you can:

✅ Join live courses taught by experienced instructors
✅ Purchase self-paced recorded courses
✅ Explore and read our growing e-book library
✅ Learn from expert mentors and professionals
✅ Study from the comfort of your home
✅ Apply as a teacher and share your knowledge

Whether you're a student, a working professional, 
a teacher, or someone who just wants to learn 
something new — we have something for you. 🙌

🧑‍🏫 Are you an educator or an expert in your field?
We are also accepting applications from teachers 
and mentors who want to teach on our platform. 
Fill out a simple form and our team will reach 
out to you!

👉 Visit us today and start your learning journey!

🌐 ${typeof window !== 'undefined' ? window.location.origin : ''}
📞 +8801618206060
📧 fazli7.sam@gmail.com

#Best1Academy #OnlineLearning #LiveCourses 
#OnlineCourses #EBooks #LearnOnline #Bangladesh 
#Education #BecomeATeacher #OnlineTeaching 
#ExpertMentors #StudyFromHome`;

    const shareOnFacebook = () => {
        const url = window.location.origin;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareCaption)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareCaption)}`, '_blank');
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCaption)}`, '_blank');
    };

    const shareOnGmail = () => {
        const subject = encodeURIComponent("Introducing Best1 Academy!");
        window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(shareCaption)}`;
    };

    return (
        <footer className='bg-background-Footer'>
            <div className='border border-[#ffffff1e]'>
                <br />
                <div className='w-[95%] 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8 py-12'>
                    <h1 className='text-[30px] font-[600] mb-10'>Best1 Academy</h1>
                    <div className='border-b'></div>
                    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 my-6'>
                        {/* about */}
                        <div>
                            <ul className='space-y-4'>
                                {/* about us */}
                                <li>
                                    <Link
                                        href="/about"
                                        className='text-base text-text-basic hover:text-hover-text-1'
                                    >
                                        {translations[language].about_us}
                                    </Link>
                                </li>
                                {/* privacy */}
                                <li>
                                    <Link
                                        href="/privacy-policy"
                                        className='text-base text-text-basic hover:text-hover-text-1'
                                    >
                                        {translations[language].privacy_policy}
                                    </Link>
                                </li>
                                {/* faq */}
                                <li>
                                    <Link
                                        href="/faq"
                                        className='text-base text-text-basic hover:text-hover-text-1'
                                    >
                                        {translations[language].faq}
                                    </Link>
                                </li>
                                {/* terms and conditions */}
                                <li>
                                    <Link
                                        href="/terms-conditions"
                                        className='text-base text-text-basic hover:text-hover-text-1'
                                    >
                                        {translations[language].terms_conditions}
                                    </Link>
                                </li>
                                {/* consultancy */}
                                <li>
                                    <Link
                                        href="/consultancy"
                                        className='text-base text-text-basic hover:text-hover-text-1'
                                    >
                                        {translations[language].consultancy}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* contact info */}
                        <div className='flex flex-col gap-y-3'>
                            {/* address */}
                            <div className="flex gap-x-2">
                                <MdLocationPin size={22} className="mt-1"/>
                                <p className='text-base text-text-basic hover:text-hover-text-1 w-[70%]'>
                                    {translations[language]?.address_text || "4, Boro Indra Moore, Underneath of IFIC Bank, Chapai Nawabganj Sadar"}
                                </p>
                            </div>
                            {/* phone */}
                            <div className="flex gap-x-2 items-center">
                                <IoIosCall size={20}/>
                                <p className='text-base text-text-basic hover:text-hover-text-1'>
                                    +8801618206060
                                </p>
                            </div>

                            {/* email */}
                            <div className="flex gap-x-2 items-center">
                                <MdEmail size={20}/>
                                <p className='text-base text-text-basic hover:text-hover-text-1'>
                                    fazli7.sam@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* social links */}
                        <div className='space-y-3'>
                            {/* find us on */}
                            <div>
                                <h3 className='text-[20px] font-[600] text-text-basic mb-3'>
                                    {translations[language].find_us_on}
                                </h3>

                                {/* link */}
                                <Link href="#">
                                    <Image
                                        src="/assests/facebook.jpg"
                                            alt="facebook"
                                        width={30}
                                        height={30}
                                    />
                                </Link>
                            </div>
                        <div className='space-y-3'>
                            <h3 className='text-[20px] font-[600]'>
                                {translations[language].share_website}
                            </h3>
                            <div className='flex gap-x-3'>
                                {/* facebook */}
                                <div onClick={shareOnFacebook} className="cursor-pointer">
                                    <Image
                                        src="/assests/facebook.jpg"
                                            alt="facebook"
                                        width={30}
                                        height={30}
                                    />
                                </div>
                                {/* whats app */}
                                <div onClick={shareOnWhatsApp} className="cursor-pointer">
                                    <Image
                                        src="/assests/whatsapp.jpg"
                                            alt="whats app"
                                        width={30}
                                        height={30}
                                    />
                                </div>
                                {/* gamil */}
                                <div onClick={shareOnGmail} className="cursor-pointer">
                                    <Image
                                        src="/assests/gmail.jpg"
                                            alt="gamil"
                                        width={30}
                                        height={30}
                                    />
                                </div>
                                {/* twitter */}
                                <div onClick={shareOnTwitter} className="cursor-pointer">
                                    <Image
                                        src="/assests/twitter.jpg"
                                            alt="twitter"
                                        width={30}
                                        height={30}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='border-b'></div>

                    <div className="mt-6 flex justify-between">
                        <h3>{translations[language].powered_by}</h3>
                        <div className='flex gap-x-2'>
                            <button 
                                className={`py-1 px-3 border rounded-[5px] ${language === 'english' ? 'bg-button-btn_1 text-white' : ''}`}
                                onClick={() => handleLanguageChange('english')}
                            >
                                English
                            </button>
                            <button 
                                className={`py-1 px-3 border rounded-[5px] ${language === 'bangla' ? 'bg-button-btn_1 text-white' : ''}`}
                                onClick={() => handleLanguageChange('bangla')}
                            >
                                বাংলা
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer