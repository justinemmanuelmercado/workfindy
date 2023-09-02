import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import { printToHtmlAndTruncate, toRelativeDate } from '../common';
import { notice, notices } from './[uuid].astro';

<Fragment>
<Layout title={notice.title || 'Job Title'}>
<Header />
<div class="p-1 md:p-2 max-w-7xl m-auto">
<pre>{notice}</pre>
<div class="p-4 rounded-xl space-y-4">
<div class="inline-block">
<h2>{notice.source.name}</h2>
</div>
<p class="text-xs font-extralight">{toRelativeDate(notice.publishedDate)}</p>
<a class="block" href={notice.url}>
<button class="border border-primary-200 rounded-xl py-2 px-8 md:px-5 w-full md:w-fit font-bold text-primary-200">
Apply
</button>
</a>
<a class="block" href="/">
<button class="border border-secondary-200 rounded-xl py-2 px-8 md:px-5 w-full md:w-fit font-bold text-secondary-200">
Go Back
</button>
</a>
</div>
<div class="flex justify-end flex-col md:flex-row space-x-0 space-y-2 md:space-y-0 md:space-x-4">
<a class="block" href={notice.url}> </a>
</div>
<main class="grid grid-rows-2 grid-cols-none lg:grid-rows-none lg:grid-cols-2 gap-4">
<section>
<h1 class="text-3xl font-bold">{printToHtml(notice.title)}</h1>
<div class="bg-neutral-950 border border-neutral-800 px-4 max-h-screen overflow-y-scroll">
<article class="prose prose-invert md:prose-lg lg:prose-xl" set:html={notice.body} />
</div>
</section>
<section>
<h1 class="text-3xl font-bold">More from {notice.source.name}</h1>
<div class="max-h-screen overflow-y-scroll p-4 border border-neutral-800 gap-2 flex flex-col">
{notices.map((relatedNotice, i) => {
const bg = i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300';
return (
<Fragment><div class={`flex flex-col p-4 rounded-xl ${bg} shadow-sm hover:border-neutral-500 border border-neutral-900 space-y-1 md:p-4`}>
<a href={`/${relatedNotice.id}`}>
<p class="font-bold">{relatedNotice.title}</p>

<p class="hidden md:block">{printToHtmlAndTruncate(relatedNotice.body, 150)}</p>
<p class="text-xs font-extralight">{toRelativeDate(relatedNotice.publishedDate)}</p>
</a>
<p class="text-xs font-extralight hover:text-primary-200">
<a class="underline" href={notice.source.homepage}>
From {notice.source.name}
</a>
</p>
<hr />
<div class="flex justify-end">
<a class="block w-full md:w-fit" href={relatedNotice.url}>
<button class="border border-primary-200 rounded-xl py-2 px-8 md:px-5 w-full font-bold text-primary-200">
Apply
</button>
</a>
</div>
</div></Fragment>
);
})}
</div>
</section>
</main>
</div>
</Layout>

</Fragment>;
