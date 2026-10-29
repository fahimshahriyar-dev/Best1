import React, { useState } from "react";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";

type Props = {};

const StaticFAQ = (props: Props) => {
  const { language } = useSelector((state: any) => state.language);
  const t = translations[language];
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  // FAQ data is bilingual — keyed by language
  const faqData: { category: { english: string; bangla: string }; questions: { question: { english: string; bangla: string }; answer: { english: string; bangla: string } }[] }[] = [
    {
      category: { english: "General", bangla: "সাধারণ" },
      questions: [
        {
          question: { english: "What is Best1 Academy?", bangla: "Best1 Academy কী?" },
          answer: { english: "Best1 Academy is an online learning platform based in Chapai Nawabganj, Bangladesh. We offer live courses conducted by our experienced team of instructors and are building a growing library of on-demand courses. Our goal is to make quality education accessible to everyone.", bangla: "Best1 Academy বাংলাদেশের চাঁপাইনবাবগঞ্জে অবস্থিত একটি অনলাইন লার্নিং প্ল্যাটফর্ম। আমরা আমাদের অভিজ্ঞ শিক্ষক দলের দ্বারা পরিচালিত লাইভ কোর্স অফার করি এবং অন-ডিমান্ড কোর্সের একটি ক্রমবর্ধমান লাইব্রেরি তৈরি করছি। আমাদের লক্ষ্য সবার জন্য মানসম্পন্ন শিক্ষাকে সহজলভ্য করা।" }
        },
        {
          question: { english: "Who are the instructors at Best1 Academy?", bangla: "Best1 Academy-তে শিক্ষকরা কারা?" },
          answer: { english: "Our classes are taught by a dedicated team of experienced educators and professionals. We also accept applications from external mentors who go through a review process before joining our platform.", bangla: "আমাদের ক্লাসগুলো অভিজ্ঞ শিক্ষাবিদ ও পেশাদারদের একটি নিবেদিতপ্রাণ দলের দ্বারা পরিচালিত হয়। আমরা বাহ্যিক মেন্টরদের কাছ থেকেও আবেদন গ্রহণ করি যারা আমাদের প্ল্যাটফর্মে যোগ দেওয়ার আগে একটি পর্যালোচনা প্রক্রিয়ার মধ্য দিয়ে যান।" }
        },
        {
          question: { english: "Is Best1 Academy suitable for beginners?", bangla: "Best1 Academy কি শিক্ষানবিসদের জন্য উপযুক্ত?" },
          answer: { english: "Yes. We offer courses and live courses for all skill levels — from complete beginners to more advanced learners. Each course or live course page clearly describes the level of experience required before enrolling.", bangla: "হ্যাঁ। আমরা সব দক্ষতার স্তরের জন্য কোর্স এবং লাইভ কোর্স অফার করি — সম্পূর্ণ নতুনদের থেকে আরও উন্নত শিক্ষার্থীদের জন্য। প্রতিটি কোর্স বা লাইভ কোর্স পেজে ভর্তির আগে প্রয়োজনীয় অভিজ্ঞতার স্তর স্পষ্টভাবে বর্ণিত আছে।" }
        },
        {
          question: { english: "What subjects or topics do you cover?", bangla: "আপনারা কোন বিষয় বা টপিক কভার করেন?" },
          answer: { english: "Our course catalog is growing. You can browse all available topics on our Courses page. We cover a range of subjects taught by our team of instructors and mentors.", bangla: "আমাদের কোর্স ক্যাটালগ বাড়ছে। আপনি আমাদের কোর্স পেজে সমস্ত উপলব্ধ টপিক দেখতে পারেন। আমরা আমাদের শিক্ষক ও মেন্টর দলের দ্বারা শেখানো বিভিন্ন বিষয় কভার করি।" }
        }
      ]
    },
    {
      category: { english: "Courses & live courses", bangla: "কোর্স ও লাইভ কোর্স" },
      questions: [
        {
          question: { english: "What is the difference between a live course and a course?", bangla: "লাইভ কোর্স এবং কোর্সের মধ্যে পার্থক্য কী?" },
          answer: { english: "A live course is a real-time session conducted by one of our instructors at a scheduled time — you attend and interact live. A course is a recorded, self-paced learning experience you can access at any time after purchase.", bangla: "একটি লাইভ কোর্স হল নির্ধারিত সময়ে আমাদের একজন শিক্ষক কর্তৃক পরিচালিত একটি রিয়েল-টাইম সেশন — আপনি সরাসরি উপস্থিত হন এবং ইন্টারেক্ট করেন। একটি কোর্স হল একটি রেকর্ড করা, নিজের গতিতে শেখার অভিজ্ঞতা যা আপনি কেনার পর যেকোনো সময় অ্যাক্সেস করতে পারেন।" }
        },
        {
          question: { english: "How do I enroll in a live course or purchase a course?", bangla: "আমি কীভাবে একটি লাইভ কোর্সে ভর্তি হব বা একটি কোর্স কিনব?" },
          answer: { english: "To enroll in a live course or purchase a course, simply browse our listings, click on the one you're interested in, and fill out the enrollment form with your details. Once you submit the form and complete payment, your spot is confirmed.", bangla: "একটি লাইভ কোর্সে ভর্তি বা একটি কোর্স কিনতে, আমাদের তালিকা দেখুন, আগ্রহী কোর্সে ক্লিক করুন এবং আপনার বিবরণ দিয়ে ভর্তি ফর্ম পূরণ করুন। একবার ফর্ম জমা দিয়ে পেমেন্ট সম্পন্ন করলে, আপনার স্থান নিশ্চিত হবে।" }
        },
        {
          question: { english: "Do I need to create an account to enroll?", bangla: "ভর্তি হতে কি অ্যাকাউন্ট তৈরি করতে হবে?" },
          answer: { english: "Yes. You will need to create an account on Best1 Academy to access your enrolled courses or live courses. You can manage everything from your account dashboard after registration.", bangla: "হ্যাঁ। আপনার ভর্তি হওয়া কোর্স বা লাইভ কোর্স অ্যাক্সেস করতে আপনাকে Best1 Academy-তে একটি অ্যাকাউন্ট তৈরি করতে হবে। নিবন্ধনের পরে আপনি আপনার অ্যাকাউন্ট ড্যাশবোর্ড থেকে সবকিছু পরিচালনা করতে পারবেন।" }
        },
        {
          question: { english: "Can I access a course after the purchase?", bangla: "কেনার পরে কি কোর্সে অ্যাক্সেস করা যাবে?" },
          answer: { english: "Yes. Once you purchase a course, you can access it from your Course Dashboard at any time. Access details and duration are specified on each course page.", bangla: "হ্যাঁ। একবার কোর্স কিনলে, আপনি যেকোনো সময় আপনার কোর্স ড্যাশবোর্ড থেকে এটি অ্যাক্সেস করতে পারবেন। অ্যাক্সেসের বিবরণ এবং সময়কাল প্রতিটি কোর্স পেজে উল্লেখ করা আছে।" }
        },
        {
          question: { english: "What happens after I submit the enrollment form?", bangla: "ভর্তি ফর্ম জমা দেওয়ার পরে কী হয়?" },
          answer: { english: "After submitting the form, you will proceed to complete your payment. Once payment is confirmed, your enrollment is finalized and you will receive access details. If there is any issue, our team will contact you directly.", bangla: "ফর্ম জমা দেওয়ার পরে, আপনি আপনার পেমেন্ট সম্পন্ন করতে এগিয়ে যাবেন। পেমেন্ট নিশ্চিত হলে, আপনার ভর্তি চূড়ান্ত হবে এবং আপনি অ্যাক্সেসের বিবরণ পাবেন। যদি কোনো সমস্যা হয়, আমাদের দল সরাসরি আপনার সাথে যোগাযোগ করবে।" }
        },
        {
          question: { english: "Will I get a certificate after completing a course?", bangla: "কোর্স শেষ করার পরে কি সার্টিফিকেট পাব?" },
          answer: { english: "Certificate availability depends on the specific course. Please check the course details page or contact us at fazli7.sam@gmail.com for more information on certification for a particular course.", bangla: "সার্টিফিকেটের প্রাপ্যতা নির্দিষ্ট কোর্সের উপর নির্ভর করে। নির্দিষ্ট কোর্সের সার্টিফিকেশন সম্পর্কে আরও তথ্যের জন্য কোর্সের বিবরণ পেজ দেখুন বা fazli7.sam@gmail.com-এ আমাদের সাথে যোগাযোগ করুন।" }
        }
      ]
    },
    {
      category: { english: "Payment & refunds", bangla: "পেমেন্ট ও রিফান্ড" },
      questions: [
        {
          question: { english: "What payment methods are accepted?", bangla: "কোন পেমেন্ট পদ্ধতিগুলো গ্রহণযোগ্য?" },
          answer: { english: "We accept common payment methods available in Bangladesh. Specific payment options will be shown to you at the time of checkout. If you have questions about payment, please contact us at +8801618206060.", bangla: "আমরা বাংলাদেশে উপলব্ধ সাধারণ পেমেন্ট পদ্ধতিগুলো গ্রহণ করি। চেকআউটের সময় আপনাকে নির্দিষ্ট পেমেন্ট অপশন দেখানো হবে। পেমেন্ট সম্পর্কে প্রশ্ন থাকলে, +8801618206060 নম্বরে আমাদের সাথে যোগাযোগ করুন।" }
        },
        {
          question: { english: "Can I get a refund if I change my mind?", bangla: "মন পরিবর্তন করলে কি রিফান্ড পাব?" },
          answer: { english: "Refund eligibility depends on the course or class and the timing of your request. Please contact our team at fazli7.sam@gmail.com as soon as possible if you would like to request a refund and we will review your case.", bangla: "রিফান্ডের যোগ্যতা কোর্স বা ক্লাস এবং আপনার অনুরোধের সময়ের উপর নির্ভর করে। রিফান্ডের জন্য যত দ্রুত সম্ভব fazli7.sam@gmail.com-এ আমাদের দলের সাথে যোগাযোগ করুন এবং আমরা আপনার ক্ষেত্রটি পর্যালোচনা করব।" }
        },
        {
          question: { english: "Is my payment information secure?", bangla: "আমার পেমেন্ট তথ্য কি সুরক্ষিত?" },
          answer: { english: "Yes. We take your security seriously and do not store your full payment card details on our servers. All transactions are processed through secure payment channels.", bangla: "হ্যাঁ। আমরা আপনার নিরাপত্তাকে গুরুত্বের সাথে নিই এবং আমাদের সার্ভারে আপনার সম্পূর্ণ পেমেন্ট কার্ডের বিবরণ সংরক্ষণ করি না। সমস্ত লেনদেন নিরাপদ পেমেন্ট চ্যানেলের মাধ্যমে প্রক্রিয়া করা হয়।" }
        }
      ]
    },
    {
      category: { english: "Becoming a mentor", bangla: "মেন্টর হওয়া" },
      questions: [
        {
          question: { english: "Can I apply to become a mentor at Best1 Academy?", bangla: "আমি কি Best1 Academy-তে মেন্টর হতে আবেদন করতে পারি?" },
          answer: { english: "Yes! We are always looking for passionate and knowledgeable individuals to join our team as mentors. If you have expertise worth sharing, we'd love to hear from you.", bangla: "হ্যাঁ! আমরা সবসময় মেন্টর হিসেবে আমাদের দলে যোগ দিতে আগ্রহী ও জ্ঞানসম্পন্ন ব্যক্তিদের খুঁজি। আপনার যদি শেয়ার করার মতো দক্ষতা থাকে, আমরা আপনার কাছ থেকে শুনতে চাই।" }
        },
        {
          question: { english: "How do I apply to become a mentor?", bangla: "মেন্টর হতে কীভাবে আবেদন করব?" },
          answer: { english: "To apply, fill out the mentor application form available on our website. You will need to provide your name, contact details, and some information about your professional background and areas of expertise. Our team will review your application and reach out to you.", bangla: "আবেদন করতে, আমাদের ওয়েবসাইটে উপলব্ধ মেন্টর আবেদন ফর্ম পূরণ করুন। আপনাকে আপনার নাম, যোগাযোগের বিবরণ এবং আপনার পেশাদার পটভূমি ও দক্ষতার ক্ষেত্র সম্পর্কে কিছু তথ্য প্রদান করতে হবে। আমাদের দল আপনার আবেদন পর্যালোচনা করে আপনার সাথে যোগাযোগ করবে।" }
        },
        {
          question: { english: "How long does the mentor review process take?", bangla: "মেন্টর পর্যালোচনা প্রক্রিয়ায় কত সময় লাগে?" },
          answer: { english: "We review every application carefully. Our team will get back to you as soon as possible after reviewing your submission. The timeline may vary depending on the volume of applications we receive.", bangla: "আমরা প্রতিটি আবেদন যত্ন সহকারে পর্যালোচনা করি। আমাদের দল আপনার জমা দেওয়া আবেদন পর্যালোচনার পরে যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করবে। সময়সীমা আমরা যে আবেদনের পরিমাণ পাই তার উপর নির্ভর করে পরিবর্তিত হতে পারে।" }
        },
        {
          question: { english: "What qualifications do I need to become a mentor?", bangla: "মেন্টর হতে কী যোগ্যতা প্রয়োজন?" },
          answer: { english: "There is no strict formal qualification required. What matters most is that you have solid knowledge in your subject area, a genuine passion for teaching, and the ability to communicate clearly. Our team evaluates each application individually.", bangla: "কোনো কঠোর আনুষ্ঠানিক যোগ্যতার প্রয়োজন নেই। সবচেয়ে গুরুত্বপূর্ণ হল আপনার বিষয়ে দৃঢ় জ্ঞান, শিক্ষাদানে সত্যিকারের আগ্রহ এবং স্পষ্টভাবে যোগাযোগ করার ক্ষমতা থাকা। আমাদের দল প্রতিটি আবেদন পৃথকভাবে মূল্যায়ন করে।" }
        }
      ]
    },
    {
      category: { english: "Account & support", bangla: "অ্যাকাউন্ট ও সাপোর্ট" },
      questions: [
        {
          question: { english: "How do I access my purchased courses?", bangla: "আমার কেনা কোর্সগুলো কীভাবে অ্যাক্সেস করব?" },
          answer: { english: "You can access all your purchased courses from your Course Dashboard. Log in to your account and navigate to the dashboard to see your active enrollments and continue learning.", bangla: "আপনি আপনার কোর্স ড্যাশবোর্ড থেকে আপনার সমস্ত কেনা কোর্স অ্যাক্সেস করতে পারবেন। আপনার অ্যাকাউন্টে লগ ইন করুন এবং আপনার সক্রিয় এনরোলমেন্ট দেখতে এবং শেখা চালিয়ে যেতে ড্যাশবোর্ডে নেভিগেট করুন।" }
        },
        {
          question: { english: "I forgot my password. What should I do?", bangla: "আমি পাসওয়ার্ড ভুলে গেছি। কী করব?" },
          answer: { english: "Use the \"Forgot password\" option on the login page to reset your password. A reset link will be sent to your registered email address. If you continue to have issues, contact us at fazli7.sam@gmail.com.", bangla: "আপনার পাসওয়ার্ড রিসেট করতে লগইন পেজের \"পাসওয়ার্ড ভুলে গেছি\" অপশন ব্যবহার করুন। একটি রিসেট লিঙ্ক আপনার নিবন্ধিত ইমেইল ঠিকানায় পাঠানো হবে। সমস্যা অব্যাহত থাকলে, fazli7.sam@gmail.com-এ আমাদের সাথে যোগাযোগ করুন।" }
        },
        {
          question: { english: "How do I contact Best1 Academy for support?", bangla: "সাপোর্টের জন্য Best1 Academy-তে কীভাবে যোগাযোগ করব?" },
          answer: { english: "You can reach us by email at fazli7.sam@gmail.com or by phone at +8801618206060. You can also visit us at 4, Boro Indra Moore, Underneath of IFIC Bank, Chapai Nawabganj Sadar.", bangla: "আপনি fazli7.sam@gmail.com ইমেইলে বা +8801618206060 ফোনে আমাদের সাথে যোগাযোগ করতে পারেন। আপনি আমাদের ৪, বড় ইন্দারা মোড়, আইএফআইসি ব্যাংকের নিচে, চাঁপাইনবাবগঞ্জ সদরেও আসতে পারেন।" }
        }
      ]
    }
  ];

  let globalIndex = 0;

  return (
    <div className="text-text-basic bg-background-Theme py-20 pt-32 min-h-screen">
      <div className="w-[95%] 800px:max-w-[85%] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[45px] font-bold mb-4 text-gradient inline-block">{t.static_faq_title}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">{t.static_faq_subtitle}</p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-12 mb-20">
          {faqData.map((section, sIndex) => (
            <div key={sIndex}>
              <h2 className="text-2xl font-bold mb-6 text-blue-500 border-b border-[#ffffff1a] pb-2">
                {section.category[language as "english" | "bangla"] || section.category.english}
              </h2>
              <div className="space-y-4">
                {section.questions.map((q, qIndex) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div key={qIndex} className="bg-background-Card_1 rounded-xl border border-[#ffffff1a] overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => toggleQuestion(currentIndex)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-white/5 transition-colors"
                      >
                        <span className="text-lg font-medium">
                          {q.question[language as "english" | "bangla"] || q.question.english}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-transform duration-300 ${activeQuestion === currentIndex ? "rotate-180" : ""}`}>
                          <IoIosArrowDown />
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeQuestion === currentIndex ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="p-6 pt-0 border-t border-[#ffffff1a] opacity-80 leading-relaxed">
                          {q.answer[language as "english" | "bangla"] || q.answer.english}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl relative overflow-hidden group max-w-4xl mx-auto text-center">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">{t.static_faq_still_question}</h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">{t.static_faq_still_desc}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <AiOutlineMail size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm opacity-60">{t.static_faq_email_us}</p>
                  <p className="font-semibold">fazli7.sam@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <AiOutlinePhone size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm opacity-60">{t.static_faq_call_us}</p>
                  <p className="font-semibold">+8801618206060</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticFAQ;
