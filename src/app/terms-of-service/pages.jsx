import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#00838f] mb-8">
          Terms of Service
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using the Aurora Tourism Accommodation Inspection
            Portal, you agree to be bound by these Terms of Service and all
            applicable laws and regulations. If you do not agree with any part
            of these terms, you are prohibited from using or accessing this
            site.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            2. Use License
          </h2>
          <p className="mb-4">
            Permission is granted to temporarily access the materials
            (information or software) on Aurora Tourism's website for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose or for any public
              display;
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on
              Aurora Tourism's website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials; or
            </li>
            <li>
              transfer the materials to another person or "mirror" the materials
              on any other server.
            </li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of
            these restrictions and may be terminated by Aurora Tourism at any
            time. Upon terminating your viewing of these materials or upon the
            termination of this license, you must destroy any downloaded
            materials in your possession whether in electronic or printed
            format.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            3. Disclaimer
          </h2>
          <p className="mb-4">
            The materials on Aurora Tourism's website are provided on an 'as is'
            basis. Aurora Tourism makes no warranties, expressed or implied, and
            hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <p>
            Further, Aurora Tourism does not warrant or make any representations
            concerning the accuracy, likely results, or reliability of the use
            of the materials on its website or otherwise relating to such
            materials or on any sites linked to this site.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            4. Limitations
          </h2>
          <p>
            In no event shall Aurora Tourism or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Aurora Tourism's website, even if
            Aurora Tourism or a Aurora Tourism authorized representative has
            been notified orally or in writing of the possibility of such
            damage.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            5. Revisions and Errata
          </h2>
          <p>
            The materials appearing on Aurora Tourism's website could include
            technical, typographical, or photographic errors. Aurora Tourism
            does not warrant that any of the materials on its website are
            accurate, complete or current. Aurora Tourism may make changes to
            the materials contained on its website at any time without notice.
            Aurora Tourism does not, however, make any commitment to update the
            materials.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            6. Links
          </h2>
          <p>
            Aurora Tourism has not reviewed all of the sites linked to its
            website and is not responsible for the contents of any such linked
            site. The inclusion of any link does not imply endorsement by Aurora
            Tourism of the site. Use of any such linked website is at the user's
            own risk.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#00acc1] mb-4">
            7. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of the Philippines and you irrevocably
            submit to the exclusive jurisdiction of the courts in that State or
            location.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/login" passHref>
            <Button className="bg-[#00acc1] hover:bg-[#0097a7] text-white font-bold py-2 px-4 rounded">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
