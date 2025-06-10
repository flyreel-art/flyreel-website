import React from 'react';

export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 font-montserrat text-gray-800">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Imprint</h1>
        <section className="mb-6">
          <h2 className="font-semibold mb-1">Information according to § 5 TMG</h2>
          <p>Kevin Ebeling Soto<br />Kastanienallee 26<br />74670 Forchtenberg<br />Germany</p>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-1">Contact</h2>
          <p>Email: info@flyreel.art</p>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-1">Disclaimer</h2>
          <p>The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness, or topicality. As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general laws remain unaffected. Any liability in this respect is, however, only possible from the time of knowledge of a specific infringement. Upon becoming aware of such violations, we will remove this content immediately.</p>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-1">Privacy Policy</h2>
          <p>The use of our website is usually possible without providing personal data. Insofar as personal data (such as name, address, or email addresses) is collected on our pages, this is always done on a voluntary basis as far as possible. This data will not be passed on to third parties without your express consent. We point out that data transmission over the Internet (e.g., communication by email) can have security vulnerabilities. Complete protection of data against access by third parties is not possible.</p>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-1">Online Dispute Resolution</h2>
          <p>The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>. Our email address can be found above in the imprint.<br />We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
        </section>
      </div>
    </main>
  );
} 