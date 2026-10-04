# Maestro Markdown Viewer — Persian RTL

## نصب
1. فایل ZIP را Extract کنید.
2. در Chrome آدرس `chrome://extensions` را باز کنید.
3. Developer mode را فعال کنید.
4. روی Load unpacked کلیک و پوشه اکستنشن را انتخاب کنید.
5. در جزئیات اکستنشن، **Allow access to file URLs** را فعال کنید.
6. یک فایل `.md` یا `.markdown` را با Chrome باز کنید.

## قواعد جهت و فونت
- وجود حتی یک حرف فارسی/عربی/عبری در بلوک: RTL + فونت فارسی انتخابی.
- متن کاملاً انگلیسی: LTR + Inter یا فونت‌های استاندارد سیستم.
- Code block و inline code: همیشه LTR و monospace.
- انتخاب فونت فارسی: IranSans X، IranSans، Vazirmatn، IranYekan X.

## امکانات
- تم روشن، تیره و خودکار
- فهرست مطالب خودکار
- جداول، نقل‌قول، تصویر، لینک، لیست و کد
- کپی کد
- چاپ تمیز
- تنظیم عرض، اندازه متن و فاصله خطوط
- اجرای کاملاً محلی و بدون ارسال محتوا


## Version 1.0.1
- Persian Table of Contents entries always use IRANSansX.
- The Settings button in the Markdown viewer header opens the extension options page directly.

## Version 1.0.2
- Removed the Manifest V3 inline-script CSP violation from the popup.
- Settings are opened through the extension service worker using chrome.runtime.openOptionsPage().

## Version 1.2.0

- Renders Mermaid `graph TB`, `graph LR`, and `stateDiagram-v2` blocks as responsive SVG diagrams.
- Adds diagram zoom, source copy, and collapsible Mermaid source.
- Adds Prism-based syntax highlighting for JavaScript, TypeScript, JSX/TSX, JSON, HTML/XML, CSS, Bash, PowerShell, Python, C#, Java, SQL, YAML, Dockerfile, Go, Rust, PHP, Ruby, Kotlin, Swift, Diff, Markdown, and Mermaid.
- Adds line numbers, line count, normalized language labels, and improved code-copy behavior.
- Uses the supplied Maestro Markdown logo for the extension icons and viewer header.


## نسخه 1.2.0
- بازطراحی رندر Mermaid برای متن فارسی با HTML foreignObject، RTL مستقل و اندازه‌گیری پویا.
- اصلاح عنوان subgraph، برچسب یال‌ها، فاصله‌گذاری و Fullscreen.
- رنگ‌آمیزی کدها با PrismJS و نام‌گذاری بهتر زبان‌ها.

## نسخه 1.3.0

### Mermaid
- رندر با **Mermaid رسمی نسخه ۱۱** (`vendor/mermaid.min.js`) جایگزین رندرکنندهٔ دست‌ساز شد؛
  چیدمان، اندازهٔ Nodeها، عرض برچسب یال‌ها و عنوان `subgraph` را خود Mermaid با
  اندازه‌گیری واقعی DOM حساب می‌کند، پس دیگر روی‌هم‌افتادگی و برش متن فارسی رخ نمی‌دهد.
- رندرکنندهٔ قبلی به‌عنوان **fallback** حفظ شد؛ اگر Mermaid نمودار خاصی را نتواند parse کند،
  همان نمودار با موتور قدیمی کشیده می‌شود و بقیهٔ صفحه سالم می‌ماند.
- هر خطِ Label جداگانه `unicode-bidi: plaintext` می‌گیرد، بنابراین خطی مثل
  `OwnerId = خریدار` دیگر به `خریدار = OwnerId` برنمی‌گردد و فارسی و انگلیسی قاطی نمی‌شوند.
- پشتهٔ فونت Mermaid: اول **Inter** برای لاتین و اعداد، سپس **IranSans X** برای فارسی.
  رندر تا آماده‌شدن فونت‌ها (`document.fonts.ready`) صبر می‌کند تا اندازه‌گیری درست باشد.
- حاشیهٔ پاراگرافِ مقاله دیگر به داخل `foreignObject` نشت نمی‌کند — برچسب یال‌ها و
  عنوان `subgraph` قبلاً به همین دلیل خالی یا جابه‌جا دیده می‌شدند.
- رنگ‌های نمودار از تم صفحه خوانده می‌شود و با تغییر تم، نمودارها دوباره رندر می‌شوند.
- در `stateDiagram` متنِ داخل باکس‌ها با رنگ خودِ باکس کشیده می‌شد (سفید روی سفید) و
  باکس‌ها خالی به نظر می‌رسیدند؛ `labelTextColor` تنظیم شد و یک قاعدهٔ پشتیبان هم اضافه شد
  تا هیچ نوع نموداری نتواند متن Label را هم‌رنگ پس‌زمینه بکشد.
- Fullscreen: نمودار با `preserveAspectRatio` کامل داخل کادر جا می‌شود، نسبت تصویر حفظ
  می‌شود، و با کلید `Esc` بسته می‌شود.

### رنگ‌آمیزی کد
- باندل PrismJS به نسخهٔ 1.30.0 با بیش از ۸۰ زبان به‌روز شد. زبان‌های ادعاشده در نسخهٔ قبل
  (TypeScript، TSX/JSX، C#، Java، Bash، PowerShell، YAML، Rust، PHP، Ruby، Kotlin،
  Dockerfile، Markdown، C/C++، GraphQL، TOML، INI، Diff و …) واقعاً در باندل نبودند و حالا هستند.
- شمارهٔ خطوط به‌جای تکه‌تکه‌کردن HTMLِ خروجی Prism، در یک ستون جدا رندر می‌شود؛
  رشته‌ها و کامنت‌های چندخطی دیگر رنگ‌آمیزی را خراب نمی‌کنند.

### فهرست و پیمایش
- لینک‌های داخلی (`[...](#عنوان)`) دیگر تب جدید باز نمی‌کنند و در همان صفحه به هدف می‌روند.
  `target="_blank"` فقط به لینک‌های واقعاً بیرونی داده می‌شود.
- شناسهٔ عنوان‌ها با قاعدهٔ GitHub ساخته می‌شود (هر فاصله یک خط تیره، بدون ادغام)، پس
  لینک‌هایی مثل `#فرم-۱--فاکتور-خرید` دقیقاً می‌خورند؛ در صورت اختلاف جزئی هم تطبیق تقریبی انجام می‌شود.
- عنوان فعال در ستون فهرست هنگام پیمایش هایلایت می‌شود و مقصدِ لینک لحظه‌ای فلش می‌زند.
- خطوطی که فقط تگ HTML هستند (مثل `<div dir="rtl">`) دیگر به‌صورت متن خام چاپ نمی‌شوند.
