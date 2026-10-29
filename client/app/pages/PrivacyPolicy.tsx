import React from "react";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

type Props = {};

const PrivacyPolicy = (props: Props) => {
  return (
    <div className="text-text-basic bg-background-Theme py-20 pt-32 min-h-screen">
      <div className="w-[95%] 800px:max-w-[85%] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[45px] font-bold mb-4 text-gradient inline-block">Privacy Policy</h1>
          <p className="text-lg opacity-80">Effective Date: May 1, 2026</p>
        </div>

        {/* Who We Are */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 relative inline-block">
            Who we are
            <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h2>
            <p className="text-lg leading-relaxed max-w-4xl opacity-90">
              Best1 Academy is an online learning platform operated by a team based in Chapai Nawabganj, Bangladesh. We offer live courses and online courses. If you have any questions about this policy, you can reach us at <span className="text-blue-500">fazli7.sam@gmail.com</span> or call us at <span className="text-blue-500">+8801618206060</span>.
            </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 relative inline-block">
            Information we collect
            <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h2>
          <p className="text-lg mb-10 opacity-90">We collect information you provide directly to us, as well as some information automatically when you use our platform:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-500">Personal info</h3>
              <p className="opacity-80">Name, email address, phone number — provided when you fill out enrollment or mentor application forms.</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-500">Payment info</h3>
              <p className="opacity-80">Transaction details when you purchase a course or live course. We do not store full payment card details.</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-500">Usage data</h3>
              <p className="opacity-80">Pages visited, time spent, device type, and browser info — collected automatically for platform improvement.</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-500">Mentor applications</h3>
              <p className="opacity-80">Professional background, skills, and contact info submitted through the mentor application form.</p>
            </div>
          </div>
        </div>

        {/* How We Use Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              How we use your info
              <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="text-lg mb-6 opacity-90">We use the information we collect only for purposes that are necessary to run our platform and serve you properly:</p>
            <ul className="space-y-4">
              {[
                "To process your enrollment in courses or live courses",
                "To contact you about your purchase or application status",
                "To review and respond to mentor applications",
                "To send important updates about your enrolled courses",
                "To improve our website, content, and learning experience",
                "To comply with legal and regulatory obligations"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="opacity-80">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-semibold text-blue-500 italic">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Enrollment and purchase forms</h3>
              <p className="opacity-80 leading-relaxed">
                When you want to purchase a course or enroll in a live course, you are required to fill out a form with your personal details. This information is used solely to process your enrollment and facilitate communication about your purchase. Submission of the form does not guarantee enrollment until payment is confirmed.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Mentor applications</h3>
              <p className="opacity-80 leading-relaxed">
                If you apply to become a mentor at Best1 Academy, the information you submit through the application form will be reviewed by our team. We will reach out to you using the contact information you provide. Application data is kept confidential and is not shared outside our team.
              </p>
            </div>
          </div>
        </div>

        {/* Other Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a]">
            <h3 className="text-2xl font-bold mb-4">Cookies</h3>
            <p className="opacity-80 leading-relaxed">
              Our website may use cookies and similar technologies to improve your browsing experience, remember your preferences, and understand how visitors use our site. You can control cookie settings through your browser. Disabling cookies may affect certain features of the platform.
            </p>
          </div>
          <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a]">
            <h3 className="text-2xl font-bold mb-4">Data security</h3>
            <p className="opacity-80 leading-relaxed">
              We take reasonable steps to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and to keep your account details confidential.
            </p>
          </div>
        </div>

        {/* Your Rights & Third Party */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              Your rights
              <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <ul className="space-y-4">
              {[
                "Request access to the personal data we hold about you",
                "Ask us to correct or update inaccurate information",
                "Request deletion of your personal data, subject to legal requirements",
                "Withdraw consent for communications at any time"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="opacity-80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              Third-party links
              <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="opacity-80 leading-relaxed">
              Our website may contain links to external platforms such as Facebook, Instagram, YouTube, or GitHub. We are not responsible for the privacy practices of these platforms. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="mb-16 p-8 bg-background-Card_1 rounded-2xl border-l-4 border-blue-500">
          <h3 className="text-2xl font-bold mb-2">Changes to this policy</h3>
          <p className="opacity-80">
            We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. When we do, we will update the effective date at the top of this page. We encourage you to review this page periodically.
          </p>
        </div>

        {/* Contact Us Card */}
        <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">Contact us</h2>
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

export default PrivacyPolicy;
