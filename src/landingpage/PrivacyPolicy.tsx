import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
const LAST_UPDATED = "November 23, 2025";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#09090b]">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Sanatack – Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            <p>
              At Sanatack (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
              your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect the information you provide when
              using our platform, website, and related services (collectively,
              the &quot;Platform&quot;). By using Sanatack, you agree to the
              practices described in this Privacy Policy.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                1. Information We Collect
              </h2>
              <p className="mb-2">
                When you create an account or use our services, we may collect
                and store the following information:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Username</li>
              </ul>
              <p className="mt-2">
                We do not collect sensitive personal information such as
                national IDs, payment card numbers, or addresses directly.
              </p>
              <p className="mt-2">
                Payments for paid plans are processed through Stripe, a secure
                third-party payment provider. Sanatack does not store or have
                access to your credit card details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                2. How We Use Your Information
              </h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Create and manage user accounts</li>
                <li>Provide access to learning features and AI tools</li>
                <li>
                  Send important updates, announcements, or security alerts
                </li>
                <li>Improve our platform’s performance and user experience</li>
                <li>Respond to support requests or inquiries</li>
              </ul>
              <p className="mt-2">
                We do not sell or rent user data to any third party.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. Use of Artificial Intelligence (AI)
              </h2>
              <p className="mb-2">
                Our platform uses the OpenAI API to generate educational and
                learning content. When you use AI features:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Your inputs (such as prompts or messages) may be sent to
                  OpenAI’s servers for processing.
                </li>
                <li>
                  These interactions are handled under OpenAI’s data policies.
                </li>
              </ul>
              <p className="mt-2">
                We encourage users to avoid submitting confidential or sensitive
                personal information when interacting with AI tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Payment Processing
              </h2>
              <p className="mb-2">
                All payments are securely processed through Stripe. Stripe may
                collect limited information necessary to process payments, such
                as your name, email, and payment method details. Sanatack does
                not store or control this payment data.
              </p>
              <p>
                For more information, please review Stripe’s Privacy Policy:{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  https://stripe.com/privacy
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                5. Data Storage and Security
              </h2>
              <p>
                We take appropriate technical and organizational measures to
                protect user data against unauthorized access, alteration, or
                destruction. Your account credentials are encrypted and securely
                stored. While we strive to protect your information, no method
                of transmission or storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Data Sharing</h2>
              <p className="mb-2">
                We may share limited data with trusted service providers
                strictly for operational purposes, including:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>OpenAI (for AI-powered content generation)</li>
                <li>Stripe (for payment processing)</li>
              </ul>
              <p className="mt-2">
                We do not share user data with advertisers or third-party
                marketers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
              <p className="mb-2">
                We retain user data only as long as necessary to:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Maintain your account and provide services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="mt-2">
                Users may request account deletion at any time by contacting{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  support@sanatack.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
              <p className="mb-2">
                Depending on your jurisdiction, you may have rights to:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent to processing (if applicable)</li>
              </ul>
              <p className="mt-2">
                Requests can be made via{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  support@sanatack.com
                </a>
                . We will respond within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                9. Children’s Privacy
              </h2>
              <p>
                Sanatack is designed for all ages, but users under 18 should use
                the platform under parental supervision. We do not knowingly
                collect personal data from children without guardian consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. The latest
                version will always be available on our website with an updated
                &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we
                handle your data, please contact us at:{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  support@sanatack.com
                </a>
                .
              </p>
            </section>
          </div>

          <hr className="my-12 border-dashed border-gray-300 dark:border-zinc-700" />

          <section
            dir="rtl"
            className="text-right space-y-8 text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
          >
            <h2 className="text-2xl font-bold mb-2">
              منصة Sanatack – سياسة الخصوصية
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              آخر تحديث: {LAST_UPDATED}
            </p>

            <p>
              في Sanatack (&quot;نحن&quot; أو &quot;المنصة&quot;)، نحترم خصوصيتك
              ونسعى لحماية بياناتك الشخصية. توضح هذه &quot;سياسة الخصوصية&quot;
              كيفية جمعنا واستخدامنا وحمايتنا للمعلومات التي تزودنا بها عند
              استخدامك للمنصة، والموقع الإلكتروني، والخدمات المرتبطة بها (ويشار
              إليها مجتمعة بـ &quot;المنصة&quot;). باستخدامك لمنصة Sanatack،
              فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                1. المعلومات التي نجمعها
              </h3>
              <p className="mb-2">
                عند إنشاء حساب أو استخدام خدماتنا، قد نقوم بجمع وتخزين المعلومات
                التالية:
              </p>
              <ul className="list-disc mr-6 space-y-1">
                <li>الاسم</li>
                <li>البريد الإلكتروني</li>
                <li>اسم المستخدم</li>
              </ul>
              <p className="mt-2">
                لا نقوم بجمع معلومات شخصية حساسة مثل أرقام الهوية الوطنية أو
                بيانات بطاقات الدفع أو العناوين بشكل مباشر.
              </p>
              <p className="mt-2">
                تتم معالجة المدفوعات الخاصة بالخطط المدفوعة عبر Stripe، وهو مزود
                دفع تابع لطرف ثالث وآمن. لا تقوم Sanatack بتخزين أو الوصول إلى
                بيانات بطاقتك البنكية.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                2. كيفية استخدامنا لمعلوماتك
              </h3>
              <p className="mb-2">نستخدم المعلومات التي نجمعها من أجل:</p>
              <ul className="list-disc mr-6 space-y-1">
                <li>إنشاء وإدارة حسابات المستخدمين</li>
                <li>توفير الوصول إلى الأدوات التعليمية والذكاء الاصطناعي</li>
                <li>إرسال التحديثات والإشعارات والتنبيهات الأمنية المهمة</li>
                <li>تحسين أداء المنصة وتجربة المستخدم</li>
                <li>الرد على طلبات الدعم أو الاستفسارات</li>
              </ul>
              <p className="mt-2">
                لا نقوم ببيع أو تأجير بيانات المستخدمين لأي طرف ثالث.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                3. استخدام تقنيات الذكاء الاصطناعي
              </h3>
              <p className="mb-2">
                تعتمد منصتنا على واجهة برمجة تطبيقات OpenAI لتوليد محتوى تعليمي
                وتعلمي. عند استخدامك لميزات الذكاء الاصطناعي:
              </p>
              <ul className="list-disc mr-6 space-y-1">
                <li>
                  قد يتم إرسال مدخلاتك (مثل الأسئلة أو النصوص) إلى خوادم OpenAI
                  لمعالجتها.
                </li>
                <li>
                  يتم التعامل مع هذه التفاعلات وفقًا لسياسات الخصوصية المعمول
                  بها لدى OpenAI.
                </li>
              </ul>
              <p className="mt-2">
                نحث المستخدمين على عدم إدخال معلومات شخصية حساسة أو سرية عند
                التفاعل مع أدوات الذكاء الاصطناعي.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. معالجة الدفع</h3>
              <p className="mb-2">
                تتم جميع عمليات الدفع عبر Stripe بشكل آمن. قد تقوم Stripe بجمع
                قدر محدود من المعلومات اللازمة لإتمام عملية الدفع، مثل اسمك
                وبريدك الإلكتروني وبيانات وسيلة الدفع. لا تقوم Sanatack بتخزين
                أو التحكم في هذه البيانات.
              </p>
              <p>
                لمزيد من المعلومات، يمكنك مراجعة سياسة الخصوصية الخاصة بـ Stripe
                عبر الرابط:{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  https://stripe.com/privacy
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                5. تخزين البيانات وأمنها
              </h3>
              <p>
                نتخذ تدابير تقنية وتنظيمية مناسبة لحماية بيانات المستخدمين من
                الوصول غير المصرح به أو التعديل أو الإتلاف. يتم تخزين بيانات
                الدخول إلى حسابك بشكل مشفر وآمن. ومع ذلك، لا يمكن لأي وسيلة
                إلكترونية أن تكون آمنة بنسبة 100٪.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. مشاركة البيانات</h3>
              <p className="mb-2">
                قد نشارك قدرًا محدودًا من بياناتك مع مزودي خدمات موثوقين لأغراض
                تشغيلية فقط، بما في ذلك:
              </p>
              <ul className="list-disc mr-6 space-y-1">
                <li>OpenAI (لتوليد المحتوى المعتمد على الذكاء الاصطناعي)</li>
                <li>Stripe (لمعالجة عمليات الدفع)</li>
              </ul>
              <p className="mt-2">
                لا نقوم بمشاركة بيانات المستخدمين مع المعلنين أو جهات التسويق
                التابعة لأطراف ثالثة.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                7. الاحتفاظ بالبيانات
              </h3>
              <p className="mb-2">
                نحتفظ ببيانات المستخدمين فقط للمدة اللازمة من أجل:
              </p>
              <ul className="list-disc mr-6 space-y-1">
                <li>الحفاظ على حسابك وتقديم الخدمات</li>
                <li>الامتثال للالتزامات القانونية</li>
                <li>حل النزاعات وتطبيق اتفاقياتنا</li>
              </ul>
              <p className="mt-2">
                يمكن للمستخدمين طلب حذف حساباتهم في أي وقت عن طريق التواصل معنا
                عبر البريد الإلكتروني:{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2"
                >
                  support@sanatack.com
                </a>
                .
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. حقوقك</h3>
              <p className="mb-2">
                بحسب الأنظمة السارية في بلدك، قد يكون لك الحقوق التالية:
              </p>
              <ul className="list-disc mr-6 space-y-1">
                <li>طلب الوصول إلى البيانات الشخصية التي نحتفظ بها عنك</li>
                <li>طلب تصحيح أو حذف بياناتك</li>
                <li>
                  سحب الموافقة على المعالجة (إن كانت المعالجة مبنية على موافقة)
                </li>
              </ul>
              <p className="mt-2">
                يمكن تقديم الطلبات عبر البريد الإلكتروني:{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2"
                >
                  support@sanatack.com
                </a>
                ، وسنقوم بالرد خلال فترة زمنية معقولة.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. خصوصية الأطفال</h3>
              <p>
                تم تصميم منصة Sanatack لتكون مناسبة لمختلف الأعمار، ولكن يجب أن
                يستخدمها الأفراد دون سن 18 عامًا تحت إشراف أحد الوالدين أو الوصي
                القانوني. لا نقوم بجمع بيانات شخصية من الأطفال عن عمد دون موافقة
                ولي الأمر.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                10. التغييرات على سياسة الخصوصية
              </h3>
              <p>
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أحدث نسخة على
                موقعنا الإلكتروني مع تحديث تاريخ &quot;آخر تحديث&quot;.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">11. التواصل معنا</h3>
              <p>
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو حول كيفية
                تعاملنا مع بياناتك، فيرجى التواصل معنا عبر البريد الإلكتروني:{" "}
                <a
                  href="mailto:support@sanatack.com"
                  className="underline underline-offset-2"
                >
                  support@sanatack.com
                </a>
                .
              </p>
            </section>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
