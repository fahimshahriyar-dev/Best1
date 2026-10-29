import React from "react";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

type Props = {};

const TermsAndConditions = (props: Props) => {
  return (
    <div className="text-text-basic bg-background-Theme py-20 pt-32 min-h-screen">
      <div className="w-[95%] 800px:max-w-[85%] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[45px] font-bold mb-4 text-gradient inline-block">Terms & Conditions</h1>
          <p className="text-lg opacity-80">Effective date: January 1, 2025 · Last updated: May 1, 2025</p>
          <p className="text-xl mt-6 leading-relaxed opacity-90 italic">
            "By accessing or using the Best1 Academy website and services, you agree to be bound by these Terms & Conditions. Please read them carefully before using our platform."
          </p>
        </div>

        {/* Terms Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">1. Acceptance of terms</h2>
            <p className="opacity-80 leading-relaxed">By creating an account, enrolling in a course or live course, or using any part of our platform, you confirm that you have read, understood, and agreed to these terms. If you do not agree, please do not use our services.</p>
          </div>

          <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">2. Who we are</h2>
            <p className="opacity-80 leading-relaxed">Best1 Academy is an online learning platform operated by a team based in Chapai Nawabganj, Bangladesh. We provide live courses and recorded courses to learners. You can contact us at <span className="text-blue-500">fazli7.sam@gmail.com</span> or <span className="text-blue-500">+8801618206060</span>.</p>
          </div>
        </div>

        {/* Account & Enrollment - Grouped */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a]">
              <h2 className="text-2xl font-bold mb-4 text-gradient inline-block">3. User accounts</h2>
              <p className="opacity-80 leading-relaxed">To access our courses and live courses, you must create an account. You are responsible for keeping your login credentials secure and for all activity that occurs under your account. You must provide accurate and up-to-date information when registering. We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a]">
              <h2 className="text-2xl font-bold mb-4 text-gradient inline-block">4. Enrollment and purchases</h2>
              <p className="opacity-80 leading-relaxed">To enroll in a live course or purchase a course, you are required to fill out an enrollment form and complete payment. Submission of the form alone does not guarantee enrollment — your place is only confirmed once payment is successfully processed.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-8 rounded-2xl border border-[#ffffff1a] flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-500">5. Payments</h2>
            <p className="opacity-80 leading-relaxed mb-4">All payments must be completed through the payment options provided at checkout. We do not store your full payment card details.</p>
            <p className="opacity-80 leading-relaxed">By making a purchase, you confirm that you are authorized to use the payment method provided.</p>
          </div>
        </div>

        {/* Policies - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-background-Card_1 p-8 rounded-2xl border-l-4 border-blue-500 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">6. Refund policy</h2>
            <p className="opacity-80 leading-relaxed">Refunds are considered on a case-by-case basis. If you wish to request a refund, you must contact us at fazli7.sam@gmail.com as soon as possible after your purchase. Refund eligibility may depend on whether you have accessed the course content and the timing of your request.</p>
          </div>
          <div className="bg-background-Card_1 p-8 rounded-2xl border-l-4 border-purple-500 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-purple-500">7. Course and content access</h2>
            <p className="opacity-80 leading-relaxed">Once you purchase a course, you will be granted access to the course content as described on the course page. Access duration and any limitations will be clearly stated. We reserve the right to update, modify, or remove course content at any time.</p>
          </div>
        </div>

        {/* Live Courses & Mentors */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              8. Live courses
              <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="opacity-80 leading-relaxed">Live courses are conducted at scheduled times. It is your responsibility to attend at the correct time. We are not responsible for missed sessions due to your absence.</p>
            <p className="opacity-80 leading-relaxed italic">In exceptional circumstances, we may reschedule or cancel a live course, in which case we will notify enrolled students as soon as possible.</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              9. Mentor applications
              <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="opacity-80 leading-relaxed">By submitting a mentor application through our platform, you agree that the information you provide is accurate and truthful. Submission of an application does not guarantee acceptance.</p>
            <p className="opacity-80 leading-relaxed">Our team reserves the right to accept or decline any application at our sole discretion.</p>
          </div>
        </div>

        {/* IP & Conduct */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-background-Card_1 p-10 rounded-3xl border border-[#ffffff1a] relative overflow-hidden group">
            <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-blue-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <h2 className="text-2xl font-bold mb-6 text-blue-500">10. Intellectual property</h2>
            <p className="opacity-80 leading-relaxed">All content on Best1 Academy — including course materials, videos, text, graphics, and branding — is the property of Best1 Academy or its respective instructors and mentors.</p>
            <p className="opacity-80 leading-relaxed mt-4 font-semibold text-blue-500">You may not copy, reproduce, distribute, or use any content from our platform without prior written permission.</p>
          </div>

          <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-10 rounded-3xl border border-[#ffffff1a] shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-purple-500">11. User conduct</h2>
            <p className="opacity-80 mb-6 font-medium">By using our platform, you agree NOT to:</p>
            <ul className="space-y-4">
              {[
                "Share your account credentials with others",
                "Copy or distribute course content without permission",
                "Use the platform for any unlawful or harmful purpose",
                "Harass, abuse, or disrespect instructors or other users",
                "Attempt to gain unauthorized access to the platform"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="opacity-80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liability & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-background-Card_1 rounded-2xl border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">12. Disclaimer</h2>
            <p className="opacity-80 leading-relaxed text-sm italic">Best1 Academy provides its services on an \"as is\" basis. We do not guarantee that the platform will always be available, error-free, or meet your specific expectations.</p>
          </div>
          <div className="p-8 bg-background-Card_1 rounded-2xl border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-purple-500">13. Liability</h2>
            <p className="opacity-80 leading-relaxed text-sm italic">To the fullest extent permitted by law, Best1 Academy shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.</p>
          </div>
        </div>

        {/* Final Sections */}
        <div className="max-w-4xl space-y-12 mb-20">
          <div className="flex gap-8 flex-col md:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gradient inline-block">14. Third-party links</h2>
              <p className="opacity-80 leading-relaxed">Our website may contain links to external platforms such as Facebook, Instagram, YouTube, and GitHub. Visiting these links is at your own risk.</p>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gradient inline-block">15. Privacy</h2>
              <p className="opacity-80 leading-relaxed">Your use of Best1 Academy is also governed by our Privacy Policy, which is incorporated into these terms by reference.</p>
            </div>
          </div>

          <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a]">
            <h2 className="text-2xl font-bold mb-4 text-blue-500">16. Changes & Governing Law</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-2">Policy Updates</h3>
                <p className="opacity-80 text-sm">We may update these terms from time to time. Continued use of our platform after changes means you accept the updated terms.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Governing Law</h3>
                <p className="opacity-80 text-sm">These terms are governed by the laws of Bangladesh. Disputes shall be subject to the jurisdiction of the courts of Bangladesh.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Card */}
        <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">18. Contact us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <AiOutlineMail size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-60">Email</p>
                  <p className="font-semibold">fazli7.sam@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <AiOutlinePhone size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-60">Phone</p>
                  <p className="font-semibold">+8801618206060</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <HiOutlineLocationMarker size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-60">Address</p>
                  <p className="font-semibold">Boro Indra Moore, IFIC Bank, Chapai Nawabganj</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
