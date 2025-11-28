import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";
const LAST_UPDATED = "November 23, 2025";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { i18n } = useTranslation();
  const language = i18n.language as "en" | "ar";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#09090b]">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {language === "en" ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Sanatack – Terms and Conditions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Last updated: {LAST_UPDATED}
              </p>

              <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <p>
                  Welcome to Sanatack (&quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;). These Terms and Conditions
                  (&quot;Terms&quot;) govern your access to and use of the
                  Sanatack platform, website, mobile app, and all related
                  services (collectively, the &quot;Platform&quot;). By
                  accessing or using Sanatack, you agree to be bound by these
                  Terms. If you do not agree, please do not use our Platform.
                </p>

                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
                  <p>
                    Sanatack is available to users of all ages. However, if you
                    are under 18, you must use the Platform under the
                    supervision of a parent or legal guardian who agrees to
                    these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">2. Accounts</h2>
                  <p className="mb-2">
                    To access certain features, you must create an account. You
                    agree to:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Provide accurate and complete information (name, email,
                      username).
                    </li>
                    <li>
                      Keep your login credentials secure and confidential.
                    </li>
                    <li>Be responsible for all activity under your account.</li>
                  </ul>
                  <p className="mt-2">
                    We reserve the right to suspend or terminate any account
                    that violates these Terms or engages in fraudulent or
                    abusive activity.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    3. Services and AI Content
                  </h2>
                  <p className="mb-2">
                    Sanatack provides AI-based educational and learning tools
                    powered in part by OpenAI’s API. You acknowledge that:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      AI-generated content may not always be accurate or
                      appropriate.
                    </li>
                    <li>
                      You are responsible for how you use the content provided
                      by AI tools.
                    </li>
                    <li>
                      Sanatack is not liable for errors, omissions, or any
                      outcomes resulting from reliance on AI outputs.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    4. Paid Plans and Payments
                  </h2>
                  <p>
                    Sanatack offers both free and paid plans. Payments are
                    processed securely through Moyasar, a third-party payment
                    provider. By subscribing to a paid plan, you agree to
                    Moyasar’s payment terms and authorize recurring billing if
                    applicable. We do not store or directly handle credit card
                    information.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    5. Intellectual Property
                  </h2>
                  <p>
                    All materials on Sanatack—including logos, designs,
                    software, text, and course content—are owned by Sanatack or
                    its licensors. You may not copy, reproduce, distribute, or
                    modify any part of the Platform without prior written
                    permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    6. User Content
                  </h2>
                  <p>
                    By posting or uploading content (such as reviews, comments,
                    or AI-generated inputs), you grant Sanatack a non-exclusive,
                    worldwide, royalty-free license to use, display, and
                    distribute that content for operational or promotional
                    purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    7. Prohibited Uses
                  </h2>
                  <p className="mb-2">You agree not to use Sanatack for:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Illegal, harmful, or fraudulent activities.</li>
                    <li>
                      Attempting to reverse-engineer or misuse our AI systems.
                    </li>
                    <li>Sharing offensive or misleading content.</li>
                  </ul>
                  <p className="mt-2">
                    Violations may result in suspension or permanent termination
                    of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    8. Limitation of Liability
                  </h2>
                  <p>
                    Sanatack and its team shall not be held liable for any
                    direct or indirect damages arising from use of the Platform,
                    reliance on AI-generated information, or service
                    interruptions or data loss. Use of the Platform is at your
                    own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
                  <p>
                    We may suspend or terminate access to your account at any
                    time, with or without notice, for conduct that violates
                    these Terms or harms the integrity of the Platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    10. Changes to These Terms
                  </h2>
                  <p>
                    We may update these Terms periodically. The latest version
                    will always be posted on our website with a revised
                    &quot;Last updated&quot; date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    11. Governing Law
                  </h2>
                  <p>
                    These Terms are governed by the laws of the Kingdom of Saudi
                    Arabia. Any disputes will be resolved under Saudi
                    jurisdiction.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
                  <p>
                    For questions about these Terms, please contact:{" "}
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
            </>
          ) : (
            <section
              dir="rtl"
              className="text-right space-y-8 text-gray-800 dark:text-gray-200"
            >
              <h2 className="text-2xl font-bold mb-2">
                منصة Sanatack – الشروط والأحكام
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                آخر تحديث: {LAST_UPDATED}
              </p>

              <p>
                مرحبًا بك في Sanatack (&quot;نحن&quot; أو &quot;المنصة&quot;).
                تنظم هذه الشروط والأحكام (&quot;الشروط&quot;) استخدامك والوصول
                إلى منصة Sanatack وموقعها الإلكتروني وتطبيقها وجميع الخدمات
                المرتبطة بها (ويشار إليها مجتمعة بـ &quot;المنصة&quot;).
                باستخدامك لمنصة Sanatack، فإنك توافق على الالتزام بهذه الشروط.
                إذا كنت لا توافق على أي منها، فيرجى التوقف عن استخدام المنصة
                فورًا.
              </p>

              <section>
                <h3 className="text-lg font-semibold mb-2">1. الأهلية</h3>
                <p>
                  تُتاح منصة Sanatack لجميع الفئات العمرية. ومع ذلك، إذا كنت دون
                  سن 18 عامًا، فيجب عليك استخدام المنصة تحت إشراف أحد الوالدين
                  أو الوصي القانوني الذي يوافق على هذه الشروط.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. الحسابات</h3>
                <p className="mb-2">
                  للوصول إلى بعض ميزات المنصة، يجب عليك إنشاء حساب. وتوافق على
                  ما يلي:
                </p>
                <ul className="list-disc mr-6 space-y-1">
                  <li>
                    تقديم معلومات دقيقة وكاملة (الاسم، البريد الإلكتروني، اسم
                    المستخدم).
                  </li>
                  <li>الحفاظ على سرية بيانات الدخول إلى الحساب.</li>
                  <li>
                    تحمل المسؤولية الكاملة عن جميع الأنشطة التي تتم من خلال
                    حسابك.
                  </li>
                </ul>
                <p className="mt-2">
                  يحتفظ فريق Sanatack بالحق في تعليق أو إنهاء أي حساب في حال
                  انتهاك هذه الشروط أو عند وجود نشاط احتيالي أو مسيء.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  3. الخدمات والمحتوى الذكي (الذكاء الاصطناعي)
                </h3>
                <p className="mb-2">
                  تقدم منصة Sanatack أدوات تعليمية قائمة على الذكاء الاصطناعي،
                  مدعومة جزئيًا من خلال واجهة برمجة تطبيقات OpenAI. وتقر بما
                  يلي:
                </p>
                <ul className="list-disc mr-6 space-y-1">
                  <li>
                    قد لا تكون مخرجات الذكاء الاصطناعي دقيقة أو مناسبة في جميع
                    الحالات.
                  </li>
                  <li>
                    أنت المسؤول عن كيفية استخدامك للمحتوى المولد بواسطة الذكاء
                    الاصطناعي.
                  </li>
                  <li>
                    لا تتحمل Sanatack أي مسؤولية عن الأخطاء أو النتائج الناتجة
                    عن الاعتماد على هذه المخرجات.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  4. الخطط المدفوعة والدفع
                </h3>
                <p>
                  تقدم Sanatack خططًا مجانية وأخرى مدفوعة. تُعالج عمليات الدفع
                  بأمان من خلال خدمة Moyasar، وهي مزود دفع تابع لطرف ثالث.
                  وباشتراكك في خطة مدفوعة، فإنك توافق على شروط Moyasar وتفوض
                  عمليات الدفع المتكررة عند الاقتضاء. لا نقوم بتخزين أو معالجة
                  بيانات بطاقات الدفع بشكل مباشر.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  5. الملكية الفكرية
                </h3>
                <p>
                  جميع المواد الموجودة على منصة Sanatack، بما في ذلك الشعارات،
                  التصاميم، النصوص، البرامج، والمحتوى التعليمي، هي ملك لـ
                  Sanatack أو مرخصة لها. يُحظر نسخ أو إعادة إنتاج أو توزيع أو
                  تعديل أي جزء من المنصة دون إذن كتابي مسبق.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  6. محتوى المستخدم
                </h3>
                <p>
                  عند نشر أو تحميل أي محتوى (مثل المراجعات أو التعليقات أو
                  المدخلات الخاصة بالذكاء الاصطناعي)، فإنك تمنح Sanatack ترخيصًا
                  غير حصري، عالمي، مجاني لاستخدام هذا المحتوى أو عرضه أو توزيعه
                  لأغراض تشغيلية أو ترويجية.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  7. الاستخدامات المحظورة
                </h3>
                <p className="mb-2">توافق على عدم استخدام المنصة في:</p>
                <ul className="list-disc mr-6 space-y-1">
                  <li>أي أنشطة غير قانونية أو ضارة أو احتيالية.</li>
                  <li>
                    محاولة عكس هندسة الأنظمة أو إساءة استخدام خدمات الذكاء
                    الاصطناعي.
                  </li>
                  <li>نشر محتوى مسيء أو مضلل.</li>
                </ul>
                <p className="mt-2">
                  قد يؤدي أي انتهاك إلى تعليق أو إنهاء حسابك نهائيًا.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  8. حدود المسؤولية
                </h3>
                <p>
                  لا تتحمل Sanatack أو فريقها أي مسؤولية عن أي أضرار مباشرة أو
                  غير مباشرة ناتجة عن استخدام المنصة، أو الاعتماد على المعلومات
                  الناتجة عن الذكاء الاصطناعي، أو انقطاع الخدمة أو فقدان
                  البيانات. استخدامك للمنصة يكون على مسؤوليتك الخاصة.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">9. إنهاء الخدمة</h3>
                <p>
                  يجوز لنا تعليق أو إنهاء وصولك إلى حسابك في أي وقت، دون إشعار
                  مسبق، إذا تم انتهاك هذه الشروط أو في حال أي تصرف يضر بسلامة
                  المنصة.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  10. التعديلات على الشروط
                </h3>
                <p>
                  قد نقوم بتحديث هذه الشروط من وقت لآخر. سيتم نشر أحدث نسخة على
                  موقعنا الإلكتروني مع تحديث تاريخ &quot;آخر تحديث&quot;.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">
                  11. القانون الواجب التطبيق
                </h3>
                <p>
                  تخضع هذه الشروط لأحكام وأنظمة المملكة العربية السعودية. وتُحل
                  أي نزاعات وفقًا للجهات القضائية المختصة في المملكة.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">12. التواصل معنا</h3>
                <p>
                  للاستفسارات أو الملاحظات حول هذه الشروط، يرجى التواصل معنا عبر
                  البريد الإلكتروني:{" "}
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
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
